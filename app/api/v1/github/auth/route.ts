import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
    }

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = (decoded.payload as any).id as string;

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ message: 'Missing code' }, { status: 400 });
    }

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return NextResponse.json({ message: 'GitHub Client ID/Secret not configured' }, { status: 500 });
    }

    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ message: tokenData.error_description || 'Error authenticating with GitHub' }, { status: 400 });
    }

    const accessToken = tokenData.access_token;

    // 2. Fetch user profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.id) {
      return NextResponse.json({ message: 'Failed to fetch GitHub user data' }, { status: 400 });
    }

    // 3. Save to database
    // Upsert the GitHub account for this student
    const existingAccount = await prisma.githubAccount.findFirst({
      where: { userId: userId },
    });

    if (existingAccount) {
      await prisma.githubAccount.update({
        where: { id: existingAccount.id },
        data: {
          githubUserId: String(userData.id),
          username: userData.login,
          accessToken,
        },
      });
    } else {
      await prisma.githubAccount.create({
        data: {
          userId: userId,
          githubUserId: String(userData.id),
          username: userData.login,
          accessToken,
        },
      });
    }

    return NextResponse.json({ success: true, username: userData.login });
  } catch (error) {
    console.error('Error in github auth route:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
