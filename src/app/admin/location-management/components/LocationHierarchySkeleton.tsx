import React from 'react';
import { Box, Group, Skeleton, Divider, ScrollArea, Stack, Paper } from '@mantine/core';

const LocationTreeNodeSkeleton = ({ depth = 0 }: { depth?: number }) => {
  const paddingLeft = depth * 24;
  
  return (
    <Box style={{ minWidth: 'max-content' }}>
      <Paper
        p="sm"
        withBorder
        style={{
          marginLeft: paddingLeft,
          marginBottom: 4,
          borderLeft: depth > 0 ? '3px solid var(--mantine-color-gray-3)' : undefined,
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm" wrap="nowrap">
            <Skeleton height={16} width={16} radius="sm" />
            <Skeleton height={16} width={28} />
            <Skeleton height={20} width={20} radius="sm" />
            <Stack gap={2}>
              <Skeleton height={14} width={120} />
              <Group gap="xs">
                <Skeleton height={12} width={50} radius="xl" />
                <Skeleton height={12} width={40} />
              </Group>
            </Stack>
          </Group>
          <Group gap="xs">
            <Skeleton height={24} width={24} radius="sm" />
            <Skeleton height={20} width={60} radius="xl" />
          </Group>
        </Group>
      </Paper>
    </Box>
  );
};

const LocationHierarchySkeleton = () => {
  return (
    <Box>
      <Group justify="space-between" p="md">
        <Group>
          <Skeleton height={24} width={24} />
          <Skeleton height={28} width={180} />
        </Group>
        <Group>
          <Skeleton height={32} width={100} radius="xl" />
        </Group>
      </Group>
      <Divider />
      <ScrollArea h={800} p="md">
        <Stack gap="xs">
          <LocationTreeNodeSkeleton depth={0} />
          <LocationTreeNodeSkeleton depth={1} />
          <LocationTreeNodeSkeleton depth={1} />
          <LocationTreeNodeSkeleton depth={2} />
          <LocationTreeNodeSkeleton depth={2} />
          <LocationTreeNodeSkeleton depth={0} />
          <LocationTreeNodeSkeleton depth={1} />
          <LocationTreeNodeSkeleton depth={2} />
        </Stack>
      </ScrollArea>
    </Box>
  );
};

export default LocationHierarchySkeleton;