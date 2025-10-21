import React from 'react'
import { Card, Grid, Group, Skeleton, Stack } from '@mantine/core'

const RequestFeedCardSkeleton = () => {
  return (
    <Card withBorder p={14} w="100%" className='!relative'>
      {/* Top right action icons */}
      <Group className="!absolute !top-0 !right-0" gap={1}>
        <Skeleton height={32} width={32} radius="sm" />
        <Skeleton height={32} width={32} radius="sm" />
      </Group>
      
      <Grid>
        <Grid.Col span={0.7}>
          <Skeleton height={16} width={16} radius="sm" />
        </Grid.Col>
        
        <Grid.Col span={11.3}>
          {/* Title and ID */}
          <Group gap={10}>
            <Skeleton height={20} width={120} />
            <Skeleton height={16} width={60} />
          </Group>
          
          {/* Question */}
          <Skeleton height={20} width={200} mt={5} />
          
          {/* Location */}
          <Skeleton height={16} width={180} mt={5} />
          
          {/* Info section */}
          <Stack gap={8} mt={18}>
            {/* Date Created */}
            <Group justify="space-between" w="100%">
              <Skeleton height={16} width={80} />
              <Group gap={6}>
                <Skeleton height={16} width={80} />
                <Skeleton height={16} width={60} />
              </Group>
            </Group>
            
            {/* Due Date */}
            <Group justify="space-between" w="100%">
              <Skeleton height={16} width={60} />
              <Skeleton height={24} width={80} radius="xl" />
            </Group>
            
            {/* Status */}
            <Group justify="space-between" w="100%">
              <Skeleton height={16} width={50} />
              <Skeleton height={24} width={90} radius="xl" />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

const RealTimeSkeleton = () => {
  return (
    <Stack p={25}>
      {Array.from({ length: 5 }).map((_, index) => (
        <RequestFeedCardSkeleton key={index} />
      ))}
    </Stack>
  )
}

export default RealTimeSkeleton