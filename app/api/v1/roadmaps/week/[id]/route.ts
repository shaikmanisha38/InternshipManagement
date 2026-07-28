import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { syncStudentProgress } from '@/lib/syncProgress';

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

    await syncStudentProgress(userId);

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

    // Fetch all verified submissions for this user to accurately determine completion
    const verifiedSubmissions = await prisma.taskSubmission.findMany({
      where: { userId: userId, status: 'VERIFIED' },
      select: { taskId: true }
    });
    const verifiedTaskIds = new Set(verifiedSubmissions.map(s => s.taskId));

    const daysWithStatus = roadmap.roadmapDays.map(day => {
      let status = 'locked';
      
      // Determine if ALL tasks for this day are verified
      const hasTasks = day.tasks && day.tasks.length > 0;
      const allTasksCompleted = hasTasks && day.tasks.every((t: any) => verifiedTaskIds.has(t.id));

      if (allTasksCompleted) {
        status = 'completed';
      } else if (weekNumber < currentWeek) {
        status = 'completed'; // Fallback if no tasks existed but week passed
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

    // Manually inject Day 7 for Assessment
    let day7Status = 'locked';
    if (weekNumber < currentWeek) {
      day7Status = 'completed';
    } else if (weekNumber === currentWeek) {
      if (currentDay > 7) day7Status = 'completed';
      else if (currentDay === 7) day7Status = 'unlocked';
    }

    daysWithStatus.push({
      id: `assessment-w${weekNumber}`,
      dayNumber: 7,
      title: 'Weekly Assessment',
      topicsCovered: ['Comprehensive Review'],
      tasks: [],
      status: day7Status
    } as any);

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
