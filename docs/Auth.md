# Authentication & Middleware

## NextAuth Configuration

- Location: `src/lib/authOptions.ts`
- Strategy: JWT (`session.strategy = 'jwt'`)
- Providers:
  - `CredentialsProvider` — email + password, authenticates via `NEXT_PUBLIC_API_URL` `/token` endpoint.
  - `IframeJWTProvider` — custom credentials provider (`id: 'iframe-jwt'`) that accepts an upstream JWT, userId, and email for embedded scenarios.
- Flow (Credentials):
  1. POST to `/token` with `username` and `password`.
  2. Parse token response; extract `UserId`, `Email`, `access_token`.
  3. Fetch accounts: `/api/clientaccounts/GetUserAccountsByUserId?userId=<UserId>`.
  4. Fetch roles for first account: `/api/Roles/GetByUserIdAccountId?userId=<UserId>&accountId=<AccountId>`.
  5. Build `AuthenticatedUser` object and return.
- Callbacks:
  - `jwt` — copy fields from user to token (id, email, name, accessToken, tokenType, expiresIn, issued, expires, accountId, roles).
  - `session` — expose those token fields to `session` object.
  - `signIn` — basic validation to allow/deny sign-in.
- Pages:
  - `signIn: '/login'`, `error: '/login'`.

## Route Handler

- `src/app/api/auth/[...nextauth]/route.ts` exports `GET` and `POST` via `NextAuth(authOptions)`.

## Middleware

- `src/middleware.ts` protects routes and performs role-based redirects via `withAuth`.
- Public routes: `/`, `/login`, `/create-incident`, `/how-fixit-fast-works`, `/iframe`.
- Cookie control:
  - If user has exactly one role: sets `fifRoleId` and `fifRoleName` cookies and redirects to role home.
  - Multiple roles: redirects to `/role-select`.
- Role restrictions:
  - `Initiator` cannot access `/evaluator` or `/operator`.
  - `Evaluator` redirected to `/evaluator` when trying `/operator`, `/initiator`, or `/`.
  - `Operator` redirected to `/operator` when trying `/evaluator`, `/initiator`, or `/`.
  - `Account Administrator` redirected to `/admin` from other role groups.
- Authorized callback returns `true` for public routes; otherwise requires a token.

## Session & Expiry Handling

- `AccountIdProvider` computes `expiresAt` from `session.data.issued` + `expiresIn` and shows a modal when expired (non-public routes).
- On sign out and expiry, clears role cookies and redirects to `/`.

## Environment Variables

- `NEXTAUTH_URL` — base URL for NextAuth.
- `NEXTAUTH_SECRET` — required for JWT encryption/signing.
- `NEXT_PUBLIC_API_URL` — upstream API base.
- Optional public flow:
  - `NEXT_PUBLIC_ANONIMUSUSER_EMAIL`
  - `NEXT_PUBLIC_ANONIMUSUSER_PASSWORD`