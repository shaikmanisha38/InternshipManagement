import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import crypto from 'crypto';

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

export async function POST(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { studentId, bulk } = body;

    if (bulk) {
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

      const pendingStudents = students.filter(s => {
        let scoreSum = 0;
        let maxScoreSum = 0;
        s.assessmentSubmissions.forEach(sub => {
          scoreSum += sub.totalScore;
          maxScoreSum += 100;
        });
        const finalScore = maxScoreSum > 0 ? Math.round((scoreSum / maxScoreSum) * 100) : 0;
        
        const cert = s.certificates[0];
        const status = cert?.status || 'NOT_GENERATED';
        return (!cert && finalScore >= 50) || status === 'PENDING';
      });

      const upserts = pendingStudents.map(student => {
        let scoreSum = 0;
        let maxScoreSum = 0;
        student.assessmentSubmissions.forEach(sub => {
          scoreSum += sub.totalScore;
          maxScoreSum += 100;
        });
        const finalScore = maxScoreSum > 0 ? Math.round((scoreSum / maxScoreSum) * 100) : 0;
        
        const credId = crypto.randomUUID();

        return prisma.certificate.upsert({
          where: { studentId_mentorId: { studentId: student.id, mentorId } },
          update: {
            status: 'ISSUED',
            issuedAt: new Date(),
            finalScore,
            credentialId: credId
          },
          create: {
            studentId: student.id,
            mentorId,
            status: 'ISSUED',
            issuedAt: new Date(),
            finalScore,
            credentialId: credId
          }
        });
      });

      await prisma.$transaction(upserts);
      return NextResponse.json({ message: 'Bulk generated successfully' });
    } else if (studentId) {
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: { assessmentSubmissions: true }
      });
      if (!student) return NextResponse.json({ message: 'Not found' }, { status: 404 });

      let scoreSum = 0;
      let maxScoreSum = 0;
      student.assessmentSubmissions.forEach(sub => {
        scoreSum += sub.totalScore;
        maxScoreSum += 100;
      });
      const finalScore = maxScoreSum > 0 ? Math.round((scoreSum / maxScoreSum) * 100) : 0;

      const credId = crypto.randomUUID();

      const cert = await prisma.certificate.upsert({
        where: { studentId_mentorId: { studentId, mentorId } },
        update: {
          status: 'ISSUED',
          issuedAt: new Date(),
          finalScore,
          credentialId: credId
        },
        create: {
          studentId,
          mentorId,
          status: 'ISSUED',
          issuedAt: new Date(),
          finalScore,
          credentialId: credId
        }
      });
      return NextResponse.json({ message: 'Generated successfully', data: cert });
    }

    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });

  } catch (error: any) {
    console.error('Error generating certificates:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
