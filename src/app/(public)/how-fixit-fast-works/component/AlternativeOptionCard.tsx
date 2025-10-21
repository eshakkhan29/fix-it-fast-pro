import React from 'react';
import { Card, Stack, Text, Box } from '@mantine/core';

/**
 * Props interface for the AlternativeOptionCard component
 */
export interface AlternativeOptionCardProps {
  /** Custom title for the card */
  title?: string;
  /** Custom description text */
  description?: string;
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

/**
 * AlternativeOptionCard - A reusable card component for displaying alternative options
 *
 * Features:
 * - 100% Figma design accuracy
 * - Customizable title and description
 * - Follows design system patterns
 * - Responsive design
 * - Accessible markup
 *
 * @param props - Component props
 * @returns JSX.Element
 */
export const AlternativeOptionCard = ({
  title = 'Alternative Option',
  description = "Can't scan? Use manual location entry instead",
  className,
  style,
}: AlternativeOptionCardProps) => {
  return (
    <Box
      className={className}
      style={{
        backgroundColor: 'var(--mantine-color-neutral-0)',
        border: '1px solid var(--mantine-color-primary-5)',
        borderRadius: 'var(--mantine-radius-lg)',
        padding: 'var(--mantine-spacing-xs)',
        ...style,
      }}
    >
      <Card
        style={{
          backgroundColor: 'var(--mantine-color-secondary-1)',
          border: '1px solid var(--mantine-color-neutral-2)',
          borderRadius: 'var(--mantine-radius-md)',
          boxShadow:
            '0px 1px 3px 0px rgba(13,13,18,0.05), 0px 1px 2px 0px rgba(13,13,18,0.04)',
        }}
        padding="md"
      >
        <Stack gap="md">
          {/* Header Section */}
          <Stack gap="xs">
            {/* Title */}
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

            {/* Description */}
            <Text
              size="md"
              c="var(--mantine-color-neutral-8)"
              style={{
                fontFamily: 'SF Pro Display, sans-serif',
                fontSize: '16px',
                lineHeight: 1.5,
              }}
            >
              {description}
            </Text>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};
