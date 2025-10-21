# Troubleshooting

## Authentication

- Symptom: Sign-in succeeds but session shows empty fields.
  - Check `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set.
  - Verify `jwt` and `session` callbacks copy fields correctly in `authOptions`.
  - Ensure provider returns `AuthenticatedUser` with required fields.

- Symptom: Frequent logouts or immediate expiry.
  - Confirm `issued` and `expiresIn` are in seconds and computed correctly.
  - Inspect `AccountIdProvider` expiry modal logic; exclude public routes.

- Symptom: 401s from API despite valid login.
  - Check axios request interceptor attaches `Authorization` correctly.
  - Confirm upstream API accepts Bearer tokens from NextAuth provider.

## Routing

- Symptom: Infinite redirect between `/role-select` and role home.
  - Clear cookies `fifRoleId` and `fifRoleName` and sign in again.
  - Validate middleware role resolution order and edge cases.

- Symptom: Access denied for expected role.
  - Verify `roles` array in session has required role names.
  - Inspect middleware constraints for group access.

## i18n

- Symptom: Text shows keys instead of translations.
  - Ensure `messages/<locale>.json` has the keys.
  - Check `NextIntlClientProvider` receives messages via request config.

## PWA

- Symptom: Install button never shows.
  - Confirm `manifest.json` is valid and served.
  - Check `beforeinstallprompt` and `appinstalled` events fire.

- Symptom: Service worker not registered.
  - Ensure `ServiceWorkerRegistration` is mounted in root layout.
  - Check for `navigator.serviceWorker` support and secure context (https or localhost).

## Build & Dev

- Symptom: SVG import errors.
  - Confirm `@svgr/webpack` configured in `next.config.mjs`.

- Symptom: Tailwind classes not applied.
  - Validate `postcss.config.js` and global CSS inclusion.

## Debugging Tips

- Use React Query DevTools to inspect queries and cache.
- Log `session` and `token` from callbacks during development.
- Leverage browser devtools for network and storage (cookies/localStorage).