import { NextResponse } from 'next/server';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://uat-api3.azurewebsites.net';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const upstream = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await upstream.json();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    try {
      const access = data?.access_token as string | undefined;
      const maxAge = (data?.expires_in as number | undefined) ?? 900;
      if (access) {
        const cookie = `appToken=${access}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAge}; ${
          process.env.NODE_ENV !== 'development' ? 'Secure; ' : ''
        }`;
        headers['Set-Cookie'] = cookie;
      }
    } catch {
      // ignore cookie set failures
    }
    return new NextResponse(JSON.stringify(data), {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Upstream error', error: String(error) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
