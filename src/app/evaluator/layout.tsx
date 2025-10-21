import { EvaluatorLayout } from '@/components/layout';
import React from 'react';

function EvaluatorRootLayout({ children }: { children: React.ReactNode }) {
  return <EvaluatorLayout>{children}</EvaluatorLayout>;
}

export default EvaluatorRootLayout;
