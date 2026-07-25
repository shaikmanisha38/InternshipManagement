import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

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
              select: {
                id: true,
                weekNumber: true,
                title: true,
                description: true,
                totalDays: true
              }
            }
          }
        }
      }
    });

    if (!studentInternship || !studentInternship.internship) {
      return NextResponse.json({ message: 'No active internship found' }, { status: 404 });
    }

    return NextResponse.json({
      id: studentInternship.internshipId,
      weeks: studentInternship.internship.roadmaps
    });
  } catch (error: any) {
    console.error('Error fetching current roadmap:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
