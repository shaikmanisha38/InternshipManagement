import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.redirect(new URL('/dashboard/github?error=no_code', req.url));
    }

    const token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard/github?error=unauthorized', req.url));
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    let userId;
    try {
      const verified = await jwtVerify(token, secret);
      userId = verified.payload.userId as string;
    } catch (e) {
      return NextResponse.redirect(new URL('/dashboard/github?error=unauthorized', req.url));
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId === 'dummy_client_id') {
      return NextResponse.redirect(new URL('/dashboard/github?error=not_configured', req.url));
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code
      })
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return NextResponse.redirect(new URL('/dashboard/github?error=oauth_failed', req.url));
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    });
    
    const githubUser = await userResponse.json();

    await prisma.githubAccount.upsert({
      where: { userId },
      update: {
        githubUserId: String(githubUser.id),
        username: githubUser.login,
        accessToken: accessToken,
        isConnected: true
      },
      create: {
        userId,
        githubUserId: String(githubUser.id),
        username: githubUser.login,
        accessToken: accessToken,
        isConnected: true
      }
    });

    return NextResponse.redirect(new URL('/dashboard/github?success=1', req.url));

  } catch (error) {
    console.error('GitHub Callback Error:', error);
    return NextResponse.redirect(new URL('/dashboard/github?error=server_error', req.url));
  }
}
