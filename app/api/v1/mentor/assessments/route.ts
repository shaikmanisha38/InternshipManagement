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

    const assessments = await prisma.assessment.findMany({
      where: { mentorId },
      include: {
        submissions: {
          include: {
            user: { select: { name: true, profileImage: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedAssessments = assessments.map(assessment => {
      // Sort submissions by total score descending for ranking
      const sortedSubmissions = [...assessment.submissions].sort((a, b) => b.totalScore - a.totalScore);
      
      const rankedSubmissions = sortedSubmissions.map((sub, index) => ({
        key: sub.id,
        assessmentId: assessment.id,
        studentId: sub.userId,
        name: sub.user.name,
        avatar: sub.user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.user.name)}`,
        quizScore: sub.quizScore,
        maxQuiz: assessment.mcqCount, // Assuming 1 pt per mcq
        codingScore: sub.codingScore,
        maxCoding: assessment.taskCount * 25, // Assuming 25 pts per task
        totalScore: sub.totalScore,
        maxTotal: assessment.mcqCount + (assessment.taskCount * 25),
        rank: index + 1
      }));

      return {
        id: assessment.id,
        title: assessment.title,
        status: assessment.status,
        metrics: {
          mcqs: assessment.mcqCount,
          coding: assessment.taskCount
        },
        duration: assessment.timeLimit || 0,
        submissions: rankedSubmissions
      };
    });

    return NextResponse.json({ data: formattedAssessments });
  } catch (error: any) {
    console.error('Error fetching mentor assessments:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, status, duration, passingMarks, mcqs, codingTasks } = body;

    const newAssessment = await prisma.assessment.create({
      data: {
        title,
        status: status || 'Draft',
        timeLimit: duration,
        passingScore: passingMarks || 0,
        mcqCount: mcqs || 0,
        taskCount: codingTasks || 0,
        mentorId
      }
    });

    return NextResponse.json({ message: 'Assessment created successfully', data: newAssessment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
