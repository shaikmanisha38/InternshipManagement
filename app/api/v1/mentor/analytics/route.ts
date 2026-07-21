import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function getMentorId(req: Request) {
  const authHeader = req.headers.get('authorization');
  let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const role = verified.payload.role as string;
    if (role !== 'MENTOR' && role !== 'ADMIN') return null;
    return verified.payload.userId as string;
  } catch { return null; }
}

export async function GET(req: Request) {
  try {
    const mentorId = await getMentorId(req);
    if (!mentorId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || 'Daily'; 

    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];

    const students = await prisma.user.findMany({
      where: { id: { in: studentIds } },
      include: {
        taskSubmissions: { include: { aiEvaluation: true } },
        attendance: true,
        activityLogs: true,
        certificates: { where: { mentorId } }
      }
    });

    const now = new Date();
    let completedCount = 0;
    let inactiveCount = 0;
    let totalScoreSum = 0;
    let totalScoreCount = 0;
    let totalCommits = 0;
    let totalPresent = 0;
    let totalAttendanceExpected = 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    students.forEach(student => {
      const hasCertificate = student.certificates.length > 0;
      let scoreSum = 0;
      let evals = 0;
      student.taskSubmissions.forEach(sub => {
        if (sub.aiEvaluation) {
          scoreSum += sub.aiEvaluation.score;
          evals++;
        }
      });
      const avgScore = evals > 0 ? scoreSum / evals : 0;
      if (hasCertificate || avgScore >= 80) completedCount++;

      if (avgScore > 0) {
        totalScoreSum += avgScore;
        totalScoreCount++;
      }

      const recentActivity = student.activityLogs.some(log => new Date(log.createdAt) >= thirtyDaysAgo);
      const recentSubs = student.taskSubmissions.some(sub => new Date(sub.submittedAt) >= thirtyDaysAgo);
      if (!recentActivity && !recentSubs) inactiveCount++;

      const commits = student.activityLogs.filter(log => log.activity === 'GIT_COMMIT').length;
      totalCommits += commits;

      totalAttendanceExpected += Math.max(1, student.attendance.length);
      totalPresent += student.attendance.filter(a => a.status === 'Present').length;
    });

    const totalStudents = students.length || 1;
    const activeStudents = students.length - inactiveCount;
    const dropoutRate = (inactiveCount / totalStudents) * 100;
    const avgCohortScore = totalScoreCount > 0 ? Math.round(totalScoreSum / totalScoreCount) : 0;
    const avgCohortAttendance = Math.round((totalPresent / (totalAttendanceExpected || 1)) * 100);
    
    let chartKeys = [];
    let intervalDays = 1;
    let lookback = 7;
    
    if (timeframe === 'Weekly') {
      intervalDays = 7;
      lookback = 4;
      chartKeys = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else if (timeframe === 'Monthly') {
      intervalDays = 30;
      lookback = 6;
      chartKeys = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    } else {
      intervalDays = 1;
      lookback = 7;
      chartKeys = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }

    const platformActivity = chartKeys.map(key => ({ name: key, logins: 0, submissions: 0 }));
    const behavioralTrends = chartKeys.map(key => ({ name: key, completion: 0, score: 0, commits: 0 }));
    
    const getBinIndex = (date: Date) => {
      const diffTime = now.getTime() - new Date(date).getTime();
      if (diffTime < 0) return -1;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const bin = Math.floor(diffDays / intervalDays);
      return (lookback - 1) - bin;
    };

    students.forEach(student => {
      student.activityLogs.forEach(log => {
        const bin = getBinIndex(log.createdAt);
        if (bin >= 0 && bin < lookback) {
          if (log.activity === 'LOGIN') platformActivity[bin].logins++;
          if (log.activity === 'GIT_COMMIT') behavioralTrends[bin].commits++;
        }
      });
      student.taskSubmissions.forEach(sub => {
        const bin = getBinIndex(sub.submittedAt);
        if (bin >= 0 && bin < lookback) {
          platformActivity[bin].submissions++;
          if (sub.status === 'VERIFIED') behavioralTrends[bin].completion = Math.min(100, behavioralTrends[bin].completion + 10);
          if (sub.aiEvaluation) {
            behavioralTrends[bin].score = behavioralTrends[bin].score === 0 
              ? sub.aiEvaluation.score 
              : Math.round((behavioralTrends[bin].score + sub.aiEvaluation.score) / 2);
          }
        }
      });
    });

    return NextResponse.json({
      metrics: {
        activeCount: activeStudents,
        activeDelta: 12, 
        completedCount: completedCount,
        completedDelta: 5,
        dropoutRate: dropoutRate.toFixed(1),
        avgScore: avgCohortScore,
        avgCommits: Math.round(totalCommits / totalStudents),
        attendance: avgCohortAttendance
      },
      platformActivity,
      behavioralTrends
    });

  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
