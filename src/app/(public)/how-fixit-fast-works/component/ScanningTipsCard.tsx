import React from 'react';
import { Card, Stack, Group, Text, Box, Divider, Flex } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { LightBulbIcon } from './icons';

/**
 * Props interface for the ScanningTipsCard component
 */
export interface ScanningTipsCardProps {
  /** Icon to display in the header */
  icon?: React.ReactNode;
  /** Title text for the card */
  title?: string;
  /** Description text below the title */
  description?: string;
  /** Array of tip strings to display */
  tips?: string[];
  /** Custom styling for the card */
  style?: React.CSSProperties;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Default tips for scanning QR codes
 */
const DEFAULT_TIPS = [
  'Ensure good lighting for better scanning accuracy',
  'Hold your device 6-12 inches away from the QR code',
  'Keep the camera steady until scanning is complete',
  'Clean your camera lens if scanning fails',
];

/**
 * ScanningTipsCard component - A reusable card component that displays scanning tips
 * with an icon, title, description, and a list of tips with checkmarks.
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export const ScanningTipsCard = ({

  title = 'Scanning Tips',
  description = 'Lorem ipsum dolor sit amet consectetur. Donec eu.',
  tips = DEFAULT_TIPS,

}: ScanningTipsCardProps) => {
  return (
    // <Card
    //   bd={2}
    //   shadow="sm"
    //   padding="md"
    //   radius="md"
    //   withBorder
    //   className={className}
    // >
    //   <Stack gap="xl">
    //     {/* Header Section */}
    //     <Stack
    // style={{
    //   background:
    //     'linear-gradient(180deg, rgba(0, 86, 36, 0.25) 0%, rgba(255, 255, 255, 0) 47%)',

    // }}
    //       gap="md"
    //     >
    //       <Group gap="md" align="flex-start">
    //         {/* Icon */}
    //         <LightBulbIcon width={42} height={42} fill="#37007D" />

    //         {/* Title and Description */}
    //         <Stack gap={4} style={{ flex: 1 }}>
    //           <Text
    //             size="xl"
    //             fw={600}
    //             c="var(--mantine-color-neutral-9)"
    //             style={{
    //               fontFamily: 'Inter, sans-serif',
    //               fontSize: '20px',
    //               lineHeight: 1.35,
    //             }}
    //           >
    //             {title}
    //           </Text>
    //           <Text
    //             size="sm"
    //             fw={500}
    //             c="var(--mantine-color-neutral-6)"
    //             style={{
    //               fontFamily: 'Inter, sans-serif',
    //               fontSize: '14px',
    //               lineHeight: 1.5,
    //               letterSpacing: '0.28px',
    //             }}
    //           >
    //             {description}
    //           </Text>
    //         </Stack>
    //       </Group>
    //     </Stack>

    //     {/* Divider */}
    //     <Divider color="var(--mantine-color-neutral-2)" />

    //     {/* Tips List */}
    //     <Stack gap="sm">
    //       {tips.map((tip, index) => (
    //         <Group key={index} gap="sm" align="flex-start">
    //           {/* Check Icon */}
    //           <Box
    //             style={{
    //               padding: 2,
    //               display: 'flex',
    //               alignItems: 'center',
    //               justifyContent: 'center',
    //               flexShrink: 0,
    //             }}
    //           >
    //             <IconCheck
    //               size={16}
    //               color="var(--mantine-color-secondary-5)"
    //               stroke={2}
    //             />
    //           </Box>

    //           {/* Tip Text */}
    //           <Text
    //             size="md"
    //             c="var(--mantine-color-neutral-6)"
    //             style={{
    //               fontFamily: 'SF Pro Display, sans-serif',
    //               fontSize: '16px',
    //               lineHeight: 1.5,
    //               flex: 1,
    //             }}
    //           >
    //             {tip}
    //           </Text>
    //         </Group>
    //       ))}
    //     </Stack>
    //   </Stack>
    // </Card>
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

          {/* Title and Description */}
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
              {/* Check Icon */}
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

              {/* Tip Text */}
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

export default ScanningTipsCard;
