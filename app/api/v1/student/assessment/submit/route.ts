import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
    }

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId as string;

    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        status: 'ONGOING'
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'No active internship' }, { status: 404 });
    }

    const currentWeek = studentInternship.currentWeek;
    
    const assessment = await prisma.assessment.findFirst({
      where: {
        week: currentWeek
      }
    });

    if (!assessment) {
      return NextResponse.json({ message: 'No assessment assigned for this week.' }, { status: 404 });
    }

    // Create a mock successful submission
    const newSubmission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId: assessment.id,
        userId: userId,
        scoreObtained: 100, // perfect score
        correctCount: assessment.totalQuestions || 10,
        wrongCount: 0,
        passed: true,
        feedback: {
          quiz: "Perfect score on all questions!",
          coding: "All test cases passed."
        }
      }
    });

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting assessment:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
