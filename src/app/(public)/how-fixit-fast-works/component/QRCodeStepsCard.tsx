import React from 'react';
import { Stack, Group, Text, Box, Divider, ActionIcon } from '@mantine/core';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

/**
 * Props for the QRCodeStepsCard component
 */
export interface QRCodeStepsCardProps {
  /** Custom steps to display instead of default ones */
  steps?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  /** Additional CSS class name */
  className?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
  /** Whether to show the divider at the bottom */
  showDivider?: boolean;
}



export const QRCodeStepsCard = ({
  showDivider = true,
}: QRCodeStepsCardProps) => {
  const t = useTranslations('howFifWork.steps');

  const steps = [
    {
      icon: 'f7:qrcode',
      title: t('findQRCode'),
      description: t('findQRCodeDescription'),
    },
    {
      icon: 'majesticons:camera',
      title: t('positionCamera'),
      description: t('positionCameraDescription'),
    },
    {
      icon: 'fluent:scan-dash-32-regular',
      title: t('scanCode'),
      description: t('scanCodeDescription'),
    },
    {
      icon: 'famicons:checkmark-done',
      title: t('submitRequest'),
      description: t('submitRequestDescription'),
    },
  ];

  return (
    <Box p={16}>
      <Stack gap={32}>
        {steps.map((step, index) => (
          <Group key={index} gap={16} align="flex-start">
            {/* Icon Container */}
            <ActionIcon radius={'100%'} size={24}>
              <Icon icon={step.icon} />
            </ActionIcon>

            {/* Content */}
            <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm" fz={{ base: 12, lg: 16 }} fw={600}>
                {step.title}
              </Text>
              <Text size="xs" fz={{ base: 12, lg: 16 }}>
                {step.description}
              </Text>
            </Stack>
          </Group>
        ))}

        {/* Divider */}
        {showDivider && <Divider hiddenFrom="lg" />}
      </Stack>
    </Box>
  );
};

export default QRCodeStepsCard;
