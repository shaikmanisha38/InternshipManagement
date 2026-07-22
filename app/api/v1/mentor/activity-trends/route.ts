import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    // 1. Authentication & Role Validation
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

    let payload;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err: any) {
      return NextResponse.json({ message: 'Session expired or invalid. Please login again.' }, { status: 401 });
    }

    const userId = payload.userId as string;
    const role = payload.role as string;

    if (role !== 'MENTOR' && role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Get assigned students
    const mentoredStudentInternships = await prisma.studentInternship.findMany({
      where: {
        internship: { mentorId: userId }
      },
      select: { studentId: true }
    });

    const studentIds = [...new Set(mentoredStudentInternships.map(s => s.studentId))];

    // 2. Weekly Performance (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date: { gte: sevenDaysAgo }
      },
      select: { date: true }
    });

    const tasksCompleted = await prisma.taskSubmission.findMany({
      where: {
        userId: { in: studentIds },
        status: 'VERIFIED',
        submittedAt: { gte: sevenDaysAgo }
      },
      select: { submittedAt: true }
    });

    // Generate last 7 days array
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyPerformance = [];
    
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dayStr = daysOfWeek[targetDate.getDay()];
      
      const targetStart = new Date(targetDate);
      targetStart.setHours(0, 0, 0, 0);
      const targetEnd = new Date(targetDate);
      targetEnd.setHours(23, 59, 59, 999);

      const logins = attendances.filter(a => {
        const d = new Date(a.date);
        return d >= targetStart && d <= targetEnd;
      }).length;

      const tasks = tasksCompleted.filter(t => {
        const d = new Date(t.submittedAt);
        return d >= targetStart && d <= targetEnd;
      }).length;

      weeklyPerformance.push({
        day: dayStr,
        logins,
        tasks
      });
    }

    // 3. Recent Activity Logs (Dynamic Aggregation)
    const recentSubmissions = await prisma.taskSubmission.findMany({
      where: { userId: { in: studentIds } },
      orderBy: { submittedAt: 'desc' },
      take: 10,
      include: { user: { select: { name: true } }, task: { select: { title: true } } }
    });

    const recentAiEvals = await prisma.aiEvaluation.findMany({
      where: { submission: { userId: { in: studentIds } } },
      orderBy: { evaluatedAt: 'desc' },
      take: 10,
      include: { submission: { include: { user: { select: { name: true } } } } }
    });

    const recentCertificates = await prisma.certificate.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { issuedAt: 'desc' },
      take: 10,
      include: { student: { select: { name: true } } }
    });

    const allEvents: any[] = [];

    recentSubmissions.forEach(sub => {
      allEvents.push({
        id: `sub-${sub.id}`,
        type: 'TASK_SUBMISSION',
        title: `Student submitted ${sub.task.title}`,
        subtitle: `By ${sub.user.name}`,
        timestamp: sub.submittedAt
      });
    });

    recentAiEvals.forEach(evalRecord => {
      allEvents.push({
        id: `eval-${evalRecord.id}`,
        type: 'AI_EVALUATION',
        title: 'AI evaluated Submission',
        subtitle: `Score: ${evalRecord.score}/100 • For: ${evalRecord.submission.user.name}`,
        timestamp: evalRecord.evaluatedAt
      });
    });

    recentCertificates.forEach(cert => {
      allEvents.push({
        id: `cert-${cert.id}`,
        type: 'CERTIFICATE',
        title: 'Certificate Generated',
        subtitle: `For: ${cert.student.name}`,
        timestamp: cert.issuedAt
      });
    });

    // Sort by descending timestamp and take top 10
    allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    const recentLogs = allEvents.slice(0, 10);

    return NextResponse.json({
      weeklyPerformance,
      recentLogs
    });
  } catch (error: any) {
    console.error('Error in Mentor Activity Trends:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
