'use server';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from './authOptions';
import { AuthenticatedUser } from '@/types/auth';

// Get the session on the server side
export async function getServerAuthSession() {
  return await getServerSession(authOptions as any);
}

// For protected routes: Redirect to login if not authenticated
export async function requireAuth() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}

// For public routes: Redirect to dashboard/profile if already authenticated
export async function requireNoAuth() {
  const session = await getServerAuthSession();

  if (session) {
    redirect('/');
  }

  return null;
}

// Server-side fetch with authentication
export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  let session: AuthenticatedUser | null = await getServerSession(
    authOptions as any
  );

  if (!session || !session.accessToken) {
    throw new Error('No access token available');
  }

  const { accessToken } = session;

  const authInit: RequestInit = {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };

  let res = await fetch(input, authInit);

  // If token is expired (401), try to refresh it
  if (res.status === 401) {
    // Re-fetch the session which triggers token refresh via `jwt` callback
    session = await getServerSession(authOptions as any); // getSession will trigger jwt callback which refreshes token if needed

    if (!session || !session.accessToken) {
      redirect('/login');
      // throw new Error("Token refresh failed");
    }

    const newAccessToken = session.accessToken;

    // Retry the original request with new token
    authInit.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${newAccessToken}`,
      'Content-Type': 'application/json',
    };

    res = await fetch(input, authInit);
  }

  return res;
}
