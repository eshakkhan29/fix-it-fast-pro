'use client';

import { useAccountIdStore } from '@/stores/user/accountId-store';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
    Button,
    Container,
    Paper,
    Stack,
    Text,
    Title,
    SimpleGrid,
    Group,
} from '@mantine/core';
import { IconUserCheck } from '@tabler/icons-react';
import React, { useEffect } from 'react';

function RoleSelectPage() {
    const { setRole } = useAccountIdStore();
    const router = useRouter();
    const { data: session }: any = useSession();
    const roles = session?.roles || [];

    const handleRoleSelect = (role: any) => {
        setRole(role);
        // Set cookies using js-cookie
        Cookies.set('fifRoleName', role?.Name, { path: '/', expires: 0.25 });
        Cookies.set('fifRoleId', role?.Id, { path: '/', expires: 0.25 });

        // Defer navigation
        setTimeout(() => {
            const redirectTo =
                role?.Name === 'Account Administrator'
                    ? '/admin'
                    : role?.Name === 'Evaluator'
                        ? '/evaluator'
                        : role?.Name === 'Operator'
                            ? '/operator'
                            : role?.Name === 'Initiator'
                                ? '/'
                                : '/';
            router.push(redirectTo);
        }, 0);
    };


    // if user only one role then select that role
    useEffect(() => {
        if (roles?.length === 1) {
            handleRoleSelect(roles[0]);
        }
    }, [roles]);


    return (
        <Container size="xs" mt={80}>
            <Paper shadow="md" radius="lg" p="xl" withBorder>
                <Stack align="center" >
                    <IconUserCheck size={50} stroke={1.5} color="#6AB64A" />
                    <Title order={2} ta="center">
                        Select Your Role
                    </Title>
                    <Text ta="center" c="dimmed">
                        Choose the role you want to continue with
                    </Text>

                    {roles.length > 0 ? (
                        <SimpleGrid cols={1} spacing="sm" mt="md">
                            {roles.map((role: any, index: number) => (
                                <Button
                                    key={index}
                                    radius="md"
                                    variant="filled"
                                    color="primary.2"
                                    fullWidth
                                    onClick={() => handleRoleSelect(role)}
                                    style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 500,
                                        fontSize: 16,
                                    }}
                                >
                                    {role?.Name}
                                </Button>
                            ))}
                            <Button
                                radius="md"
                                variant="filled"
                                color="error.2"
                                fullWidth
                                onClick={() => {
                                    // Clear role cookies
                                    Cookies.remove('fifRoleId', { path: '/' });
                                    Cookies.remove('fifRoleName', { path: '/' });

                                    // Sign out from NextAuth
                                    signOut({ redirect: false }).then(() => {
                                        router.replace('/login');
                                    });
                                }}
                                style={{
                                    textTransform: 'capitalize',
                                    fontWeight: 500,
                                    fontSize: 16,
                                }}
                            >
                                Logout
                            </Button>
                        </SimpleGrid>
                    ) : (
                        <Group justify="center" mt="xl">
                            <Text c="dimmed">No roles available for this user.</Text>
                        </Group>
                    )}
                </Stack>
            </Paper>
        </Container>
    );
}

export default RoleSelectPage;
