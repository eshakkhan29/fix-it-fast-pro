import React from 'react'
import { EvaluatorLayout } from '@/components/layout';

function OperatorRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <EvaluatorLayout>{children}</EvaluatorLayout>
    )
}

export default OperatorRootLayout
