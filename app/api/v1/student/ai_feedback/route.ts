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
    let userId;
    try {
      const verified = await jwtVerify(token, secret);
      userId = verified.payload.userId as string;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Fetch the latest submission for this user that has an AI evaluation
    const latestSubmission = await prisma.taskSubmission.findFirst({
      where: { 
        userId,
        aiEvaluation: {
          isNot: null
        }
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        task: true,
        aiEvaluation: true
      }
    });

    if (!latestSubmission || !latestSubmission.aiEvaluation) {
      return NextResponse.json({ 
        hasEvaluation: false,
        message: 'No AI evaluation found for this user.'
      });
    }

    const aiEval = latestSubmission.aiEvaluation;

    return NextResponse.json({
      hasEvaluation: true,
      taskTitle: latestSubmission.task.title,
      score: aiEval.score,
      feedback: aiEval.feedback,
      metrics: aiEval.metrics,
      strengths: aiEval.strengths,
      weaknesses: aiEval.weaknesses,
      suggestions: aiEval.suggestions,
      evaluatedAt: aiEval.evaluatedAt
    });

  } catch (error: any) {
    console.error('Error fetching AI feedback:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
