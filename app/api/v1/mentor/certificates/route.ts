import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function getMentorId(req: Request) {
  const authHeader = req.headers.get('authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const role = verified.payload.role as string;
    if (role !== 'MENTOR' && role !== 'ADMIN') return null;
    return verified.payload.userId as string;
  } catch { return null; }
}

export async function GET(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];

    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      include: {
        certificates: { where: { mentorId } },
        assessmentSubmissions: true
      }
    });

    let totalIssued = 0;
    let totalPending = 0;

    const roster = students.map(student => {
      let scoreSum = 0;
      let maxScoreSum = 0;
      student.assessmentSubmissions.forEach(sub => {
        scoreSum += sub.totalScore;
        maxScoreSum += 100;
      });
      const finalScore = maxScoreSum > 0 ? Math.round((scoreSum / maxScoreSum) * 100) : 0;
      
      let cert = student.certificates[0];
      let status = cert?.status || 'NOT_GENERATED';
      let issuedAt = cert?.issuedAt || null;
      let credentialId = cert?.credentialId || null;

      if (!cert && finalScore >= 50) {
        status = 'PENDING';
      }

      if (status === 'ISSUED') totalIssued++;
      if (status === 'PENDING') totalPending++;

      return {
        key: student.id,
        studentId: student.id,
        name: student.name,
        avatar: student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}`,
        batch: "Batch 2024-A",
        finalScore,
        status,
        issuedAt,
        credentialId
      };
    });

    return NextResponse.json({ 
      data: roster,
      metrics: {
        issuedCount: totalIssued,
        pendingCount: totalPending
      }
    });
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
