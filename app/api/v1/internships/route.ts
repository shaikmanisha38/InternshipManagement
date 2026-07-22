import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const internships = await prisma.internship.findMany({
      where: {
        status: 'OPEN'
      },
      select: {
        id: true,
        title: true,
        description: true,
        companyName: true,
        duration: true,
        difficulty: true,
        techStack: true,
        maxCapacity: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(internships);
  } catch (error: any) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ message: `Internal server error: ${error.message}` }, { status: 500 });
  }
}
