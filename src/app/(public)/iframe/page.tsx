'use client';

import Cookies from 'js-cookie';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import OnboardingAnimation from './components/OnboardingAnimation';
import { notifications } from '@mantine/notifications';

const decodeJWT = (token: string) => {
    try {
        const payload = token.split('.')[1]; // get payload part
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (err) {
        console.error('Invalid token', err);
        return null;
    }
};


export default function IframeReceiver() {
    const router = useRouter();
    const [credentials, setCredentialsData] = useState<{
        token: string,
        userRoleId: number,
        userRoleName: string,
    } | null>(null);
    const [email, setEmail] = useState<any>(null)
    const [userId, setUserId] = useState(null)
    const token = credentials?.token
    const iframeOrigin = "http://localhost:3001"



    useEffect(() => {
        // Tell parent we are ready
        window.parent.postMessage({ type: "FIF_CHILD_READY" }, iframeOrigin);

        // Handle messages from parent (port 3001)
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== iframeOrigin) return;

            if (event.data.type === "FIF_CREDENTIALS_DATA") {
                setCredentialsData(event.data.credentials);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // decoded token
    useEffect(() => {
        if (credentials) {
            const decoded = decodeJWT(credentials?.token);
            setEmail(decoded?.user)
            setUserId(decoded?.userId)
        }
    }, [credentials])

    // if token received, set in cookie
    useEffect(() => {
        const setLogin = async () => {
            const res = await signIn('iframe-jwt', { token, userId, email, redirect: false });
            if (res?.ok) {
                // Set cookies using js-cookie
                Cookies.set('fifRoleName', credentials?.userRoleName || '', { path: '/', expires: 0.25 });
                Cookies.set('fifRoleId', credentials?.userRoleId?.toString() || '', { path: '/', expires: 0.25 });

                // Defer navigation
                setTimeout(() => {
                    const redirectTo =
                        credentials?.userRoleName === 'Account Administrator'
                            ? '/admin'
                            : credentials?.userRoleName === 'Evaluator'
                                ? '/evaluator'
                                : credentials?.userRoleName === 'Operator'
                                    ? '/operator'
                                    : credentials?.userRoleName === 'Initiator'
                                        ? '/'
                                        : '/';
                    router.push(redirectTo);
                }, 0);
            } else {
                notifications.show({
                    title: 'Error',
                    message: 'Fix it fast onboarding failed please try again',
                    color: 'red',
                    autoClose: 3000,
                });
            }
        }
        if (credentials && token && email && userId) {
            setLogin()
        }
    }, [credentials, router, token, email, userId]);

    return (
        <OnboardingAnimation />
    );
}
