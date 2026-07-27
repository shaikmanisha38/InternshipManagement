import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Only process push events for now
    if (!payload.commits || !payload.repository || !payload.sender) {
      return NextResponse.json({ message: 'Ignored: not a push event or missing data' });
    }

    const repositoryFullName = payload.repository.full_name;
    const githubUsername = payload.sender.login;
    const ref = payload.ref; // e.g. "refs/heads/main"
    const branch = ref ? ref.replace('refs/heads/', '') : null;

    // 1. Find the student who owns this repository and github username
    const githubAccount = await prisma.githubAccount.findFirst({
      where: {
        repository: repositoryFullName,
        username: githubUsername,
      },
    });

    if (!githubAccount) {
      return NextResponse.json({ message: 'Ignored: repository or user not linked to any student' });
    }

    // 2. Find the active PENDING task submission for this student
    const activeSubmission = await prisma.taskSubmission.findFirst({
      where: {
        userId: githubAccount.userId,
        status: 'PENDING',
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    if (!activeSubmission) {
      return NextResponse.json({ message: 'Ignored: no active pending task submission found for student' });
    }

    // 3. Save the commits
    const commitPromises = payload.commits.map((commit: any) => {
      return prisma.githubCommit.create({
        data: {
          submissionId: activeSubmission.id,
          commitHash: commit.id,
          message: commit.message,
          branch: branch,
          verifiedAt: new Date(commit.timestamp),
        },
      });
    });

    await Promise.all(commitPromises);

    return NextResponse.json({ success: true, inserted: payload.commits.length });
  } catch (error) {
    console.error('Error handling github webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
