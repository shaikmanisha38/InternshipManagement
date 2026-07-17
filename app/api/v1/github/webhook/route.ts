import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function POST(req: Request) {
  try {
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

    const secret = new TextEncoder().encode(JWT_SECRET);
    let userId;
    try {
      const verified = await jwtVerify(token, secret);
      userId = verified.payload.userId as string;
    } catch (e) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { active } = body;

    const githubAccount = await prisma.githubAccount.findUnique({
      where: { userId }
    });

    if (!githubAccount || !githubAccount.isConnected || !githubAccount.accessToken) {
      return NextResponse.json({ message: 'GitHub account not connected.' }, { status: 400 });
    }

    if (!githubAccount.repository) {
      return NextResponse.json({ message: 'No repository selected.' }, { status: 400 });
    }

    const headers = {
      Authorization: `Bearer ${githubAccount.accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    const webhookPayloadUrl = process.env.WEBHOOK_PAYLOAD_URL || 'https://example.com/api/v1/github/webhook-receiver';

    if (active) {
      // Create Webhook
      if (githubAccount.webhookId) {
        return NextResponse.json({ success: true, message: 'Webhook already active.' });
      }

      const createRes = await fetch(`https://api.github.com/repos/${githubAccount.username}/${githubAccount.repository}/hooks`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push'],
          config: {
            url: webhookPayloadUrl,
            content_type: 'json'
          }
        })
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        return NextResponse.json({ message: 'Failed to create webhook on GitHub.', error: err }, { status: 500 });
      }

      const hookData = await createRes.json();
      
      await prisma.githubAccount.update({
        where: { userId },
        data: { webhookId: String(hookData.id) }
      });

      return NextResponse.json({ success: true, message: 'Webhook activated.' });

    } else {
      // Delete Webhook
      if (!githubAccount.webhookId) {
        return NextResponse.json({ success: true, message: 'Webhook already disabled.' });
      }

      const deleteRes = await fetch(`https://api.github.com/repos/${githubAccount.username}/${githubAccount.repository}/hooks/${githubAccount.webhookId}`, {
        method: 'DELETE',
        headers
      });

      if (!deleteRes.ok && deleteRes.status !== 404) {
        return NextResponse.json({ message: 'Failed to delete webhook on GitHub.' }, { status: 500 });
      }

      await prisma.githubAccount.update({
        where: { userId },
        data: { webhookId: null }
      });

      return NextResponse.json({ success: true, message: 'Webhook deactivated.' });
    }

  } catch (error: any) {
    console.error('Error managing github webhook:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
