import React from 'react'
import { Card, Group, Skeleton, Stack } from '@mantine/core'

const LocationHeatMapItemSkeleton = () => {
  return (
    <Card withBorder style={{ borderLeft: '5px solid #e9ecef' }}>
      <Group justify="space-between">
        <Group>
          {/* Left section - Icon and text */}
          <Skeleton height={45} width={45} radius="100%" />
          <Stack gap={0}>
            <Skeleton height={18} width={80} />
            <Skeleton height={12} width={120} />
          </Stack>
        </Group>
        
        {/* Right section - Count and icon */}
        <Group gap={5}>
          <Skeleton height={18} width={30} />
          <Skeleton height={24} width={24} radius="sm" />
        </Group>
      </Group>
    </Card>
  )
}

const LocationHeatMapSkeleton = () => {
  return (
    <Stack gap={10}>
      {Array.from({ length: 5 }).map((_, index) => (
        <LocationHeatMapItemSkeleton key={index} />
      ))}
    </Stack>
  )
}

export default LocationHeatMapSkeleton