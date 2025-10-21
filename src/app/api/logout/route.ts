import { NextResponse } from 'next/server';

export async function POST() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const cookie = `appToken=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${process.env.NODE_ENV !== 'development' ? 'Secure; ' : ''}`;
  headers['Set-Cookie'] = cookie;
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}


