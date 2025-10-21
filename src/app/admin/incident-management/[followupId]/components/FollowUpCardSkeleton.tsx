import React from 'react'
import { Grid, Group, Paper, Skeleton, Stack } from '@mantine/core'

const FollowUpCardSkeleton = () => {
  return (
    <Stack gap={10}>
      {/* Header Section */}
      <Group justify="space-between">
        <Group gap={10} align="start">
          <Skeleton height={45} width={45} radius="sm" mt={5} />
          <Stack gap={2}>
            <Group gap={5} align="center">
              <Skeleton height={24} width={200} />
              <Skeleton height={20} width={60} />
            </Group>
            <Skeleton height={16} width={300} />
            <Skeleton height={14} width={250} />
          </Stack>
        </Group>
        <Group justify="end">
          <Skeleton height={36} width={70} radius="sm" />
          <Skeleton height={36} width={80} radius="sm" />
        </Group>
      </Group>

      {/* Grid Layout */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            {/* Details Paper */}
            <Paper p={15} bg="var(--mantine-color-gray-0)">
              <Stack>
                <Group justify="space-between">
                  <Skeleton height={20} width={60} />
                  <Skeleton height={32} width={32} radius="sm" />
                </Group>
                <Skeleton height={16} width="90%" />
                
                {/* Details Items */}
                <Group justify="space-between">
                  <Skeleton height={14} width={80} />
                  <Skeleton height={14} width={120} />
                </Group>
                <Group justify="space-between">
                  <Skeleton height={14} width={60} />
                  <Skeleton height={14} width={100} />
                </Group>
                <Group justify="space-between">
                  <Skeleton height={14} width={50} />
                  <Skeleton height={24} width={80} radius="xl" />
                </Group>
                <Group justify="space-between">
                  <Skeleton height={14} width={70} />
                  <Skeleton height={14} width={90} />
                </Group>
                <Group justify="space-between">
                  <Skeleton height={14} width={70} />
                  <Skeleton height={14} width={90} />
                </Group>
              </Stack>
            </Paper>

            {/* Media Paper */}
            <Paper p={15} bg="var(--mantine-color-gray-0)">
              <Stack>
                <Group justify="space-between">
                  <Stack gap={5}>
                    <Skeleton height={18} width={60} />
                    <Skeleton height={14} width={100} />
                  </Stack>
                  <Skeleton height={36} width={80} radius="sm" />
                </Group>
                <Group gap="md">
                  <Skeleton height={100} width={100} radius="md" />
                  <Skeleton height={100} width={100} radius="md" />
                  <Skeleton height={100} width={100} radius="md" />
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack>
            {/* Comments Paper */}
            <Paper p={15} bg="var(--mantine-color-gray-0)">
              <Stack>
                <Skeleton height={16} width={80} />
                <Skeleton height={120} width="100%" radius="sm" />
              </Stack>
            </Paper>

            {/* Activity Paper */}
            <Paper p={15} bg="var(--mantine-color-gray-0)">
              <Stack gap={8}>
                <Skeleton height={20} width={100} />
                <Skeleton height={80} width="100%" radius="sm" />
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  )
}

export default FollowUpCardSkeleton