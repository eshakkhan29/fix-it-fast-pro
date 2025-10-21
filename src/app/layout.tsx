import { AuthProvider } from '@/providers/auth-provider';
import { MantineProviderWrapper } from '@/providers/mantine-provider';
import { QueryProvider } from '@/providers/query-provider';
import { ColorSchemeScript } from '@mantine/core';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import './global.css';
import AccountIdProvider from '@/providers/accountId-provider';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { NextIntlClientProvider } from 'next-intl';

export const dynamic = 'force-dynamic';

export const metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fix-It-Fast',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#003212',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions as any);
  return (
    <html lang="en" data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#003212" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#003212" />
        <meta name="apple-mobile-web-app-title" content="FixitFast" />
      </head>
      <body>
        <NextIntlClientProvider>
          <MantineProviderWrapper>
            <AuthProvider session={session}>
              <QueryProvider>
                <AccountIdProvider>{children}</AccountIdProvider>
                <ServiceWorkerRegistration />
              </QueryProvider>
            </AuthProvider>
          </MantineProviderWrapper>
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
