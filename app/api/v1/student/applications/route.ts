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

    const applications = await prisma.internshipApplication.findMany({
      where: { studentId: userId },
      include: {
        internship: {
          select: {
            title: true,
            companyName: true,
            duration: true,
            difficulty: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    return NextResponse.json(applications);
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const body = await req.json();
    const { internshipId } = body;

    if (!internshipId) {
      return NextResponse.json({ message: 'Internship ID is required' }, { status: 400 });
    }

    // Check if already applied
    const existing = await prisma.internshipApplication.findFirst({
      where: { studentId: userId, internshipId }
    });

    if (existing) {
      return NextResponse.json({ message: 'Already applied for this internship' }, { status: 400 });
    }

    const application = await prisma.internshipApplication.create({
      data: {
        studentId: userId,
        internshipId,
        status: 'PENDING'
      }
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error('Error creating application:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
