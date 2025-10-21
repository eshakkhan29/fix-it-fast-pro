# QR Scanner Component

A React component that provides QR code scanning functionality with base URL validation.

## Features

- **Camera Access**: Uses device camera to scan QR codes in real-time
- **Base URL Validation**: Only accepts QR codes that start with the configured base URL
- **Error Handling**: Provides user-friendly error messages for invalid QR codes or camera issues
- **Modal Interface**: Clean modal UI with scanning overlay and instructions
- **Responsive Design**: Works on both desktop and mobile devices

## Usage

```tsx
import { QRScanner } from '@/components/QRScanner';

function MyComponent() {
  const [scannerOpened, setScannerOpened] = useState(false);
  const baseUrl = 'https://example.com';

  return (
    <QRScanner
      opened={scannerOpened}
      onClose={() => setScannerOpened(false)}
      baseUrl={baseUrl}
    />
  );
}
```

## Props

- `opened: boolean` - Controls whether the scanner modal is open
- `onClose: () => void` - Callback function when the modal is closed
- `baseUrl: string` - The base URL that scanned QR codes must start with

## Dependencies

- `@zxing/library` - QR code scanning library
- `@mantine/core` - UI components
- `@tabler/icons-react` - Icons

## Browser Requirements

- Modern browser with camera access support
- HTTPS required for camera access in production
- User permission for camera access

## Security

The component validates that scanned QR codes start with the provided base URL to prevent navigation to unauthorized URLs.
