import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
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
    let payloadJwt;
    try {
      const verified = await jwtVerify(token, secret);
      payloadJwt = verified.payload;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const userId = payloadJwt.userId as string;

    const payload = await req.json();
    const { taskId, repositoryUrl, branch, commitHash, notes } = payload;

    if (!taskId) {
      return NextResponse.json({ message: 'taskId is required' }, { status: 400 });
    }

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Check if user has a connected Github account
    const githubAccount = await prisma.githubAccount.findUnique({
      where: { userId: userId }
    });

    const isConnected = !!(githubAccount && githubAccount.isConnected && githubAccount.accessToken);

    // Create the submission record
    const submission = await prisma.taskSubmission.create({
      data: {
        userId: userId,
        taskId: taskId,
        repositoryUrl: repositoryUrl || '',
        branch: branch || 'main',
        commitHash: commitHash || '',
        notes: notes || null,
        status: isConnected ? 'PENDING' : 'FAILED',
      }
    });

    let finalSubmission = submission;
    if (isConnected) {
      // Mocking AI Evaluation synchronously for instant feedback in the UI
      try {
        finalSubmission = await prisma.taskSubmission.update({
          where: { id: submission.id },
          data: { status: 'VERIFIED' }, // 'VERIFIED' instead of 'APPROVED' based on schema
          include: { aiEvaluation: true, task: { include: { roadmapDay: { include: { roadmap: true } } } } }
        });
        
        const evaluation = await prisma.aIEvaluation.create({
          data: {
            submissionId: submission.id,
            score: 95,
            feedback: "Excellent architecture. API routes are structured perfectly according to REST standards.",
            strengths: ["Clean code", "Good error handling"],
            weaknesses: []
          }
        });
        finalSubmission.aiEvaluation = evaluation;
      } catch (e) {
        console.error("Failed to mock AI evaluation:", e);
      }
    }

    return NextResponse.json(finalSubmission);
  } catch (error: any) {
    console.error('Error submitting task:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
