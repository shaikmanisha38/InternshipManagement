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

    const students = await prisma.user.findMany({
      where: {
        role: { roleName: 'STUDENT' }
      },
      include: {
        studentInternships: {
          include: {
            internship: true
          },
          orderBy: {
            startDate: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response for the frontend table
    const formattedStudents = students.map(s => {
      const activeInternship = s.studentInternships.length > 0 ? s.studentInternships[0] : null;
      
      return {
        key: s.id,
        id: s.id,
        name: s.name,
        email: s.email,
        course: s.department || 'N/A', // Using department as course for now
        status: activeInternship ? activeInternship.status : 'No Internship',
        internship: activeInternship ? activeInternship.internship.title : 'None'
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}
