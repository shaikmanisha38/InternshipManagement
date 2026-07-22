import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function authenticateMentor(req: Request) {
  const authHeader = req.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  }

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: { role: true }
    });

    if (!user || user.role.roleName !== 'MENTOR') {
      return null;
    }

    return user.id;
  } catch (error) {
    return null;
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const mentorId = await authenticateMentor(req);
    if (!mentorId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id: enrollmentId } = await params;

    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      return NextResponse.json({ message: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.mentorId !== mentorId) {
      return NextResponse.json({ message: 'You are not authorized to reject this enrollment' }, { status: 403 });
    }

    if (enrollment.status !== 'PENDING') {
      return NextResponse.json({ message: `Enrollment is already ${enrollment.status}` }, { status: 400 });
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status: 'REJECTED' }
    });

    return NextResponse.json({ message: 'Enrollment rejected successfully', enrollment: updatedEnrollment });
  } catch (error: any) {
    console.error('Error rejecting enrollment:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
