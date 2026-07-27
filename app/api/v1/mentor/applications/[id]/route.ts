import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;
    const userRoleName = payload.role as string;
    if (userRoleName !== 'MENTOR' && userRoleName !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Mentor access required' }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const paramsObj = await params;
    const applicationId = paramsObj.id;

    const application = await prisma.internshipApplication.findUnique({
      where: { id: applicationId }
    });

    if (!application) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    const updatedApplication = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewedAt: new Date()
      }
    });

    // If accepted, enroll the student!
    if (status === 'ACCEPTED') {
      await prisma.studentInternship.create({
        data: {
          studentId: application.studentId,
          internshipId: application.internshipId,
          startDate: new Date(),
          status: 'ONGOING'
        }
      });
    }

    return NextResponse.json({ message: `Application ${status.toLowerCase()} successfully`, application: updatedApplication });
  } catch (error: any) {
    console.error('Error updating application:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
