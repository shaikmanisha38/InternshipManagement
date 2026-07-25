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
    if (!studentRole) {
      return NextResponse.json({ message: 'Student role not found' }, { status: 500 });
    }

    // Get all students and their active internships and github accounts
    const students = await prisma.user.findMany({
      where: { roleId: studentRole.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        profileImage: true,
        githubAccount: {
          select: {
            username: true,
            isConnected: true,
            repository: true,
          }
        },
        studentInternships: {
          include: {
            internship: {
              select: {
                title: true,
                duration: true,
                techStack: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(students);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
