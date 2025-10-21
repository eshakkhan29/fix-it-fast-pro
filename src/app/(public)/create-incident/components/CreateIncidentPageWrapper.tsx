"use client"
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

function CreateIncidentPageWrapper({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const session = useSession();
    const accountId = searchParams.get('accountId');
    const campusId = searchParams.get('campusId');



    useEffect(() => {
        // If no campusId is provided and no session exists, redirect to login
        if (session?.status === "unauthenticated" && !campusId) {
            router.push('/login');
        } else if (campusId && accountId && session?.status === "unauthenticated") {
            signIn('credentials', {
                email: process.env.NEXT_PUBLIC_ANONIMUSUSER_EMAIL,
                password: process.env.NEXT_PUBLIC_ANONIMUSUSER_PASSWORD,
                redirect: false,
            });
        }
    }, [session, campusId, router, accountId]);



    return (
        <>
            {children}
        </>
    )
}

export default CreateIncidentPageWrapper