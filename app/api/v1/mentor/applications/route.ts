import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;
    const roleId = payload.roleId as string;

    // Verify user is Mentor or Admin
    const userRole = await prisma.role.findUnique({ where: { id: roleId } });
    if (!userRole || (userRole.roleName !== 'MENTOR' && userRole.roleName !== 'ADMIN')) {
      return NextResponse.json({ message: 'Forbidden: Mentor access required' }, { status: 403 });
    }

    // Get all pending applications
    const applications = await prisma.internshipApplication.findMany({
      where: { status: 'PENDING' },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            college: true
          }
        },
        internship: {
          select: {
            title: true,
            companyName: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error: any) {
    console.error('Error fetching pending applications:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
