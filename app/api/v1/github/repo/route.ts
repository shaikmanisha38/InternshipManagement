import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Helper to authenticate
async function getUserId(req: Request) {
  const authHeader = req.headers.get('authorization');
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  }
  if (!token) return null;
  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return (decoded.payload as any).id as string;
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const githubAccount = await prisma.githubAccount.findFirst({
      where: { userId },
    });

    if (!githubAccount || !githubAccount.accessToken) {
      return NextResponse.json({ message: 'GitHub account not connected' }, { status: 400 });
    }

    const reposResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', {
      headers: {
        Authorization: `Bearer ${githubAccount.accessToken}`,
      },
    });

    const repos = await reposResponse.json();

    if (!Array.isArray(repos)) {
      return NextResponse.json({ message: 'Failed to fetch repositories' }, { status: 400 });
    }

    const mappedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      private: repo.private,
    }));

    return NextResponse.json({ repositories: mappedRepos });
  } catch (error) {
    console.error('Error fetching repos:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { repositoryFullName } = await req.json();

    if (!repositoryFullName) {
      return NextResponse.json({ message: 'Repository full name is required' }, { status: 400 });
    }

    const githubAccount = await prisma.githubAccount.findFirst({
      where: { userId },
    });

    if (!githubAccount || !githubAccount.accessToken) {
      return NextResponse.json({ message: 'GitHub account not connected' }, { status: 400 });
    }

    // Save selected repository
    await prisma.githubAccount.update({
      where: { id: githubAccount.id },
      data: { repository: repositoryFullName },
    });

    return NextResponse.json({ success: true, repository: repositoryFullName });
  } catch (error) {
    console.error('Error saving repo:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
