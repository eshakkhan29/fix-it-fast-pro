'use client';

import { theme } from '@/lib/theme';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/carousel/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.layer.css';

interface MantineProviderProps {
  children: React.ReactNode;
}

export function MantineProviderWrapper({ children }: MantineProviderProps) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="light"
      forceColorScheme="light"
    >
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
