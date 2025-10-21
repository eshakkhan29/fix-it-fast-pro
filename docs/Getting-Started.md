# Getting Started

Fix-It-Fast is a Next.js 15 application with React 19, Mantine UI, next-intl for i18n, NextAuth for authentication, and React Query for data fetching. Tailwind CSS v4 is configured via PostCSS.

## Prerequisites

- Node.js `>=22`
- Yarn Classic `1.22.22`
- Git

Tip (Windows): if Corepack favors Yarn v4+, install Yarn Classic explicitly:

```
npm i -g yarn@1.22.22
```

## Install

```
yarn
```

Check Yarn version:

```
yarn -v  # expect 1.22.22
```

## Environment Variables

Create or update `.env.local` at the repository root:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secure-random-string>
NEXT_PUBLIC_API_URL=https://uat-api3.azurewebsites.net

NEXT_PUBLIC_ANONIMUSUSER_EMAIL= fif_initiator@walshintegrated.com
NEXT_PUBLIC_ANONIMUSUSER_PASSWORD= WalshFiF@123
```

Generate a secure secret:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Run (Development)

```
yarn dev
```

Open `http://localhost:3000`.

## Build & Run (Production)

```
yarn build
yarn start
```

## Lint & Type Check

- Lint: `yarn lint`
- Type check: `yarn type-check`

## Docker (Optional)

```
docker build -t fixitfast .
docker run --rm -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=<your-secret> \
  -e NEXT_PUBLIC_API_URL=https://uat-api3.azurewebsites.net \
  fixitfast
```