# Fix-It-Fast — Local Development Guide

This guide explains how to clone the repo, install packages, configure environment variables, and run the app locally. The project is a Next.js 15 application using React 19, Mantine UI, next-intl for i18n, and NextAuth for authentication.

## Prerequisites

- Node.js `>=22` (recommended 22.x)
- Yarn Classic `1.22.22` (the repo is configured for Yarn 1)
- Git

Tip (Windows): If Corepack is active, it defaults to newer Yarn versions. Install Yarn Classic directly:

```
npm i -g yarn@1.22.22
```

## 1) Clone the Repository

```
git clone https://github.com/Devs-On-Steroids/Fix-It-Fast.git
cd Fix-It-Fast
```

If you already have the source on disk, just `cd` into the project root.

## 2) Install Dependencies

```
yarn install
```

If you see errors complaining about Yarn version, ensure you’re on Yarn Classic 1.x:

```
yarn -v   # should print 1.22.22
```

### Update to latest code

- Git Bash/WSL: `git pull origin main && yarn`
- PowerShell: `git pull origin main; yarn`

## 3) Configure Environment Variables

This app uses NextAuth and calls an upstream API. Create or update `.env.local` in the project root. A sample file already exists in the repo:

`./.env.local`

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme-development-secret
NEXT_PUBLIC_API_URL=https://uat-api3.azurewebsites.net

# Anonymous user credentials (used for specific public flows)
NEXT_PUBLIC_ANONIMUSUSER_EMAIL= fif_initiator@walshintegrated.com
NEXT_PUBLIC_ANONIMUSUSER_PASSWORD= WalshFiF@123
```

- `NEXTAUTH_URL`: Local dev URL
- `NEXTAUTH_SECRET`: Set a secure random string. You can generate one with:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `NEXT_PUBLIC_API_URL`: Base URL for the backend API
- `NEXT_PUBLIC_ANONIMUSUSER_*`: Used by the public incident creation flow to sign in automatically when certain query params are present

Ensure you can reach the API host from your machine; otherwise, login or data fetches may fail.

## 4) Run Locally (Development)

Start the Next.js dev server:

```
yarn dev
```

Open the app at:

```
http://localhost:3000
```

### Authentication Notes

- Standard login uses NextAuth credentials provider (`email` + `password`) against `NEXT_PUBLIC_API_URL`.
- On the public “create incident” flow, if certain parameters are present, the app signs in using `NEXT_PUBLIC_ANONIMUSUSER_EMAIL` and `NEXT_PUBLIC_ANONIMUSUSER_PASSWORD`.

## 5) Build and Run (Production)

Build the app:

```
yarn build
```

Start the production server:

```
yarn start
```

The server runs on `http://localhost:3000` by default. Make sure your production environment variables are set before running `yarn start`.

## 6) Lint and Type Check

- Lint:
  ```
  yarn lint
  ```
- Type check:
  ```
  yarn type-check
  ```

## 8) Run with Docker (Optional)

A multi-stage `Dockerfile` is provided.

Build the image:

```
docker build -t fixitfast .
```

Run the container (supply envs as needed):

```
docker run --rm -p 3000:3000 \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXTAUTH_SECRET=<your-secret> \
  -e NEXT_PUBLIC_API_URL=https://uat-api3.azurewebsites.net \
  fixitfast
```

Then visit `http://localhost:3000`.

## Troubleshooting

- "Unauthorized" or 401 responses: Confirm `NEXT_PUBLIC_API_URL` is reachable and credentials are valid.
- Yarn errors about version: Ensure Yarn Classic 1.x (`1.22.22`) is installed.
- i18n missing messages: Verify the locale exists in `messages/<locale>.json` and that `LanguageSwitcher` is set up.
- Service Worker/PWA: Some PWA features may behave differently in dev vs production; build and start for accurate behavior.

## Project Scripts

- `yarn dev`: Run the dev server
- `yarn build`: Build the app
- `yarn start`: Start the production server
- `yarn lint`: Lint the codebase
- `yarn type-check`: TypeScript type checking
- `yarn export`: Static export (not required for typical Next.js server deployments)
