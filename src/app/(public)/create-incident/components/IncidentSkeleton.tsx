import { Card, Divider, Group, Skeleton, Stack } from '@mantine/core';
import React from 'react';

const IncidentSkeleton = () => {
  return (
    <Card withBorder maw={600} radius="md">
      <Stack>
        {/* Header */}
        <Group justify="space-between" align="center">
          <Skeleton height={28} width={180} />
          <Skeleton height={24} width={100} radius="xl" />
        </Group>

        <Divider />

        {/* Location Selection Rows */}
        <Group justify="space-between">
          <Skeleton height={36} width={280} />
          <Skeleton height={36} width={280} />
        </Group>

        <Group justify="space-between">
          <Skeleton height={36} width={280} />
          <Skeleton height={36} width={280} />
        </Group>

        <Group justify="space-between">
          <Skeleton height={36} width={280} />
          <Skeleton height={36} width={280} />
        </Group>

        <Divider />

        {/* Topics */}
        <Skeleton height={36} />

        {/* Question */}
        <Skeleton height={36} />

        {/* Topic Question Card */}
        <Skeleton height={120} />

        {/* Description */}
        <Skeleton height={80} />

        {/* Image Upload */}
        <Skeleton height={100} />

        {/* Notification Section */}
        <Skeleton height={60} />

        {/* Buttons */}
        <Group w="100%" justify="flex-end">
          <Skeleton height={36} width={130} />
          <Skeleton height={36} width={110} />
        </Group>
      </Stack>
    </Card>
  );
};

export default IncidentSkeleton;