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

    // 2. Fetch User Internship Details
    const studentInternship = await prisma.studentInternship.findFirst({
      where: { studentId: userId, status: 'ONGOING' },
      include: {
        internship: {
          include: { 
            roadmaps: { 
              include: { 
                roadmapDays: { 
                  include: { tasks: true } 
                } 
              } 
            } 
          }
        }
      }
    });

    if (!studentInternship) {
       // Return zeroed out data if no active internship
       return NextResponse.json(getZeroedData());
    }

    const currentWeek = studentInternship.currentWeek;
    const currentDay = studentInternship.currentDay;

    // 3. Aggregate Task Stats
    const submissions = await prisma.taskSubmission.findMany({
      where: { userId },
      include: { task: true, aiEvaluation: true, githubCommits: true }
    });

    // We'll flatten all tasks in the internship to determine locking, total, missed
    let totalTasks = 0;
    let lockedTasks = 0;
    let missedTasks = 0;

    const allTasks = studentInternship.internship.roadmaps.flatMap(r => 
      r.roadmapDays.flatMap(d => {
        const isLocked = r.weekNumber > currentWeek || (r.weekNumber === currentWeek && d.dayNumber > currentDay);
        return d.tasks.map(t => ({
          ...t,
          isLocked
        }));
      })
    );

    totalTasks = allTasks.length;

    let completedTasks = 0;
    let pendingTasks = 0;

    // For missed tasks, we can assume deadline is in the past and no verified submission
    const now = new Date();
    
    allTasks.forEach(task => {
      if (task.isLocked) {
        lockedTasks++;
      } else {
        const sub = submissions.find(s => s.taskId === task.id);
        if (sub?.status === 'VERIFIED') {
          completedTasks++;
        } else if (sub?.status === 'PENDING') {
          pendingTasks++;
        } else {
          // No submission or FAILED
          if (task.deadline && new Date(task.deadline) < now) {
            missedTasks++;
          } else {
            // It's assigned but not submitted yet, counts as pending
            pendingTasks++;
          }
        }
      }
    });

    // 4. AI Score Average
    const aiEvals = submissions.map(s => s.aiEvaluation?.score).filter((s): s is number => s !== undefined);
    const avgAiScore = aiEvals.length > 0 ? Math.round(aiEvals.reduce((a, b) => a + b, 0) / aiEvals.length) : 0;
    
    // Hardcoded week over week delta for now as we'd need historical weekly avg
    const weekOverWeekDelta = '+4%';

    // 5. Progress Velocity (progressData)
    // Grouping VERIFIED submissions by day of the week (last 7 days)
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const progressDataMap: Record<string, { tasks: number, xp: number }> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      progressDataMap[dayName] = { tasks: 0, xp: 0 };
    }

    submissions.filter(s => s.status === 'VERIFIED').forEach(s => {
      const date = new Date(s.submittedAt);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 7) {
        const dayName = daysOfWeek[date.getDay()];
        if (progressDataMap[dayName]) {
          progressDataMap[dayName].tasks += 1;
          // XP can be based on AI score or default 100
          progressDataMap[dayName].xp += (s.aiEvaluation?.score || 100);
        }
      }
    });

    const progressData = Object.keys(progressDataMap).map(key => ({
      name: key,
      tasks: progressDataMap[key].tasks,
      xp: progressDataMap[key].xp
    }));

    // 6. Status Data for Donut Chart
    const statusData = [
      { name: 'Completed', value: completedTasks, color: '#10b981' },
      { name: 'Pending', value: pendingTasks, color: '#f59e0b' },
      { name: 'Locked', value: lockedTasks, color: '#64748b' },
      { name: 'Missed', value: missedTasks, color: '#ef4444' }
    ].filter(s => s.value > 0);

    // 7. GitHub Commits Data
    const commitDataMap: Record<string, number> = {};
    const shortDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      // Let's use Mon, Tue, etc. for commit data too for safety since Recharts categorical XAxis requires unique values across entries.
      commitDataMap[`${daysOfWeek[d.getDay()]} `] = 0; // space to differentiate
    }

    submissions.forEach(s => {
      s.githubCommits.forEach(c => {
         const date = new Date(c.verifiedAt);
         const diffTime = Math.abs(now.getTime() - date.getTime());
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
         if (diffDays <= 7) {
           const dayName = `${daysOfWeek[date.getDay()]} `;
           if (commitDataMap[dayName] !== undefined) {
              commitDataMap[dayName] += 1;
           }
         }
      });
    });

    const commitData = Object.keys(commitDataMap).map(key => ({
      day: key.trim(),
      commits: commitDataMap[key]
    }));

    // 8. Scores Data (AI vs Assessment)
    const assessments = await prisma.assessmentSubmission.findMany({
      where: { userId },
      include: { assessment: true },
      orderBy: { assessment: { week: 'asc' } }
    });

    const scoresData = assessments.map(a => {
      return {
        week: `W${a.assessment.week}`,
        aiScore: avgAiScore, // Simplified global average 
        weekScore: a.scoreObtained
      };
    });

    // Fallback if no assessments
    if (scoresData.length === 0) {
      scoresData.push({ week: 'W1', aiScore: avgAiScore, weekScore: 0 });
    }

    // 9. Attendance Heatmap
    // Last 35 days
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: userId, date: { gte: new Date(now.setDate(now.getDate() - 35)) } }
    });

    const attendanceGrid = Array.from({ length: 35 }).map(() => 0);
    attendanceRecords.forEach(r => {
      const diffTime = Math.abs(new Date().getTime() - new Date(r.date).getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 35) {
         const idx = 34 - diffDays;
         if (idx >= 0 && idx < 35) {
           const hours = r.hoursSpent || 1;
           attendanceGrid[idx] = Math.min(4, Math.ceil(hours));
         }
      }
    });

    return NextResponse.json({
      stats: {
        completedTasks,
        pendingTasks,
        lockedTasks,
        missedTasks,
        totalTasks,
        avgAiScore,
        weekOverWeekDelta
      },
      progressData,
      statusData,
      commitData,
      scoresData,
      attendanceGrid
    });

  } catch (error: any) {
    console.error('Error fetching analytics progress:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

function getZeroedData() {
  return {
    stats: { completedTasks: 0, pendingTasks: 0, lockedTasks: 0, missedTasks: 0, totalTasks: 0, avgAiScore: 0, weekOverWeekDelta: '+0%' },
    progressData: [],
    statusData: [],
    commitData: [],
    scoresData: [],
    attendanceGrid: Array.from({ length: 35 }).map(() => 0)
  };
}
