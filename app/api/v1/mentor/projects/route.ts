import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

async function authenticateAndGetMentorId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.headers.get('cookie')?.split('token=')?.[1]?.split(';')?.[0];
  }

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const verified = await jwtVerify(token, secret);
    const payload = verified.payload;

    if (payload.role !== 'MENTOR' && payload.role !== 'ADMIN') {
      return null;
    }
    return payload.userId as string;
  } catch (err) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const mentorId = await authenticateAndGetMentorId(req);
    if (!mentorId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { mentorId },
      include: {
        mentor: { select: { name: true, profileImage: true } },
        assignedUsers: {
          include: {
            student: { select: { id: true, name: true, profileImage: true } }
          }
        },
        taskTrackers: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedProjects = projects.map(p => {
      // Calculate completion %
      const totalStudents = p.taskTrackers.length;
      let sumProgress = 0;
      if (totalStudents > 0) {
        sumProgress = p.taskTrackers.reduce((acc, t) => acc + t.progress, 0);
      }
      const completion = totalStudents > 0 ? Math.round(sumProgress / totalStudents) : 0;

      return {
        id: p.id,
        name: p.title,
        duration: `${p.durationWeeks} Weeks`,
        status: p.status,
        completion,
        students: p.assignedUsers.map(au => ({
          id: au.student.id,
          name: au.student.name,
          avatar: au.student.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(au.student.name)}`
        })),
        mentor: {
          name: p.mentor.name,
          avatar: p.mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.mentor.name)}`
        }
      };
    });

    return NextResponse.json(formattedProjects);
  } catch (error: any) {
    console.error('Error fetching mentor projects:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const mentorId = await authenticateAndGetMentorId(req);
    if (!mentorId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, durationWeeks, status, studentIds } = body;

    if (!title || !durationWeeks || !status) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        durationWeeks: parseInt(durationWeeks),
        status,
        mentorId,
      }
    });

    if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
      // Create ProjectStudent links and TaskTracker initial entries
      await Promise.all(studentIds.map(async (studentId) => {
        await prisma.projectStudent.create({
          data: { projectId: project.id, studentId }
        });
        await prisma.taskTracker.create({
          data: { projectId: project.id, studentId, progress: 0.0 }
        });
      }));
    }

    return NextResponse.json({ message: 'Project created successfully', project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating mentor project:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
