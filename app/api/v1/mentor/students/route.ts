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

    // 2. Extract Query Params
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const batch = url.searchParams.get('batch') || 'all';
    const dept = url.searchParams.get('dept') || 'all';
    const statusFilter = url.searchParams.get('status') || 'all';

    // 3. Prisma Base Query Structure
    const whereClause: any = {
      internship: { mentorId: userId },
      student: {}
    };

    if (search) {
      whereClause.student.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (batch !== 'all') {
      const year = parseInt(batch, 10);
      if (!isNaN(year)) whereClause.student.year = year;
    }

    if (dept !== 'all') {
      whereClause.student.department = dept;
    }

    if (statusFilter === 'completed') {
      whereClause.status = 'COMPLETED';
    } else if (statusFilter === 'inactive') {
      whereClause.status = 'DROPPED';
    } else if (statusFilter === 'active' || statusFilter === 'behind') {
      whereClause.status = 'ONGOING';
    }

    // Clean up empty student clause
    if (Object.keys(whereClause.student).length === 0) {
      delete whereClause.student;
    }

    // 4. Execute Query
    const studentInternships = await prisma.studentInternship.findMany({
      where: whereClause,
      include: {
        student: {
          include: {
            attendance: { select: { status: true } },
            taskSubmissions: {
              select: {
                aiEvaluation: { select: { score: true } }
              }
            },
            githubAccount: { select: { username: true } }
          }
        }
      }
    });

    // 5. Map & Calculate Sub-aggregates
    const now = Date.now();

    const formattedStudents = studentInternships.map(si => {
      const student = si.student;

      // Calculate Computed Status for ONGOING
      let computedStatus = 'Active';
      if (si.status === 'COMPLETED') computedStatus = 'Completed';
      else if (si.status === 'DROPPED') computedStatus = 'Inactive';
      else {
        // ONGOING check for behind schedule
        const elapsedDays = (now - si.startDate.getTime()) / (1000 * 60 * 60 * 24);
        if (elapsedDays > 7 && si.progress < elapsedDays * 0.5) {
          computedStatus = 'Behind Schedule';
        }
      }

      // Strict filter for 'behind' or 'active' (since both share ONGOING DB status)
      if (statusFilter === 'behind' && computedStatus !== 'Behind Schedule') return null;
      if (statusFilter === 'active' && computedStatus !== 'Active') return null;

      // Attendance Percentage
      let attendancePct = 0;
      if (student.attendance && student.attendance.length > 0) {
        const present = student.attendance.filter(a => a.status === 'Present').length;
        attendancePct = Math.round((present / student.attendance.length) * 100);
      }

      // AI Score Average
      let aiScoreAvg = 0;
      const evals = student.taskSubmissions
        .map(ts => ts.aiEvaluation?.score)
        .filter(s => s !== undefined && s !== null);
      if (evals.length > 0) {
        aiScoreAvg = Math.round(evals.reduce((a, b) => a + b, 0) / evals.length);
      }

      return {
        key: si.id,
        studentId: student.id,
        name: student.name,
        email: student.email,
        avatar: student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`,
        college: student.college || 'N/A',
        department: student.department || 'N/A',
        year: student.year,
        week: si.currentWeek,
        day: si.currentDay,
        progress: si.progress,
        attendance: attendancePct,
        aiScore: aiScoreAvg,
        status: computedStatus,
        github: student.githubAccount?.username || null
      };
    }).filter(Boolean);

    return NextResponse.json({ data: formattedStudents });

  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
