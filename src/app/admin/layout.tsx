import { EvaluatorLayout } from '@/components/layout';
import React from 'react';

function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <EvaluatorLayout>{children}</EvaluatorLayout>;
}

export default AdminRootLayout;
