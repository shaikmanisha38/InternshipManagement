import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // 1. Authenticate user from cookie or query param
    let token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
    
    if (!token) {
        token = url.searchParams.get('token') || undefined;
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

    if (!certificate || !certificate.certificateUrl) {
      return NextResponse.json({ message: 'Certificate not found or no file available.' }, { status: 404 });
    }

    // 3. Cleanly fetch the asset and stream it back as a downloadable PDF Blob
    try {
      const pdfResponse = await fetch(certificate.certificateUrl);
      if (!pdfResponse.ok) {
        throw new Error('Failed to fetch the PDF asset from the source URL.');
      }
      
      const blob = await pdfResponse.blob();
      const safeName = certificate.student.name.replace(/[^a-zA-Z0-9]/g, '_');
      
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeName}_Certificate.pdf"`,
        },
      });
    } catch (streamError) {
      console.warn("Failed to stream PDF blob, falling back to redirect.", streamError);
      return NextResponse.redirect(certificate.certificateUrl);
    }

  } catch (error: any) {
    console.error('Error fetching certificate status:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
