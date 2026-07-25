import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import dayjs from 'dayjs';


const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userRoleName = payload.role as string;
    if (userRoleName !== 'MENTOR' && userRoleName !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Mentor access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'Today';

    let startDate = dayjs().startOf('day').toDate();
    if (filter === 'Week') startDate = dayjs().subtract(7, 'day').startOf('day').toDate();
    if (filter === 'Month') startDate = dayjs().subtract(30, 'day').startOf('day').toDate();

    // Get submissions in range
    const submissions = await prisma.taskSubmission.findMany({
      where: {
        submittedAt: {
          gte: startDate,
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profileImage: true,
          }
        },
        task: {
          select: {
            title: true,
            week: true,
            day: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
    
    // Get total enrolled students (students with active internships)
    const activeInternsCount = await prisma.studentInternship.count({
      where: {
        status: 'ONGOING'
      }
    });

    const totalSubmissions = submissions.length;
    const submissionRate = activeInternsCount > 0 ? (totalSubmissions / activeInternsCount) * 100 : 0;
    const pendingReviews = submissions.filter((s: any) => s.status === 'PENDING').length;

    // Group for chart (by date string)
    const grouped = submissions.reduce((acc: any, curr: any) => {
      const dateStr = dayjs(curr.submittedAt).format('MMM DD');
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr]++;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(grouped).map(date => ({
      date,
      submissions: grouped[date]
    })).reverse(); // Oldest to newest for chart

    return NextResponse.json({
      submissions,
      metrics: {
        totalSubmissions,
        submissionRate: Math.round(submissionRate),
        pendingReviews,
        activeInternsCount
      },
      chartData
    });
  } catch (error: any) {
    console.error('Error fetching mentor submissions:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
