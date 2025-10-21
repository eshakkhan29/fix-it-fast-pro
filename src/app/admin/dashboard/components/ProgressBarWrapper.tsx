import { Group, Progress, Stack, Text } from '@mantine/core';
import React from 'react'

interface ProgressBarWrapperProps {
  color: string;
  title: string;
  completedValue: number;
  totalValue: number;
}
function ProgressBarWrapper({ color, title, completedValue, totalValue }: ProgressBarWrapperProps) {
  // Calculate percentage value for the progress bar
  const progressValue = totalValue > 0 ? (completedValue / totalValue) * 100 : 0;

  return (
    <Stack gap={5}>
      <Group justify='space-between'>
        <Text fw={600} fz={16}>{title}</Text>
        <Group gap={5}>
          <Text>{completedValue}</Text>
          <Text c='dimmed' size='xs'>{`(${Math.round(progressValue)}%)`}</Text>
        </Group>
      </Group>
      <Progress color={color} size="xl" value={progressValue} />
    </Stack>

  )
}

export default ProgressBarWrapper