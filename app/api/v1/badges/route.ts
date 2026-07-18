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

    let userId: string;
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // 2. Fetch all system badges
    const allBadges = await prisma.badge.findMany({
      orderBy: { points: 'desc' }
    });

    // 3. Fetch user's earned badges
    const earnedBadges = await prisma.studentBadge.findMany({
      where: { studentId: userId },
      select: { badgeId: true, earnedAt: true }
    });

    // Create a Set/Map for fast lookup
    const earnedBadgeMap = new Map();
    earnedBadges.forEach(eb => {
      earnedBadgeMap.set(eb.badgeId, eb.earnedAt);
    });

    // 4. Merge and Map
    const mappedBadges = allBadges.map(badge => {
      const isUnlocked = earnedBadgeMap.has(badge.id);
      return {
        id: badge.id,
        title: badge.badgeName,
        description: badge.description || `Earn the ${badge.badgeName} badge.`,
        points: badge.points,
        unlocked: isUnlocked,
        earnedAt: isUnlocked ? earnedBadgeMap.get(badge.id) : null
      };
    });

    // Calculate Summary Stats
    const totalBadges = allBadges.length;
    const unlockedBadges = earnedBadgeMap.size;

    return NextResponse.json({
      success: true,
      stats: {
        totalBadges,
        unlockedBadges,
        progressPercent: totalBadges > 0 ? Math.round((unlockedBadges / totalBadges) * 100) : 0
      },
      data: mappedBadges
    });

  } catch (error: any) {
    console.error('Error fetching badges data:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
