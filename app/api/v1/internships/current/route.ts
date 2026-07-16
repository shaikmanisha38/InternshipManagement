import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
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
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // 2. Fetch the active StudentInternship for this user
    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        status: 'ONGOING'
      },
      include: {
        internship: {
          include: {
            mentor: {
              select: {
                name: true,
                email: true,
                profileImage: true,
              }
            }
          }
        }
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'No active internship found.' }, { status: 404 });
    }

    // 3. Format response for MyInternship.jsx
    // Note: The frontend expects the response to have { internship: { ...details, mentor: { ... } } }
    const formattedInternship = {
      ...studentInternship.internship,
      mentor: studentInternship.internship.mentor,
      studentProgress: {
        currentWeek: studentInternship.currentWeek,
        currentDay: studentInternship.currentDay,
        progress: studentInternship.progress,
        startDate: studentInternship.startDate,
      }
    };

    return NextResponse.json({ internship: formattedInternship });
  } catch (error: any) {
    console.error('Error fetching current internship:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
