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

export async function POST(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { studentId, vectors } = await req.json();

    if (!studentId || !vectors || !Array.isArray(vectors)) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const includeOptions: any = {};

    if (vectors.includes('profile')) {
      includeOptions.certificates = true;
      includeOptions.leaderboard = true;
    }

    if (vectors.includes('attendance')) {
      includeOptions.attendance = { orderBy: { date: 'desc' }, take: 10 };
      includeOptions.githubAccount = true;
      includeOptions.taskSubmissions = {
        where: { githubCommits: { some: {} } },
        include: { githubCommits: true },
        take: 5
      };
    }

    if (vectors.includes('progress')) {
      if (!includeOptions.taskSubmissions) {
        includeOptions.taskSubmissions = { include: { aiEvaluation: true, task: true } };
      } else {
        includeOptions.taskSubmissions.include.aiEvaluation = true;
        includeOptions.taskSubmissions.include.task = true;
      }
      includeOptions.assessmentSubmissions = { include: { assessment: true } };
      includeOptions.studentInternships = true;
      includeOptions.taskTrackers = true;
    }

    const studentData = await prisma.user.findUnique({
      where: { id: studentId },
      include: includeOptions
    });

    if (!studentData) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Strip out password
    const { password, ...safeData } = studentData;

    return NextResponse.json({ data: safeData });
  } catch (error: any) {
    console.error('Error fetching custom report:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
