'use client'
import React from 'react'
import { Box, Flex, Grid, Group, Paper, Skeleton, Stack } from '@mantine/core'

const InitiateHistorySkeleton = () => {
  return (
    <Box p={40}>
      {/* Header */}
      <Flex align="center" justify="space-between">
        <Skeleton height={32} width={150} />
        <Group align="center">
          <Skeleton height={36} width={36} radius="sm" />
          <Skeleton height={36} width={120} radius="sm" />
        </Group>
      </Flex>

      {/* Past Records Section */}
      <Paper mt={20}>
        <Box p={20}>
          <Flex align="center" justify="space-between">
            <Skeleton height={24} width={120} />
            <Group align="center" gap={8}>
              <Stack gap={5}>
                <Skeleton height={16} width={80} />
                <Skeleton height={36} width={200} radius="lg" />
              </Stack>
            </Group>
          </Flex>
        </Box>
        
        {/* Table Skeleton */}
        <Stack gap={0}>
          {/* Table Header */}
          <Grid p={10} style={{ borderBottom: '1px solid #e9ecef' }}>
            <Grid.Col span={1.5}><Skeleton height={16} width={80} /></Grid.Col>
            <Grid.Col span={1.5}><Skeleton height={16} width={90} /></Grid.Col>
            <Grid.Col span={2}><Skeleton height={16} width={70} /></Grid.Col>
            <Grid.Col span={1.5}><Skeleton height={16} width={60} /></Grid.Col>
            <Grid.Col span={1.5}><Skeleton height={16} width={80} /></Grid.Col>
            <Grid.Col span={1.5}><Skeleton height={16} width={70} /></Grid.Col>
            <Grid.Col span={1.5}><Skeleton height={16} width={60} /></Grid.Col>
            <Grid.Col span={1}><Skeleton height={16} width={60} /></Grid.Col>
          </Grid>
          
          {/* Table Body */}
          {Array.from({ length: 10 }).map((_, index) => (
            <Grid key={index} p={10} style={{ borderBottom: '1px solid #f1f3f4' }}>
              <Grid.Col span={1.5}><Skeleton height={16} width={60} /></Grid.Col>
              <Grid.Col span={1.5}><Skeleton height={16} width={70} /></Grid.Col>
              <Grid.Col span={2}><Skeleton height={16} width={150} /></Grid.Col>
              <Grid.Col span={1.5}><Skeleton height={16} width={100} /></Grid.Col>
              <Grid.Col span={1.5}><Skeleton height={16} width={80} /></Grid.Col>
              <Grid.Col span={1.5}><Skeleton height={16} width={80} /></Grid.Col>
              <Grid.Col span={1.5}><Skeleton height={24} width={80} radius="xl" /></Grid.Col>
              <Grid.Col span={1}><Skeleton height={32} width={70} radius="sm" /></Grid.Col>
            </Grid>
          ))}
        </Stack>
        
        {/* Pagination Skeleton */}
        <Group justify="space-between" p={20}>
          <Skeleton height={16} width={200} />
          <Group>
            <Skeleton height={32} width={32} radius="sm" />
            <Skeleton height={32} width={32} radius="sm" />
            <Skeleton height={32} width={32} radius="sm" />
          </Group>
        </Group>
      </Paper>
    </Box>
  )
}

export default InitiateHistorySkeleton