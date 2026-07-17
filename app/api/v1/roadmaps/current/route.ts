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
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
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
            roadmaps: {
              orderBy: { weekNumber: 'asc' },
              include: {
                roadmapDays: {
                  orderBy: { dayNumber: 'asc' },
                }
              }
            }
          }
        }
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'No active internship found.' }, { status: 404 });
    }

    const { internship } = studentInternship;

    // 3. Format response
    const roadmapData = {
      id: internship.id,
      title: internship.title,
      description: internship.description,
      totalDays: internship.roadmaps.reduce((acc, curr) => acc + curr.totalDays, 0),
      createdAt: internship.createdAt,
      updatedAt: internship.createdAt,
      weeks: internship.roadmaps,
    };

    return NextResponse.json(roadmapData);
  } catch (error: any) {
    console.error('Error fetching current roadmap:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
