import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
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
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    const userId = payload.userId as string;
    const { taskId } = await params;

    const submission = await prisma.taskSubmission.findFirst({
      where: { userId: userId, taskId: taskId },
      orderBy: { submittedAt: 'desc' },
      include: { aiEvaluation: true }
    });

    // We can return null or 404 if not found, frontend checks `if (subRes.ok)`.
    if (!submission) {
      return NextResponse.json({ message: 'No submission found for this task' }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error: any) {
    console.error('Error fetching latest submission:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
