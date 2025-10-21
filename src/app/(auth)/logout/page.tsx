'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Loader, Text, Paper } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logoutProcess = async () => {
            // Small delay to show animation
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Clear cookies
            Cookies.remove('fifRoleId', { path: '/' });
            Cookies.remove('fifRoleName', { path: '/' });

            // Sign out
            await signOut({ redirect: false });

            // Redirect
            router.replace('/');
        };

        logoutProcess();
    }, [router]);

    return (
        <Paper
            shadow="md"
            radius="lg"
            className="!flex !flex-col !items-center !justify-center p-8 transition-all duration-500 hover:scale-105"
        >
            <div className="animate-bounce">
                <IconLogout size={60} stroke={1.5} color="red" />
            </div>

            <Text size="lg" fw={600} c="red" className="mt-4">
                Logging you out...
            </Text>

            <Loader color="red" size="md" className="mt-3" />

            <Text size="sm" c="gray.6" className="mt-2">
                Please wait a moment
            </Text>
        </Paper>
    );
}
