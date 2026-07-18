import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    // 1. Authenticate user (optional for viewing, but required for "You" highlight)
    const authHeader = req.headers.get('authorization');
    let token = null;
    let currentUserId = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
    }

    if (token) {
      try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        currentUserId = payload.userId as string;
      } catch (err) {
        console.warn("Invalid token for leaderboard, continuing unauthenticated.");
      }
    }

    // 2. Extract Query Parameters
    const url = new URL(req.url);
    const college = url.searchParams.get('college');
    const department = url.searchParams.get('department');
    const batch = url.searchParams.get('batch');
    const search = url.searchParams.get('search');

    // 3. Build Prisma Filter for Student Relation
    const studentFilter: any = {};
    if (college && college !== 'all') {
      studentFilter.college = { equals: college, mode: 'insensitive' };
    }
    if (department && department !== 'all') {
      studentFilter.department = { equals: department, mode: 'insensitive' };
    }
    if (batch && batch !== 'all') {
      studentFilter.year = parseInt(batch, 10);
    }
    if (search) {
      studentFilter.name = { contains: search, mode: 'insensitive' };
    }

    // 4. Fetch Leaderboard Data
    const leaderboards = await prisma.leaderboard.findMany({
      where: {
        student: studentFilter
      },
      orderBy: {
        points: 'desc'
      },
      include: {
        student: {
          include: {
            studentBadges: {
              include: { badge: true }
            },
            _count: {
              select: {
                taskSubmissions: {
                  where: { status: 'VERIFIED' }
                }
              }
            }
          }
        }
      }
    });

    // 5. Fetch Total Active Tasks for Ratio
    const totalTasks = await prisma.task.count();

    // 6. Map and Format the Response
    const formattedData = leaderboards.map((lb, index) => {
      // If the user has a saved rank, we could use `lb.rank`, 
      // but dynamically calculating rank by index is safer for filtered views
      const displayRank = index + 1; 

      return {
        key: lb.studentId,
        rank: displayRank,
        globalRank: lb.rank || displayRank,
        name: lb.student.name,
        profileImage: lb.student.profileImage,
        points: lb.points,
        tasksCompleted: lb.student._count.taskSubmissions,
        totalTasks: totalTasks,
        tasks: `${lb.student._count.taskSubmissions} / ${totalTasks} Tasks`,
        isCurrentUser: lb.studentId === currentUserId,
        badges: lb.student.studentBadges.map((sb) => ({
          id: sb.badge.id,
          name: sb.badge.badgeName,
          points: sb.badge.points
        }))
      };
    });

    return NextResponse.json({
      success: true,
      currentUserId,
      data: formattedData
    });

  } catch (error: any) {
    console.error('Error fetching leaderboard data:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
