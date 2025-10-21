# Components & PWA

## Key Components

### QRScanner

- File: `src/components/QRScanner/index.tsx`
- Uses `@zxing/library` to scan from camera.
- Validates scanned URL against `BASE_URL`; navigates if valid.
- Includes UI for errors, retry control, and close button.

### LanguageSwitcher

- File: `src/components/LanguageSwitcher.tsx`
- Mantine `Menu` for selecting locale.
- Persists to `locale` cookie and refreshes the page.

### Layouts

- `PublicLayout`: top nav, background image, PWA install button.
- `EvaluatorLayout`: side navigation with mobile drawer and top nav.

## PWA

### Service Worker Registration

- File: `src/components/PWA/ServiceWorkerRegistration.tsx`
- Registers `public/sw.js` on load or when document is ready.

### Install Button

- File: `src/components/PWA/PWAInstallButton.tsx`
- Handles `beforeinstallprompt`, defers prompt, and hides on `appinstalled`.

### Manifest & SW

- `public/manifest.json` — PWA metadata, icons, and display mode.
- `public/sw.js` — basic offline caching and event listeners.

## Accessibility & UX Notes

- Ensure camera permissions are requested with clear UX copying.
- Provide fallbacks where webcams are not available.
- Keep install prompt unobtrusive and dismissible.