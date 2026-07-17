import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
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

    await prisma.githubAccount.update({
      where: { userId },
      data: {
        accessToken: null,
        isConnected: false,
        repository: null,
        repositoryUrl: null,
        webhookId: null
      }
    });

    return NextResponse.json({ success: true, message: 'Account disconnected successfully.' });

  } catch (error: any) {
    console.error('Error disconnecting github account:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
