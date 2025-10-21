# API Utilities & Environment Variables

## Axios Client

- File: `src/lib/api.ts`
- Base URL: `apiEndpoint` from `src/constants/index.ts` or `process.env.NEXT_PUBLIC_API_URL`.
- Timeout: 30 seconds.
- Headers: `Content-Type: application/json`.
- Request interceptor: attaches `Authorization: Bearer <session.accessToken>` when available via `next-auth/react`.
- Response interceptor: on `401`, triggers redirect to `/login`.

## Server Fetch Helper

- File: `src/lib/getApiData.tsx`
- `fetchWithAuth(url, options)` sets `Authorization` using server session.
- Returns `Promise<{ok: boolean, data?: any, error?: string}>`.
- Logs errors; handles non-OK responses gracefully.

## Credentials Provider Helpers

- File: `src/lib/IframeJWTProvider.ts`
- Accepts a token (`accessToken`), `userId`, and `email` via credentials.
- Fetches accounts and roles using the provided token and constructs `AuthenticatedUser`.

## Constants

- File: `src/constants/index.ts`
- `BASE_URL`: derived from `NEXTAUTH_URL` or `window.location.origin`.
- `apiEndpoint`: default upstream API base `https://uat-api3.azurewebsites.net`.

## Environment Variables

- `NEXTAUTH_URL` — full origin of the app (e.g., `http://localhost:3000`).
- `NEXTAUTH_SECRET` — required secret for NextAuth JWT.
- `NEXT_PUBLIC_API_URL` — base URL for upstream API when overriding default.
- `NEXT_PUBLIC_ANONIMUSUSER_EMAIL`, `NEXT_PUBLIC_ANONIMUSUSER_PASSWORD` — optional anonymous user credentials for public incident flows.

## Error Handling Patterns

- Prefer treating `401` as sign-out + redirect rather than retry loops.
- Use React Query for data fetching where caching/stale-time matter.
- Surface user-friendly errors via Mantine `Notifications`.