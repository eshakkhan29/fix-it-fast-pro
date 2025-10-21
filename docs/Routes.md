# Routes & Layouts

This app uses Next.js App Router with segment-based layouts.

## Route Groups

- `(public)` — public-facing:
  - `layout.tsx` uses `PublicLayout`
  - `(home)/page.tsx` — home
  - `create-incident/page.tsx` — public incident creation
  - `how-fixit-fast-works/page.tsx` — marketing/info page
  - `iframe/page.tsx` — embedded flow
  - `role-select/page.tsx` — select role when multiple
- `(auth)` — auth pages:
  - `login/page.tsx`, `logout/page.tsx`
- `admin` — account administrator dashboard and tools
- `evaluator` — evaluator dashboard, incident-management
- `operator` — operator dashboard, incident-management
- `initiator` — initiator dashboard

## Shared Layouts

- `src/app/layout.tsx` — root, wraps providers and global CSS
- `src/app/(public)/layout.tsx` — uses `PublicLayout`
- `src/components/layout/public/PublicLayout.tsx` — top nav, background, PWA install button
- `src/components/layout/evaluator/EvaluatorLayout.tsx` — side nav + top nav; mobile drawer

## API Routes

- `src/app/api/auth/[...nextauth]/route.ts` — NextAuth route
- `src/app/api/logout/route.ts` — logout orchestration
- `src/app/api/token/route.ts` — token helper (if present)
- `src/app/api/locationNodes/ByLocationType` — location endpoints

## Middleware-based Routing

- `src/middleware.ts` protects routes and redirects based on cookies `fifRoleId`, `fifRoleName` and token roles.
  - Enforces role-only access to `/admin`, `/evaluator`, `/operator`, `/initiator`.
  - Keeps public routes accessible without authentication.