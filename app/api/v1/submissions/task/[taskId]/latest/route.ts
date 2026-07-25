import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request, { params }: { params: { taskId: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const paramsObj = await params;
    const taskId = paramsObj.taskId;

    const submission = await prisma.taskSubmission.findFirst({
      where: {
        userId: userId,
        taskId: taskId
      },
      orderBy: {
        submittedAt: 'desc'
      },
      include: {
        aiEvaluation: true
      }
    });

    if (!submission) {
      return NextResponse.json(null, { status: 200 }); // Return null if no submission
    }

    return NextResponse.json(submission);
  } catch (error: any) {
    console.error('Error fetching latest submission:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
