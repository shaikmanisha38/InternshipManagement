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

    // 2. Check for Certificate Record
    const certificate = await prisma.certificate.findUnique({
      where: { studentId: userId },
      include: {
        student: {
          select: { name: true }
        }
      }
    });

    if (!certificate) {
      return NextResponse.json({
        success: true,
        status: 'locked',
        message: 'Your Certificate is Locked. Complete all curriculum mandates, outstanding daily tasks, and weekly assessments to unlock your official verification.'
      });
    }

    // 3. Return Active Certificate Metadata
    return NextResponse.json({
      success: true,
      status: 'active',
      data: {
        certificateNumber: certificate.certificateNumber,
        issuedDate: certificate.issuedDate,
        finalScore: certificate.finalScore,
        certificateUrl: certificate.certificateUrl,
        studentName: certificate.student.name,
      }
    });

  } catch (error: any) {
    console.error('Error fetching certificate status:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
