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

    // Check if enrollment exists and belongs to this mentor
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId }
    });

    if (!enrollment) {
      return NextResponse.json({ message: 'Enrollment not found' }, { status: 404 });
    }

    if (enrollment.mentorId !== mentorId) {
      return NextResponse.json({ message: 'You are not authorized to approve this enrollment' }, { status: 403 });
    }

    if (enrollment.status !== 'PENDING') {
      return NextResponse.json({ message: `Enrollment is already ${enrollment.status}` }, { status: 400 });
    }

    // Begin Transaction to approve and create StudentInternship
    const updatedEnrollment = await prisma.$transaction(async (tx) => {
      // 1. Update enrollment status
      const updated = await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: 'APPROVED' }
      });

      // 2. Check if StudentInternship already exists to prevent duplicates
      const existingInternship = await tx.studentInternship.findFirst({
        where: {
          studentId: enrollment.studentId,
          internshipId: enrollment.internshipId,
        }
      });

      if (!existingInternship) {
        // 3. Create the StudentInternship record
        await tx.studentInternship.create({
          data: {
            studentId: enrollment.studentId,
            internshipId: enrollment.internshipId,
            startDate: new Date(),
            status: 'ONGOING',
            currentWeek: 1,
            currentDay: 1,
            progress: 0.0,
          }
        });
      }

      return updated;
    });

    return NextResponse.json({ message: 'Enrollment approved successfully', enrollment: updatedEnrollment });
  } catch (error: any) {
    console.error('Error approving enrollment:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
