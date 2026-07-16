import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Protected routes configuration
const protectedRoutes = ['/dashboard', '/mentor', '/admin', '/api/protected'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Get token from Authorization header or cookies
  let token = null;
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    // Optionally check cookies if we set token in cookies (good for Next.js)
    token = request.cookies.get('token')?.value;
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    // Verify token using jose for Edge compatibility
    const { payload } = await jwtVerify(token, secret);
    
    // Check role-based access
    const role = payload.role as string;
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (pathname.startsWith('/mentor') && role !== 'MENTOR') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
