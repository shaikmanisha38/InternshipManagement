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
    await jwtVerify(token, secret);

    // 2. Fetch all open internships
    const internships = await prisma.internship.findMany({
      where: {
        status: { in: ['OPEN', 'Active'] }
      },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        techStack: true,
        technology: true,
        difficulty: true,
        mentorId: true,
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ internships });
  } catch (error: any) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
