import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';


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

    const studentRole = await prisma.role.findUnique({ where: { roleName: 'STUDENT' } });
    if (!studentRole) return NextResponse.json({ message: 'Error finding student role' }, { status: 500 });

    // 1. Total Students
    const totalStudents = await prisma.user.count({ where: { roleId: studentRole.id } });
    
    // 2. Completed Internships & Certificates
    const completedInternships = await prisma.studentInternship.count({ where: { status: 'COMPLETED' } });
    const certificatesIssued = await prisma.certificate.count();

    // 3. Pending Reviews
    const pendingApps = await prisma.internshipApplication.count({ where: { status: 'PENDING' } });
    const pendingTasks = await prisma.taskSubmission.count({ where: { status: 'PENDING' } });
    const totalPendingReviews = pendingApps + pendingTasks;

    // 4. Progress Breakdown
    const completed = await prisma.studentInternship.count({ where: { status: 'COMPLETED' } });
    const inProgress = await prisma.studentInternship.count({ where: { status: 'ONGOING' } });
    const inactive = await prisma.studentInternship.count({ where: { status: 'DROPPED' } });
    // Assuming "behind schedule" is just 0 for now since we don't have logic for it.
    const behindSchedule = 0;

    return NextResponse.json({
      totalStudents,
      activeUsers: totalStudents,
      completedInternships,
      certificatesIssued,
      pendingReviews: totalPendingReviews,
      todaysSubmissions: 0,
      avgAiScore: 0,
      avgAttendance: 0,
      progressData: [
        { name: 'Completed', value: completed, color: '#10b981' },
        { name: 'In Progress', value: inProgress, color: '#3b82f6' },
        { name: 'Inactive', value: inactive, color: '#94a3b8' },
        { name: 'Behind Schedule', value: behindSchedule, color: '#f59e0b' },
      ],
      weeklyPerformance: [] // Empty for now
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
