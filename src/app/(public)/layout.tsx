import { PublicLayout } from '@/components/layout';
import React from 'react';

function PublicRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PublicLayout>{children}</PublicLayout>;
}

export default PublicRootLayout;
