import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { syncStudentProgress } from '@/lib/syncProgress';

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

    await syncStudentProgress(userId);

    const { searchParams } = new URL(req.url);
    const queryDay = searchParams.get('day');
    const queryWeek = searchParams.get('week');

    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        status: 'ONGOING'
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'Active internship not found' }, { status: 404 });
    }

    const targetWeek = queryWeek ? parseInt(queryWeek) : studentInternship.currentWeek;
    const targetDay = queryDay ? parseInt(queryDay) : studentInternship.currentDay;

    const roadmap = await prisma.roadmap.findFirst({
      where: {
        internshipId: studentInternship.internshipId,
        weekNumber: targetWeek
      }
    });

    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap week not found' }, { status: 404 });
    }

    if (targetDay === 7) {
      return NextResponse.json([{ currentDay: 7, isAssessmentDay: true }], { status: 200 });
    }

    const roadmapDay = await prisma.roadmapDay.findFirst({
      where: {
        roadmapId: roadmap.id,
        dayNumber: targetDay
      },
      include: {
        tasks: {
          orderBy: { unlockOrder: 'asc' }
        }
      }
    });

    if (!roadmapDay || roadmapDay.tasks.length === 0) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no tasks
    }

    return NextResponse.json(roadmapDay.tasks);
  } catch (error: any) {
    console.error('Error fetching today task:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
