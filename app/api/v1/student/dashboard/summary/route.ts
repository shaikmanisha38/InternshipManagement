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

    // 2. Fetch User
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        leaderboard: true,
        studentBadges: { include: { badge: true } }
      }
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 3. Fetch Active Internship & Current Task
    const studentInternship = await prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: {
        internship: {
          include: { roadmaps: { include: { roadmapDays: { include: { tasks: true } } } } }
        }
      }
    });

    const submissions = await prisma.taskSubmission.findMany({
      where: { userId: userId, status: 'VERIFIED' },
      select: { submittedAt: true },
      orderBy: { submittedAt: 'desc' }
    });

    let currentStreak = 0;
    if (submissions.length > 0) {
      const dates = [...new Set(submissions.map(s => s.submittedAt.toISOString().split('T')[0]))];
      let checkDate = new Date();
      const todayStr = checkDate.toISOString().split('T')[0];
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toISOString().split('T')[0];
      
      let dateIndex = 0;
      if (dates[0] === todayStr) {
        currentStreak++;
        dateIndex = 1;
      } else if (dates[0] === yesterdayStr) {
        currentStreak++;
        dateIndex = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      while (dateIndex < dates.length) {
        if (dates[dateIndex] === checkDate.toISOString().split('T')[0]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
          dateIndex++;
        } else {
          break;
        }
      }
    }

    // 4. Formulate the response
    const dashboardData: any = {
      user: {
        name: user.name,
        profileImage: user.profileImage,
        rank: user.leaderboard?.rank || 'Unranked',
        streak: currentStreak,
        badges: user.studentBadges.map(sb => ({ id: sb.badge.id, name: sb.badge.badgeName, icon: '🏆' }))
      },
      internship: null,
      weeklyAssessment: null,
      todaysTask: null,
      githubStatus: { isConnected: false },
      aiFeedback: { averageScore: 0, lastFeedback: null },
      recentActivities: []
    };

    if (studentInternship) {
      dashboardData.internship = {
        title: studentInternship.internship.title,
        currentWeek: studentInternship.currentWeek,
        progress: {
          percent: studentInternship.progress,
          completed: Math.floor((studentInternship.progress / 100) * 10), // Mocked total tasks
          total: 10
        },
        status: studentInternship.status
      };

      // Mock today's task from schema (if there is a roadmap)
      const currentRoadmap = studentInternship.internship.roadmaps.find(r => r.weekNumber === studentInternship.currentWeek);
      const currentDay = currentRoadmap?.roadmapDays.find(d => d.dayNumber === studentInternship.currentDay);
      if (currentDay && currentDay.tasks.length > 0) {
        const task = currentDay.tasks[0];
        dashboardData.todaysTask = {
          title: task.title,
          difficulty: task.difficulty,
          estimatedTime: task.estimatedTime,
          status: 'PENDING'
        };
      }
    }

    // 5. Fetch GitHub Account
    const githubAccount = await prisma.githubAccount.findFirst({ where: { userId: userId } });
    if (githubAccount) {
      dashboardData.githubStatus = {
        isConnected: true,
        lastCommitTime: new Date().toISOString(),
        lastSubmissionStatus: 'APPROVED'
      };
    }

    // 6. Fetch Recent Activities
    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    if (activities.length > 0) {
      dashboardData.recentActivities = activities;
    } else {
      dashboardData.recentActivities = [
        { activity: 'Logged in to dashboard', createdAt: new Date().toISOString(), type: 'system' }
      ];
    }

    return NextResponse.json(dashboardData);
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
