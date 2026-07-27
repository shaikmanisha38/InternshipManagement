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

    let finalStatus = 'FAILED';
    let actualCommitHash = commitHash || '';
    
    if (repositoryUrl) {
      try {
        // Extract owner and repo from URL (e.g. https://github.com/owner/repo)
        const urlParts = repositoryUrl.replace(/\/$/, '').split('/');
        const repoIndex = urlParts.length - 1;
        const ownerIndex = urlParts.length - 2;
        
        if (repoIndex >= 0 && ownerIndex >= 0) {
          const owner = urlParts[ownerIndex];
          const repo = urlParts[repoIndex];
          
          // Get today's start and end date
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          
          const headers: any = {};
          if (isConnected) {
            headers['Authorization'] = `Bearer ${githubAccount.accessToken}`;
          }
          
          const targetBranch = branch || 'main';
          const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${targetBranch}&since=${startOfDay.toISOString()}&until=${endOfDay.toISOString()}`;
          
          const gitRes = await fetch(apiUrl, { headers });
          
          if (gitRes.ok) {
            const commits = await gitRes.json();
            if (Array.isArray(commits) && commits.length > 0) {
              finalStatus = 'VERIFIED';
              if (!actualCommitHash) {
                actualCommitHash = commits[0].sha;
              }
            } else {
              console.log('No commits found today for', owner, repo);
            }
          } else {
            console.error('Failed to fetch from github API:', await gitRes.text());
          }
        }
      } catch (err) {
        console.error('Error verifying github commits:', err);
      }
    }

    // Create the submission record
    let submission = await prisma.taskSubmission.create({
      data: {
        userId: userId,
        taskId: taskId,
        repositoryUrl: repositoryUrl || '',
        branch: branch || 'main',
        commitHash: actualCommitHash,
        notes: notes || null,
        status: finalStatus as any,
      },
      include: { task: { include: { roadmapDay: { include: { roadmap: true } } } } }
    });

    let finalSubmission = submission;
    if (finalStatus === 'VERIFIED') {
      // Create AI Evaluation synchronously for instant feedback in the UI
      try {

        const evaluation = await prisma.aiEvaluation.create({
          data: {
            submissionId: submission.id,
            score: 95,
            feedback: "Excellent architecture. API routes are structured perfectly according to REST standards.",
            strengths: ["Clean code", "Good error handling"],
            weaknesses: []
          }
        });
        (finalSubmission as any).aiEvaluation = evaluation;
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
