# Architecture Overview

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript 5.9
- Mantine UI (components, modals, notifications)
- React Query (@tanstack/react-query)
- NextAuth (JWT strategy)
- next-intl (i18n)
- Tailwind CSS v4 via PostCSS
- SWC for builds; ESLint & Prettier for linting/formatting

## Top-Level Structure

- `src/app/layout.tsx`: Root layout. Wraps children with Mantine, NextAuth session, React Query, account ID provider, service worker registration, and NextIntl provider.
- `src/app/pages.tsx`: Root page content for `/`.
- `src/app/(public)`: Public routes and layout.
- `src/app/admin`, `src/app/evaluator`, `src/app/operator`, `src/app/initiator`: Role-based sections.
- `src/app/api`: Route handlers for server-side (e.g., NextAuth).

## Providers

- `AuthProvider`: wraps with NextAuth `SessionProvider`.
- `MantineProviderWrapper`: sets theme, modals, notifications.
- `QueryProvider`: React Query client with defaults and DevTools.
- `AccountIdProvider`: initializes/monitors session expiration; manages role cookies and sign out on expiry.
- `NextIntlClientProvider`: locale and messages injection.

## Middleware

- `src/middleware.ts`: Role-aware routing using `withAuth`.
  - Public routes: `/`, `/login`, `/create-incident`, `/how-fixit-fast-works`, `/iframe`.
  - If user has one role: sets `fifRoleId`/`fifRoleName` cookies and redirects to role home.
  - Multiple roles: redirects to `/role-select`.
  - Enforces role-only access to route groups.

## Styling & Theming

- Mantine theme via `src/lib/theme.ts`.
- Tailwind v4 configured with `postcss.config.js` using `@tailwindcss/postcss`.
- Global styles `src/app/global.css` and library styles loaded in `MantineProviderWrapper`.

## Build & Config

- `next.config.mjs`:
  - `next-intl` plugin configured via `./src/i18n/request.ts`.
  - Security headers (CSP allows frame-ancestors from `http://localhost:3001`).
  - SVG handled by `@svgr/webpack`.
  - Remote image patterns allow any `http/https` hosts.

## Data & API Access

- Client: `src/lib/api.ts` axios instance with auth header injection from session.
- Server: `src/lib/auth.ts` provides `fetchWithAuth` to call upstream API with JWT; attempts simple refresh by re-fetching session when 401.
- Constants: `src/constants/index.ts` defines `apiEndpoint` and `BASE_URL`.

## Internationalization

- `src/i18n/request.ts` reads `locale` cookie and loads messages from `messages/<locale>.json`.
- `NextIntlClientProvider` in root layout.
- `LanguageSwitcher` sets cookie and refreshes.

## PWA

- `public/manifest.json` and `public/sw.js`.
- Registers service worker via `ServiceWorkerRegistration`.
- Install prompt via `PWAInstallButton`.

## State Management

- Zustand stores: `auth-store`, `accountId-store`, plus location/inspection-template stores.
- Persistent storage with `zustand/middleware`.