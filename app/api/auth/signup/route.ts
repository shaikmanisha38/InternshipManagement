import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, college, department } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: { connect: { roleName: role } },
        college,
        department,
      },
      include: { role: true },
    });

    const { password: _, role: userRole, ...userWithoutPassword } = user;
    return NextResponse.json({ ...userWithoutPassword, role: userRole.roleName }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
