import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/api/v1/github/callback';
  
  if (!clientId || clientId === 'dummy_client_id') {
    // Redirect back to the dashboard with an error flag instead of showing raw JSON
    const url = new URL(req.url);
    const origin = url.origin; // e.g. http://localhost:3000
    return NextResponse.redirect(`${origin}/dashboard/github?error=not_configured`);
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,admin:repo_hook`;
  
  return NextResponse.redirect(githubAuthUrl);
}
