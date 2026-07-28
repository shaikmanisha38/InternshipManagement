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

    const attendances = await prisma.attendance.findMany({
      where: { studentId: userId },
      orderBy: { date: 'desc' },
      take: 30
    });

    const formattedData = attendances.map((att, idx) => {
      // Formatting time helper
      const formatTime = (dateObj: Date | string | null | undefined) => {
        if (!dateObj) return '--:--';
        return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateObj));
      };

      const dateStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(att.date));
      let status = 'Present';
      if (!att.hoursSpent || att.hoursSpent === 0) status = 'Absent';
      else if (att.hoursSpent < 8) status = 'Late';

      return {
        key: att.id,
        date: dateStr,
        loginTime: formatTime(att.loginTime),
        logoutTime: formatTime(att.logoutTime),
        hours: att.hoursSpent ? att.hoursSpent.toFixed(2) : '0',
        status: status
      };
    });

    // Mock an active session state based on recent activity for the top banner
    let activeSession = null;
    let overallRate = 0;
    
    if (formattedData.length > 0) {
      const todayStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date());
      if (formattedData[0].date === todayStr && formattedData[0].logoutTime === '--:--') {
        activeSession = {
          loginTime: formattedData[0].loginTime,
          duration: 'Active'
        };
      }
      
      const presentCount = formattedData.filter(d => d.status === 'Present' || d.status === 'Late').length;
      overallRate = Math.round((presentCount / formattedData.length) * 100);
    } else {
      overallRate = 100; // default for new students
    }

    return NextResponse.json({
      attendanceData: formattedData,
      summary: {
        activeSession,
        overallRate
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching attendance data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
