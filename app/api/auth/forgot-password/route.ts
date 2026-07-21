import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAndStoreCode } from '@/lib/resetStore';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // For security, don't reveal that the user doesn't exist, just pretend we sent it
      return NextResponse.json({ message: 'If an account exists, a verification code has been sent.' }, { status: 200 });
    }

    // Generate code and store it in memory
    const code = generateAndStoreCode(email);

    // Send email
    const previewUrl = await sendVerificationEmail(user.email, code);

    // If using Ethereal, return the preview URL to the client for easy testing in development
    const message = previewUrl 
      ? \Test mode: Verification code sent. Preview URL: \\
      : 'Verification code sent to your email.';

    return NextResponse.json({ message, previewUrl }, { status: 200 });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
