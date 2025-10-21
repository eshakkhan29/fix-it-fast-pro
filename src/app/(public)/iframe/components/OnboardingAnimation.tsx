'use client';

import { useEffect, useState } from 'react';
import { Loader, Text, Center, Stack, Transition, Box } from '@mantine/core';

export default function OnboardingAnimation() {
    const [show, setShow] = useState(false);

    // Fade in animation
    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Center style={{ height: '80vh' }}>
            <Transition mounted={show} transition="fade" duration={600} timingFunction="ease">
                {(styles) => (
                    <Box style={styles}>
                        <Stack align="center" gap={"md"}>
                            <Text size="xl" fw={600}>
                                Welcome to Fix-It Fast!
                            </Text>
                            <Text size="md" color="dimmed">
                                Token set in cookie and router refreshed. Redirecting to home

                            </Text>
                            <Loader size="lg" variant="dots" />
                        </Stack>
                    </Box>
                )}
            </Transition>
        </Center>
    );
}
