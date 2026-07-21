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

    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const decoded = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = (decoded.payload as any).id as string;

    const githubAccount = await prisma.githubAccount.findFirst({
      where: { studentId: userId },
    });

    if (!githubAccount) {
      return NextResponse.json({ isConnected: false, clientId: process.env.GITHUB_CLIENT_ID });
    }

    // If connected, let's also fetch webhooks or latest commit if possible, but for now just basic details
    return NextResponse.json({
      isConnected: true,
      username: githubAccount.username,
      repository: githubAccount.repository,
      clientId: process.env.GITHUB_CLIENT_ID
      // We don't send accessToken to frontend
    });
  } catch (error) {
    console.error('Error fetching github status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
