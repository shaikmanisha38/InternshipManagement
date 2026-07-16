import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Please signup before login' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role.roleName,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.roleName,
      },
    }, { status: 200 });

    response.cookies.set('token', token, {
      httpOnly: false, // Set to false if client needs to read it, but ideally true
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
