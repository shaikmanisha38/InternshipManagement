import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const url = new URL(req.url);
    const weekNumberStr = url.searchParams.get('weekNumber');
    if (!weekNumberStr) {
      return NextResponse.json({ message: 'weekNumber is required' }, { status: 400 });
    }
    const weekNumber = parseInt(weekNumberStr, 10);
    const paramsObj = await params;
    const internshipId = paramsObj.id;

    // Fetch the active internship to get current progress
    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        internshipId: internshipId,
        status: 'ONGOING'
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'Active internship not found' }, { status: 404 });
    }

    // Fetch the roadmap week details
    const roadmap = await prisma.roadmap.findFirst({
      where: {
        internshipId: internshipId,
        weekNumber: weekNumber
      },
      include: {
        roadmapDays: {
          orderBy: { dayNumber: 'asc' },
          include: {
            tasks: {
              orderBy: { unlockOrder: 'asc' }
            }
          }
        }
      }
    });

    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap week not found' }, { status: 404 });
    }

    // Map the days with dynamic status
    const currentWeek = studentInternship.currentWeek;
    const currentDay = studentInternship.currentDay;

    const daysWithStatus = roadmap.roadmapDays.map(day => {
      let status = 'locked';
      if (weekNumber < currentWeek) {
        status = 'completed';
      } else if (weekNumber === currentWeek) {
        if (day.dayNumber < currentDay) {
          status = 'completed';
        } else if (day.dayNumber === currentDay) {
          status = 'unlocked';
        }
      }

      return {
        ...day,
        status
      };
    });

    return NextResponse.json({
      week: {
        id: roadmap.id,
        weekNumber: roadmap.weekNumber,
        title: roadmap.title,
        description: roadmap.description
      },
      days: daysWithStatus
    });
  } catch (error: any) {
    console.error('Error fetching roadmap week:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
