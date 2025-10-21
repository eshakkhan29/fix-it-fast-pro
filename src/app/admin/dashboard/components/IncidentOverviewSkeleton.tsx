import { Card,  Box, Flex, Group, Divider, Stack, Skeleton } from '@mantine/core';

const IncidentOverviewSkeleton = () => {
  return (
    <Card shadow="sm" radius="xl" withBorder p={0} h="100%">
      {/* Header section */}
      <Flex justify={'space-between'} p={10}>
        <Skeleton height={20} width={180} />
        <Skeleton height={36} width={120} radius="sm" />
      </Flex>
      <Divider />

      {/* Body content */}
      <Box p={15}>
        <Stack>
          {Array.from({ length: 4 }).map((_, index) => (
            <Stack gap={5} key={index}>
              <Group justify='space-between'>
                <Skeleton height={16} width={80} />
                <Group gap={5}>
                  <Skeleton height={16} width={20} />
                  <Skeleton height={12} width={40} />
                </Group>
              </Group>
              <Skeleton height={24} radius="xl" />
            </Stack>
          ))}
        </Stack>
      </Box>
    </Card>
  )
}

export default IncidentOverviewSkeleton