import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const body = await req.json();
    const { taskId, repositoryUrl, branch, notes } = body;

    if (!taskId || !repositoryUrl) {
      return NextResponse.json({ message: 'Task ID and Repository URL are required' }, { status: 400 });
    }

    // Check if the student has already verified a different task today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const verifiedSubmissionsToday = await prisma.taskSubmission.findMany({
      where: {
        userId,
        status: 'VERIFIED',
        submittedAt: {
          gte: startOfToday
        }
      }
    });

    if (verifiedSubmissionsToday.length > 0) {
      const alreadyVerifiedThisTaskToday = verifiedSubmissionsToday.some(sub => sub.taskId === taskId);
      if (!alreadyVerifiedThisTaskToday) {
        return NextResponse.json({ message: 'You have already completed a task today! Please come back tomorrow to submit the next day\'s task.' }, { status: 400 });
      }
    }

    let status: import('@prisma/client').SubmissionStatus = 'FAILED';
    let commitHash = `manual-${Date.now()}`;


    // Extract owner and repo from Github URL
    // Expected format: https://github.com/username/repo
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
    if (match) {
      const owner = match[1];
      const repo = match[2].replace('.git', '');
      
      try {
        // We look for commits within the last 24 hours just as a simple check
        const sinceDate = new Date();
        sinceDate.setHours(0, 0, 0, 0); // Start of today

        // Use the github public API to fetch commits for this branch
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch || 'main'}&since=${sinceDate.toISOString()}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Internship-Management-Platform'
          }
        });

        if (githubRes.ok) {
          const commits = await githubRes.json();
          if (Array.isArray(commits) && commits.length > 0) {
            status = 'VERIFIED';
            commitHash = commits[0].sha;
          } else {
            status = 'FAILED';
          }
        } else {
          console.warn(`GitHub API returned ${githubRes.status} for ${owner}/${repo}. Status: FAILED.`);
          status = 'FAILED';
        }
      } catch (err) {
        console.error('Error calling Github API:', err);
        status = 'FAILED';
      }
    } else {
      // If it's not a valid GitHub URL, we fail it automatically
      status = 'FAILED';
    }


    const newSubmission = await prisma.taskSubmission.create({
      data: {
        taskId,
        userId,
        repositoryUrl,
        branch: branch || 'main',
        commitHash,
        notes,
        status // 'VERIFIED' or 'FAILED'
      },
      include: {
        task: {
          include: {
            roadmapDay: true
          }
        }
      }
    });

    // Day advancement logic is now handled by a lazy sync in the dashboard APIs 
    // to ensure the next day only unlocks on the NEXT calendar day.

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error: any) {
    console.error('Error creating verification submission:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
