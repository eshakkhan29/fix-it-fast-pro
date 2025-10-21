import React from 'react'
import { Card, Flex, Grid, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core'

const RequestFeedCardSkeleton = () => {
  return (
    <Card withBorder className='!relative' p={14} w="100%" miw={300}>
      {/* Action icon at top right */}
      <Group className="!absolute !top-0 !right-0" gap={1}>
        <Skeleton height={32} width={32} radius="md" />
      </Group>
      
      <Grid>
        <Grid.Col span={12}>
          {/* Topic and ID */}
          <Group gap={10}>
            <Skeleton height={20} width="70%" />
            <Skeleton height={16} width="20%" />
          </Group>
          
          {/* Question */}
          <Skeleton height={20} width="85%" mt={5} />
          
          {/* Location */}
          <Skeleton height={16} width="75%" mt={5} />
          
          {/* Info section */}
          <Stack gap={8} mt={18}>
            {/* Date Created */}
            <Group justify='space-between' w="100%">
              <Skeleton height={16} width={80} />
              <Group gap={6}>
                <Skeleton height={16} width={70} />
                <Skeleton height={16} width={50} />
              </Group>
            </Group>
            
            {/* Due Date */}
            <Group justify='space-between' w="100%">
              <Skeleton height={16} width={60} />
              <Skeleton height={20} width={80} radius="xl" />
            </Group>
            
            {/* Status */}
            <Group justify='space-between' w="100%">
              <Skeleton height={16} width={40} />
              <Skeleton height={24} width={90} radius="xl" />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

const IncidentManagementSkeleton = () => {
  return (
    <>
      {/* Header Section Skeleton */}
      <Group
        justify="space-between"
        className="sticky !top-[-10px] z-[100] backdrop-blur-md bg-white/80 py-3 px-4 mb-2"
      >
        <Skeleton height={24} width={200} />
        <Stack>
          <Flex
            w={{ base: '100%', md: 'auto' }}
            gap={5}
            justify={'space-between'}
            wrap="wrap"
            align="center"
          >
            <Skeleton height={36} width={120} mt={20} />
            <Stack>
              <Skeleton height={12} width={80} />
              <Skeleton height={28} width={100} />
            </Stack>
            <Skeleton height={36} width={80} mt={20} />
          </Flex>
          <Group></Group>
        </Stack>
      </Group>
      
      <Stack p={{ base: 15, md: 25 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {Array.from({ length: 10 }).map((_, index) => (
            <RequestFeedCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  )
}

export default IncidentManagementSkeleton