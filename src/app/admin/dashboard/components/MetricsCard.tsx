"use client"

import React from 'react';
import { Card, Group, Text, Badge, Box, ActionIcon } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';
import { Icon } from '@iconify/react';

export interface MetricsCardProps {
  title: string;
  value: string | number;
  iconColor?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  icon?: string;
  showInfo?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  trend,
  iconColor,
  icon,
  showInfo = true,
}) => {
  return (
    <Card
      shadow="xs"
      padding="md"
      radius="xl"
      withBorder
      style={{
        borderColor: 'var(--mantine-color-neutral-3)',
        backgroundColor: 'var(--mantine-color-neutral-0)',
      }}
    >
      <Group justify="space-between" mb="md">
        <Box
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: 'var(--mantine-color-neutral-0)',
            border: '1px solid var(--mantine-color-neutral-3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon && <Icon icon={icon} width={20} height={20} color={iconColor} />}
        </Box>

        {showInfo && (
          <ActionIcon variant="transparent" size="sm" color="neutral.7">
            <Icon icon="mdi:dots-horizontal" width={16} height={16} />
          </ActionIcon>
        )}
      </Group>

      <Group justify="space-between" align="end">
        <Box>
          <Text
            size="sm"
            c="neutral.7"
            fw={400}
            style={{ letterSpacing: '0.28px' }}
          >
            {title}
          </Text>
          <Text
            size="lg"
            fw={700}
            c="neutral.9"
            style={{
              fontSize: '18px',
              lineHeight: 1.4,
              letterSpacing: '0.36px',
            }}
          >
            {value}
          </Text>
        </Box>

        {trend && (
          <Badge
            variant="light"
            color={trend.direction === 'up' ? 'success' : 'error'}
            size="sm"
            radius="xs"
            leftSection={
              <IconTrendingUp
                size={14}
                style={{
                  color:
                    trend.direction === 'up'
                      ? 'var(--mantine-color-success-3)'
                      : 'var(--mantine-color-error-3)',
                  transform:
                    trend.direction === 'down' ? 'rotate(180deg)' : 'none',
                }}
              />
            }
            style={{
              backgroundColor:
                trend.direction === 'up'
                  ? 'var(--mantine-color-success-0)'
                  : 'var(--mantine-color-error-0)',
              border: `1px solid ${trend.direction === 'up'
                ? 'var(--mantine-color-success-3)'
                : 'var(--mantine-color-error-3)'
                }`,
              color:
                trend.direction === 'up'
                  ? 'var(--mantine-color-success-3)'
                  : 'var(--mantine-color-error-3)',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.24px',
              paddingLeft: '4px',
              paddingRight: '6px',
            }}
          >
            {trend.value}
          </Badge>
        )}
      </Group>
    </Card>
  );
};

export default MetricsCard;
