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

    const url = new URL(req.url);
    const range = url.searchParams.get('range') || 'today';

    const now = new Date();
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (range === 'week') {
      startDate.setDate(startDate.getDate() - 6); // 7 days total including today
    } else if (range === 'month') {
      startDate.setDate(startDate.getDate() - 29); // 30 days total including today
    }

    // Get assigned students
    const mentoredInternships = await prisma.studentInternship.findMany({
      where: { internship: { mentorId } },
      select: { studentId: true }
    });
    const mentoredProjects = await prisma.projectStudent.findMany({
      where: { project: { mentorId } },
      select: { studentId: true }
    });
    const studentIds = [...new Set([...mentoredInternships.map(i => i.studentId), ...mentoredProjects.map(p => p.studentId)])];
    const totalStudents = studentIds.length;

    // Fetch attendance within range
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: { in: studentIds },
        date: { gte: startDate, lte: now }
      },
      orderBy: { date: 'asc' }
    });

    let presentCount = 0;
    let lateCount = 0;
    let totalHours = 0;
    let lateDelaySum = 0; 

    const daysInRange = range === 'today' ? 1 : (range === 'week' ? 7 : 30);
    const totalExpectedAttendances = totalStudents * daysInRange;

    const trendMap: Record<string, number> = {};
    const distributionMap: Record<string, number> = {};
    for (let i = 7; i <= 20; i++) {
        distributionMap[`${i.toString().padStart(2, '0')}:00`] = 0;
    }

    // Initialize trend map for the date range
    for (let i = 0; i < daysInRange; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      trendMap[dateStr] = 0;
    }

    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      
      if (record.status === 'Present' || record.status === 'Late') {
        presentCount++;
        if (trendMap[dateStr] !== undefined) trendMap[dateStr]++;
      } 
      
      if (record.status === 'Late') {
        lateCount++;
        
        if (record.loginTime) {
          const expectedLogin = new Date(record.loginTime);
          expectedLogin.setHours(9, 0, 0, 0);
          const delayMinutes = (record.loginTime.getTime() - expectedLogin.getTime()) / (1000 * 60);
          if (delayMinutes > 0) lateDelaySum += delayMinutes;
        }
      }

      if (record.hoursSpent) {
        totalHours += record.hoursSpent;
      }

      if (record.loginTime) {
        const hour = record.loginTime.getHours();
        const hourStr = `${hour.toString().padStart(2, '0')}:00`;
        if (distributionMap[hourStr] !== undefined) {
          distributionMap[hourStr]++;
        }
      }
    });

    let absentCount = totalExpectedAttendances - presentCount;
    if (absentCount < 0) absentCount = 0; 

    const presentRatio = totalExpectedAttendances > 0 ? Math.round((presentCount / totalExpectedAttendances) * 100) : 0;
    const absentRatio = totalExpectedAttendances > 0 ? Math.round((absentCount / totalExpectedAttendances) * 100) : 0;
    
    const avgDelay = lateCount > 0 ? Math.round(lateDelaySum / lateCount) : 0;
    const avgHours = presentCount > 0 ? (totalHours / presentCount).toFixed(1) : 0;

    const trendChart = Object.keys(trendMap).map(date => ({
      date,
      present: trendMap[date]
    }));

    const distributionChart = Object.keys(distributionMap).map(time => ({
      time,
      count: distributionMap[time]
    }));

    return NextResponse.json({
      metrics: {
        presentCount,
        presentRatio,
        absentCount,
        absentRatio,
        lateCount,
        avgDelay,
        avgHours
      },
      trendChart,
      distributionChart
    });

  } catch (error: any) {
    console.error('Error fetching mentor attendance:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
