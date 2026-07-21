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

    // 2. Fetch Aggregated Metrics
    
    // Mentor's students (distinct)
    const mentoredStudentInternships = await prisma.studentInternship.findMany({
      where: {
        internship: { mentorId: userId }
      },
      select: { studentId: true, status: true, progress: true, startDate: true }
    });

    const uniqueStudentIds = [...new Set(mentoredStudentInternships.map(s => s.studentId))];
    const totalStudents = uniqueStudentIds.length;
    const activeUsers = mentoredStudentInternships.filter(s => s.status === 'ONGOING').length;
    
    // Pipeline Breakdown
    let completedCount = 0;
    let inProgressCount = 0;
    let inactiveCount = 0;
    let behindScheduleCount = 0;

    const now = Date.now();
    
    mentoredStudentInternships.forEach(si => {
      if (si.status === 'COMPLETED') {
        completedCount++;
      } else if (si.status === 'DROPPED') {
        inactiveCount++;
      } else {
        // ONGOING
        inProgressCount++;
        // Heuristic for Behind Schedule: 
        // e.g., been enrolled for more than a week but progress is less than 5%
        // Since duration is arbitrary, we use a simple check for low progress relative to elapsed time
        const elapsedDays = (now - si.startDate.getTime()) / (1000 * 60 * 60 * 24);
        // Assuming 1% progress per day is the minimum expected pace (100 days total)
        if (elapsedDays > 7 && si.progress < elapsedDays * 0.5) {
            behindScheduleCount++;
        }
      }
    });

    // Ensure they sum up to total count for chart data
    const totalPipeline = completedCount + inProgressCount + inactiveCount + behindScheduleCount;

    // Certificates Issued (for these students)
    const certificatesCount = await prisma.certificate.count({
      where: {
        studentId: { in: uniqueStudentIds }
      }
    });

    // Submissions nested relation filter
    const mentorTaskFilter = {
      task: {
        roadmapDay: {
          roadmap: {
            internship: { mentorId: userId }
          }
        }
      }
    };

    // Pending Reviews
    const pendingReviews = await prisma.taskSubmission.count({
      where: {
        status: 'PENDING',
        ...mentorTaskFilter
      }
    });

    // Today's Submissions
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todaysSubmissions = await prisma.taskSubmission.count({
      where: {
        submittedAt: { gte: startOfToday, lte: endOfToday },
        ...mentorTaskFilter
      }
    });

    // Avg AI Score
    const aiEvals = await prisma.aiEvaluation.aggregate({
      _avg: { score: true },
      where: {
        submission: mentorTaskFilter
      }
    });
    const avgAiScore = Math.round(aiEvals._avg.score || 0);

    // Avg Attendance for these students
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId: { in: uniqueStudentIds } },
      select: { status: true }
    });
    
    let avgAttendance = 0;
    if (attendanceRecords.length > 0) {
      const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
      avgAttendance = Math.round((presentCount / attendanceRecords.length) * 100);
    }

    const responseData = {
      metrics: {
        totalStudents,
        activeUsers,
        completedInternships: completedCount,
        certificatesIssued: certificatesCount,
        pendingReviews,
        todaysSubmissions,
        avgAiScore,
        avgAttendance,
      },
      pipeline: {
        completed: completedCount,
        inProgress: inProgressCount,
        inactive: inactiveCount,
        behindSchedule: behindScheduleCount,
        total: totalPipeline
      }
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Error in Mentor Overview:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
