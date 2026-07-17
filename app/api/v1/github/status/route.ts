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

    const githubAccount = await prisma.githubAccount.findUnique({
      where: { userId }
    });

    if (!githubAccount || !githubAccount.isConnected || !githubAccount.accessToken) {
      return NextResponse.json({ isConnected: false });
    }

    const headers = {
      Authorization: `Bearer ${githubAccount.accessToken}`,
      Accept: 'application/vnd.github.v3+json'
    };

    // Get user repos for default repository logic
    const repoRes = await fetch(`https://api.github.com/user/repos?sort=updated&per_page=1`, { headers });
    const repos = await repoRes.json();
    const repo = Array.isArray(repos) && repos.length > 0 ? repos[0] : null;

    if (!repo) {
      return NextResponse.json({
        isConnected: true,
        username: githubAccount.username,
        repository: null,
        webhookActive: !!githubAccount.webhookId
      });
    }

    // Auto-update default repo in db if none set
    if (!githubAccount.repository) {
      await prisma.githubAccount.update({
        where: { id: githubAccount.id },
        data: { repository: repo.name, repositoryUrl: repo.html_url }
      });
    }

    const repoName = githubAccount.repository || repo.name;
    const owner = githubAccount.username;

    // Fetch commits
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=1`, { headers });
    const commits = await commitsRes.json();
    
    // Fetch commit count from headers (pagination)
    let totalCommits = 0;
    const linkHeader = commitsRes.headers.get('link');
    if (linkHeader) {
      const match = linkHeader.match(/page=(\d+)>; rel="last"/);
      if (match) {
        totalCommits = parseInt(match[1]);
      }
    } else if (Array.isArray(commits)) {
      totalCommits = commits.length;
    }

    // Fetch contributors
    const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors`, { headers });
    const contributors = await contribRes.json();
    const contributorsCount = Array.isArray(contributors) ? contributors.length : 1;

    return NextResponse.json({
      isConnected: true,
      username: githubAccount.username,
      avatar: `https://github.com/${githubAccount.username}.png`,
      repository: repoName,
      repositoryUrl: githubAccount.repositoryUrl || repo.html_url,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      lastCommitAt: Array.isArray(commits) && commits.length > 0 ? commits[0].commit.author.date : null,
      totalCommits,
      contributorsCount,
      webhookActive: !!githubAccount.webhookId
    });

  } catch (error: any) {
    console.error('Error fetching github status:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
