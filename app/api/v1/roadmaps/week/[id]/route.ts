import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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
    try {
      await jwtVerify(token, secret);
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // `id` is actually the internshipId from the frontend
    const internshipId = params.id;
    const url = new URL(req.url);
    const weekNumberStr = url.searchParams.get('weekNumber');
    
    if (!internshipId || !weekNumberStr) {
      return NextResponse.json({ message: 'Missing internshipId or weekNumber' }, { status: 400 });
    }

    const weekNumber = parseInt(weekNumberStr, 10);

    const roadmap = await prisma.roadmap.findFirst({
      where: { 
        internshipId: internshipId,
        weekNumber: weekNumber
      },
      include: {
        roadmapDays: {
          orderBy: { dayNumber: 'asc' }
        }
      }
    });

    if (!roadmap) {
      return NextResponse.json({ message: 'Roadmap week not found.' }, { status: 404 });
    }

    // Next.js returning { week: roadmap } or just roadmap?
    // Wait, the frontend code in Roadmap.jsx:
    // const weeksData = await Promise.all(weeksPromises);
    // weeksData.sort((a, b) => a.week.weekNumber - b.week.weekNumber);
    // This implies the response should be { week: roadmapData } or similar?
    // Let's check `Roadmap.jsx` to be sure. It expects `a.week.weekNumber`.
    // Wait, I will wrap it in { week: roadmap }
    return NextResponse.json({ 
      week: roadmap,
      days: roadmap.roadmapDays 
    });
  } catch (error: any) {
    console.error('Error fetching roadmap week:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
