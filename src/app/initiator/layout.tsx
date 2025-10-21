import React from 'react'
import { EvaluatorLayout } from '@/components/layout';

function InitiatorRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <EvaluatorLayout>{children}</EvaluatorLayout>
    )
}

export default InitiatorRootLayout