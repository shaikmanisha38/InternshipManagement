import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get('token')?.value;

    if (!token) {
      const authHeader = request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Helper to gracefully handle missing tables due to schema drift
    const safeCount = async (queryPromise: Promise<number>) => {
      try {
        return await queryPromise;
      } catch (e) {
        console.error("Skipping count due to missing table or error");
        return 0;
      }
    };

    // Run queries in parallel for performance
    const [
      totalStudents,
      totalMentors,
      totalInternships,
      pendingApplications,
      activeInternships,
      completedInternships,
      certificatesIssued
    ] = await Promise.all([
      safeCount(prisma.user.count({ where: { role: { roleName: 'STUDENT' } } })),
      safeCount(prisma.user.count({ where: { role: { roleName: 'MENTOR' } } })),
      safeCount(prisma.internship.count()),
      safeCount(prisma.internshipApplication.count({ where: { status: 'PENDING' } })),
      safeCount(prisma.studentInternship.count({ where: { status: 'ONGOING' } })),
      safeCount(prisma.studentInternship.count({ where: { status: 'COMPLETED' } })),
      safeCount(prisma.certificate.count())
    ]);

    return NextResponse.json({
      totalStudents,
      totalMentors,
      totalInternships,
      pendingApplications,
      activeInternships,
      completedInternships,
      certificatesIssued
    });
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
