import React from 'react'
import { Group, Skeleton, Stack } from '@mantine/core'

const StatusModalSkeleton = () => {
  return (
    <Stack>
      <Skeleton height={24} width={120} />
      
      <Stack gap={5}>
        <Skeleton height={16} width={100} />
        <Skeleton height={36} width="100%" radius="sm" />
      </Stack>

      <Group justify="end">
        <Skeleton height={36} width={70} radius="sm" />
        <Skeleton height={36} width={80} radius="sm" />
      </Group>
    </Stack>
  )
}

export default StatusModalSkeleton