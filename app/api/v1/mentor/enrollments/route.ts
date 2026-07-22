import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Helper to authenticate mentor
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
    
    // Check if user is a mentor
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

export async function GET(req: Request) {
  try {
    const mentorId = await authenticateMentor(req);
    if (!mentorId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch pending enrollments assigned to this mentor
    const enrollments = await prisma.enrollment.findMany({
      where: {
        mentorId: mentorId,
        status: 'PENDING'
      },
      include: {
        student: {
          select: { name: true, email: true, profileImage: true }
        },
        internship: {
          select: { title: true, duration: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ enrollments });
  } catch (error: any) {
    console.error('Error fetching mentor enrollments:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
