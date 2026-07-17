import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
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

    // 1. Check StudentInternship
    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        status: 'ONGOING'
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ status: 'locked', message: 'No active internship' });
    }

    // Determine current week
    const currentWeek = studentInternship.currentWeek;
    
    // Fetch the assessment for this week
    // We assume Assessments are global or linked to week. The schema shows Assessment has `week` Int.
    const assessment = await prisma.assessment.findFirst({
      where: {
        week: currentWeek
      },
      include: {
        questions: true
      }
    });

    if (!assessment) {
      // No assessment for this week
      return NextResponse.json({ status: 'locked', message: 'No assessment assigned for this week yet.' });
    }

    // Check if the student has reached the required day to unlock the assessment (e.g. Day 7)
    // For this implementation, if currentDay < 7, we lock it. 
    if (studentInternship.currentDay < 7) {
      return NextResponse.json({ 
        status: 'locked', 
        message: 'Assessment is locked until you reach Day 7 of the current week.',
        assessment: {
          title: assessment.title,
          quizQuestions: assessment.questions.filter(q => q.type === 'MCQ').length,
          codingProblems: assessment.questions.filter(q => q.type === 'CODING').length,
          passingMarks: assessment.passingScore,
          totalMarks: assessment.questions.reduce((acc, q) => acc + q.points, 0)
        }
      });
    }

    // Check if the user has a submission
    const submission = await prisma.assessmentSubmission.findFirst({
      where: {
        assessmentId: assessment.id,
        userId: userId
      },
      orderBy: {
        completedAt: 'desc'
      }
    });

    const assessmentPayload = {
      title: assessment.title,
      quizQuestions: assessment.questions.filter(q => q.type === 'MCQ').length,
      codingProblems: assessment.questions.filter(q => q.type === 'CODING').length,
      passingMarks: assessment.passingScore,
      totalMarks: assessment.questions.reduce((acc, q) => acc + q.points, 0)
    };

    if (submission) {
      return NextResponse.json({
        status: 'completed',
        assessment: assessmentPayload,
        submission: {
          score: submission.scoreObtained,
          correctCount: submission.correctCount,
          wrongCount: submission.wrongCount,
          feedback: submission.feedback
        }
      });
    } else {
      return NextResponse.json({
        status: 'pending',
        assessment: assessmentPayload
      });
    }

  } catch (error: any) {
    console.error('Error fetching assessment data:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
