# State Management & Providers

## Zustand Stores

### Auth Store

- File: `src/stores/auth/auth-store.ts`
- State: `user` (id, email, name), `token`, `isAuthenticated`, `isLoading`.
- Actions: `login`, `logout`, `setUser`, `setLoading`.
- Persistence: `zustand/middleware` with storage key `fif-auth`.

### Account ID Store

- File: `src/stores/user/accountId-store.ts`
- State: `userAccountId`, `isLoading`, `error`, `isInitialized`, `role`.
- Actions: `initializeAccountId`, `setUserAccountId`, `clearAccountId`, `setRole`.
- Persistence: `zustand/middleware` with storage key `fif-accountId`.

### Other Stores

- `src/stores/location/location-model-store.ts`
- `src/stores/inspection-template/inspection-template-stor.ts`

## Providers

### AuthProvider

- File: `src/providers/auth-provider.tsx`
- Wraps with `SessionProvider` from NextAuth.
- Supplies session object to client components.

### MantineProviderWrapper

- File: `src/providers/mantine-provider.tsx`
- Configures theme, enables `ModalsProvider`, places `Notifications`.
- Uses `defaultColorScheme` & `forceColorScheme` set to `light`.

### QueryProvider

- File: `src/providers/query-provider.tsx`
- Sets `QueryClientProvider` with defaults: `staleTime: 60_000`, `retry: 1`.
- Includes `ReactQueryDevtools`.

### AccountIdProvider

- File: `src/providers/accountId-provider.tsx`
- Initializes account id via `useAccountIdInitializer`.
- Tracks session expiration using `issued` and `expiresIn` from `next-auth/react`.
- Shows a modal to log out user on expiry; public routes exempt.

## Patterns

- Wrap providers in `src/app/layout.tsx` for global availability.
- Keep API calls inside stores/providers minimal and idempotent.
- Persistence uses browser storage; always guard against SSR.