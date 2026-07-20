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
    let payload;
    try {
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
    const userId = payload.userId as string;

    // 2. Fetch User Attendance Records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: userId },
      orderBy: { date: 'desc' }
    });

    if (attendanceRecords.length === 0) {
      return NextResponse.json(getZeroedData());
    }

    // 3. Aggregate Stats
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    const formattedHistory = attendanceRecords.map((record, index) => {
      // Metric counters
      if (record.status === 'Present') {
        presentCount++;
      } else if (record.status === 'Late') {
        lateCount++;
      } else if (record.status === 'Absent') {
        absentCount++;
      } else {
        // Fallback
        presentCount++;
      }

      // Calculate Hours
      let hoursWorked = 0;
      if (record.status === 'Absent') {
        hoursWorked = 0;
      } else if (record.loginTime && record.logoutTime) {
        const login = new Date(record.loginTime);
        const logout = new Date(record.logoutTime);
        const diffMs = logout.getTime() - login.getTime();
        hoursWorked = Math.max(0, diffMs / (1000 * 60 * 60)); // in hours
      } else if (record.hoursSpent) {
        hoursWorked = record.hoursSpent;
      }

      // Format times
      const formatDate = (dateString: Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          month: 'short', day: '2-digit', year: 'numeric'
        });
      };
      
      const formatTime = (timeString: Date | null) => {
        if (!timeString) return '--:--';
        return new Date(timeString).toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
      };

      return {
        key: record.id || String(index),
        date: formatDate(record.date),
        loginTime: formatTime(record.loginTime),
        logoutTime: formatTime(record.logoutTime),
        hours: hoursWorked.toFixed(1), // format as decimal string like '8.5'
        status: record.status || 'Present',
      };
    });

    const totalRecords = attendanceRecords.length;
    const overallPercentage = totalRecords > 0 
      ? Math.round(((presentCount + lateCount) / totalRecords) * 100) 
      : 0;

    return NextResponse.json({
      summary: {
        overallPercentage,
        presentCount: presentCount + lateCount, // Including late in total present
        lateCount,
        absentCount
      },
      history: formattedHistory
    });

  } catch (error: any) {
    console.error('Error fetching attendance summary:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

function getZeroedData() {
  return {
    summary: { overallPercentage: 0, presentCount: 0, lateCount: 0, absentCount: 0 },
    history: []
  };
}
