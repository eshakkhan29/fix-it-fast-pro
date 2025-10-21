import React from 'react';
import { Card, Stack, Group, Text, Box, Divider, Flex } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { LightBulbIcon } from './icons';

export interface TroubleshootingCardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  tips?: string[];
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_TROUBLESHOOTING_TIPS = [
  "If camera won't start, check browser permissions",
  'Try refreshing the page if scanning fails',
  'Use manual location entry if QR code is damaged',
  'Contact IT support for persistent issues',
];

export const TroubleshootingCard = ({

  title = 'Troubleshooting',
  description = 'Lorem ipsum dolor sit amet consectetur. Eget luctus.',
  tips = DEFAULT_TROUBLESHOOTING_TIPS,

}: TroubleshootingCardProps) => {
  return (
    <Box className="!border-1 rounded-xl !border-black" p={8}>
      <Card withBorder p={16} radius={12}>
        <Flex
          gap={8}
          py={16}
          align={'start'}
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 86, 36, 0.25) 0%, rgba(255, 255, 255, 0) 47%)',
            borderRadius: 'var(--mantine-radius-lg)',
            padding: '16px',
          }}
        >
          <LightBulbIcon width={42} height={42} fill="#37007D" />

          <Stack gap={4} style={{ flex: 1 }}>
            <Text
              size="xl"
              fw={600}
              c="var(--mantine-color-neutral-9)"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                lineHeight: 1.35,
              }}
            >
              {title}
            </Text>
            <Text
              size="sm"
              fw={500}
              c="var(--mantine-color-neutral-6)"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: 1.5,
                letterSpacing: '0.28px',
              }}
            >
              {description}
            </Text>
          </Stack>
        </Flex>
        <Divider my={24} color="var(--mantine-color-neutral-2)" />
        <Stack gap="sm">
          {tips.map((tip, index) => (
            <Group key={index} gap="sm" align="flex-start">
              <Box
                style={{
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <IconCheck
                  size={16}
                  color="var(--mantine-color-secondary-5)"
                  stroke={2}
                />
              </Box>

              <Text
                size="md"
                c="var(--mantine-color-neutral-6)"
                style={{
                  fontFamily: 'SF Pro Display, sans-serif',
                  fontSize: '16px',
                  lineHeight: 1.5,
                  flex: 1,
                }}
              >
                {tip}
              </Text>
            </Group>
          ))}
        </Stack>
      </Card>
    </Box>
  );
};

export default TroubleshootingCard;