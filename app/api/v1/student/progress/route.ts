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
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const studentInternship = await prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: {
        internship: {
          include: {
            roadmaps: {
              include: {
                roadmapDays: {
                  include: {
                    tasks: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!studentInternship) {
      return NextResponse.json({ message: 'No active internship found' }, { status: 404 });
    }

    const currentWeek = studentInternship.currentWeek;
    const currentDay = studentInternship.currentDay;
    const now = new Date();

    const allTasks = studentInternship.internship.roadmaps.flatMap(r => 
      r.roadmapDays.flatMap(d => d.tasks.map(t => ({...t, week: r.weekNumber, day: d.dayNumber})))
    );

    const submissions = await prisma.taskSubmission.findMany({
      where: { userId },
      include: { aiEvaluation: true }
    });
    
    const subMap = new Map();
    submissions.forEach(s => subMap.set(s.taskId, s));

    let completedTasks = 0;
    let pendingTasks = 0;
    let lockedTasks = 0;
    let missedTasks = 0;

    allTasks.forEach(task => {
      const sub = subMap.get(task.id);
      if (sub && sub.status === 'VERIFIED') {
        completedTasks++;
      } else {
        if (task.week > currentWeek || (task.week === currentWeek && task.day > currentDay)) {
          lockedTasks++;
        } else if (task.deadline && new Date(task.deadline) < now) {
          missedTasks++;
        } else {
          pendingTasks++;
        }
      }
    });

    let totalAiScore = 0;
    let aiScoreCount = 0;
    submissions.forEach(s => {
      if (s.aiEvaluation && s.aiEvaluation.score != null) {
        totalAiScore += s.aiEvaluation.score;
        aiScoreCount++;
      }
    });
    const avgAiScore = aiScoreCount > 0 ? Math.round(totalAiScore / aiScoreCount) : 0;

    const velocityData = [];
    const commitData = [];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      
      const dailySubs = submissions.filter(s => {
        const subDate = new Date(s.submittedAt);
        return subDate.getDate() === d.getDate() && subDate.getMonth() === d.getMonth();
      }).length;

      velocityData.push({
        name: dayName,
        tasks: dailySubs,
        xp: dailySubs * 50
      });
    }

    const githubAccount = await prisma.githubAccount.findFirst({
      where: { userId }
    });

    if (githubAccount) {
      const subIds = submissions.map(s => s.id);
      const commits = await prisma.githubCommit.findMany({
        where: { submissionId: { in: subIds } }
      });
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = dayNames[d.getDay()][0];
        
        const dailyCommits = commits.filter(c => {
          const cDate = new Date(c.verifiedAt);
          return cDate.getDate() === d.getDate() && cDate.getMonth() === d.getMonth();
        }).length;

        commitData.push({
          day: dayName,
          commits: dailyCommits
        });
      }
    } else {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        commitData.push({ day: dayNames[d.getDay()][0], commits: 0 });
      }
    }

    const assessments = await prisma.assessmentSubmission.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { assessment: { week: 'asc' } }
    });
    
    const scoresData = [];
    if (assessments.length > 0) {
      assessments.forEach(a => {
        scoresData.push({
          week: "W" + a.assessment.week,
          aiScore: avgAiScore, 
          weekScore: a.scoreObtained
        });
      });
    } else {
      scoresData.push({ week: 'W1', aiScore: avgAiScore, weekScore: 0 });
    }

    const attendances = await prisma.attendance.findMany({
      where: { studentId: userId },
      orderBy: { date: 'desc' },
      take: 35
    });
    
    const attendanceGrid = [];
    for (let i = 34; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      
      const att = attendances.find(a => {
        const aDate = new Date(a.date);
        return aDate.getDate() === targetDate.getDate() && aDate.getMonth() === targetDate.getMonth();
      });

      let intensity = 0;
      if (att && att.hoursSpent) {
        if (att.hoursSpent > 4) intensity = 4;
        else if (att.hoursSpent > 2) intensity = 3;
        else if (att.hoursSpent > 1) intensity = 2;
        else intensity = 1;
      }
      attendanceGrid.push(intensity);
    }

    const statusData = [
      { name: 'Completed', value: completedTasks, color: '#10b981' },
      { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
      { name: 'Locked', value: lockedTasks, color: '#64748b' },
      { name: 'Missed', value: missedTasks, color: '#ef4444' },
    ];

    return NextResponse.json({
      taskStats: {
        completed: completedTasks,
        total: allTasks.length,
        pending: pendingTasks,
        locked: lockedTasks,
        missed: missedTasks
      },
      avgAiScore,
      progressData: velocityData,
      statusData,
      commitData,
      scoresData,
      attendanceGrid
    });

  } catch (error: any) {
    console.error('Error fetching progress analytics:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
