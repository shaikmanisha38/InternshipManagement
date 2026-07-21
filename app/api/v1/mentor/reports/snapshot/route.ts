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

    const studentIds = [...new Set([
      ...mentoredInternships.map(i => i.studentId),
      ...mentoredProjects.map(p => p.studentId)
    ])];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const tasksCompleted = await prisma.taskSubmission.count({
      where: {
        userId: { in: studentIds },
        status: 'VERIFIED',
        submittedAt: { gte: oneWeekAgo }
      }
    });

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const studentsActive = await prisma.attendance.count({
      where: {
        studentId: { in: studentIds },
        date: { gte: startOfToday },
        status: 'Present'
      }
    });

    const pendingReviews = await prisma.taskSubmission.count({
      where: {
        userId: { in: studentIds },
        status: 'PENDING'
      }
    });

    const certificatesIssued = await prisma.certificate.count({
      where: {
        studentId: { in: studentIds },
        issuedDate: { gte: oneWeekAgo }
      }
    });

    return NextResponse.json({
      tasksCompleted,
      tasksTarget: 200,
      studentsActive,
      pendingReviews,
      certificatesIssued
    });
  } catch (error: any) {
    console.error('Error fetching mentor reports snapshot:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
