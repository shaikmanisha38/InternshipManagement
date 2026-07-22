import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Helper to authenticate user
async function authenticateUser(req: Request) {
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
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await authenticateUser(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: userId
      },
      include: {
        internship: true,
        mentor: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error('Error fetching student enrollments:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await authenticateUser(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { internshipId } = body;

    if (!internshipId) {
      return NextResponse.json({ message: 'Missing internshipId' }, { status: 400 });
    }

    // Find internship to get mentorId
    const internship = await prisma.internship.findUnique({
      where: { id: internshipId }
    });

    if (!internship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }

    if (!internship.mentorId) {
      return NextResponse.json({ message: 'This internship has no assigned mentor' }, { status: 400 });
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        studentId: userId,
        internshipId: internshipId,
        status: {
          in: ['PENDING', 'APPROVED']
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        message: 'You have already enrolled in this internship.',
        status: existingEnrollment.status 
      }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: userId,
        mentorId: internship.mentorId,
        internshipId: internshipId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ message: 'Enrollment successful, pending approval.', enrollment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
