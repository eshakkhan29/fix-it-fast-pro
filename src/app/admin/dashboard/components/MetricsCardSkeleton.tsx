import React from 'react'

import { Card, Group, Box, Skeleton, Grid } from '@mantine/core';

const MetricsCardSkeleton = () => {
  return (
    <Grid>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}>
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
              <Skeleton height={40} width={40} radius={10} />
              <Skeleton height={16} width={16} radius="sm" />
            </Group>

            <Group justify="space-between" align="end">
              <Box>
                <Skeleton height={14} width={60} mb={4} />
                <Skeleton height={18} width={40} />
              </Box>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default MetricsCardSkeleton