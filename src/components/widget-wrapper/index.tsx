'use client';

import { ReactNode } from 'react';
import { Card, Text, Box, Flex, Group, Divider } from '@mantine/core';

interface WidgetWrapperProps {
  bg?:string;
  title: string;
  primaryActionSection?: ReactNode;
  secondaryActionSection?: ReactNode;
  children: ReactNode;
}

export function WidgetWrapper({
  bg,
  title,
  primaryActionSection,
  secondaryActionSection,
  children,
}: Readonly<WidgetWrapperProps>) {
  return (
    <Card shadow="sm" radius="xl" withBorder p={0} h="100%">
      {/* Header section */}
      <Flex justify={'space-between'}  p={10}>
        <Text fw={600} fz={{base:16,sm:18,md:20}}>{title}</Text>
        <Group>
          {primaryActionSection}
          {secondaryActionSection}
        </Group>
      </Flex>
      <Divider />

      {/* Body content */}
      <Box p={15} bg={bg?bg:"white"}>{children}</Box>
    </Card>
  );
}
