import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
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

    // 1. Check StudentInternship
    const studentInternship = await prisma.studentInternship.findFirst({
      where: {
        studentId: userId,
        status: 'ONGOING'
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ assigned: false });
    }

    // 2. Fetch Github Account
    const githubAccount = await prisma.githubAccount.findUnique({
      where: { userId }
    });

    // 3. Try to find the task for the current week/day
    // To do this properly: Find Roadmap matching internshipId and weekNumber -> RoadmapDay matching dayNumber -> Task
    const roadmap = await prisma.roadmap.findFirst({
      where: { 
        internshipId: studentInternship.internshipId,
        weekNumber: studentInternship.currentWeek
      }
    });

    let currentTaskId = null;
    if (roadmap) {
      const roadmapDay = await prisma.roadmapDay.findFirst({
        where: {
          roadmapId: roadmap.id,
          dayNumber: studentInternship.currentDay
        },
        include: {
          tasks: {
            orderBy: { unlockOrder: 'asc' },
            take: 1
          }
        }
      });
      if (roadmapDay && roadmapDay.tasks.length > 0) {
        currentTaskId = roadmapDay.tasks[0].id;
      }
    }

    // 4. Fetch Submission History
    const history = await prisma.taskSubmission.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      include: {
        aiEvaluation: true,
        task: {
          include: {
            roadmapDay: {
              include: { roadmap: true }
            }
          }
        }
      }
    });

    return NextResponse.json({
      assigned: true,
      workspace: {
        currentWeek: studentInternship.currentWeek,
        currentDay: studentInternship.currentDay,
        repoName: githubAccount?.repository || 'Not Connected',
        taskId: currentTaskId
      },
      history
    });

  } catch (error: any) {
    console.error('Error fetching workspace data:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
