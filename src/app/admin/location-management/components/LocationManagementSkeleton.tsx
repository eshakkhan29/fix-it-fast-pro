import { Stack, Group,  Card, Grid, Box, Divider, SimpleGrid, Skeleton } from '@mantine/core';

const LocationManagementSkeleton = () => {
  return (
    <div>
      <Stack gap="xl">
        {/* Header */}
        <Group
          justify="space-between"
          align="flex-start"
          className="sticky !top-[-10px] z-[100] backdrop-blur-md bg-white/80 py-4 px-4 mb-3"
        >
          <Stack gap="xs">
            <Skeleton height={32} width={200} />
            <Skeleton height={20} width={350} />
          </Stack>
          <Group>
            <Skeleton height={40} width={40} radius="md" />
            <Skeleton height={36} width={140} radius="md" />
          </Group>
        </Group>

        <Card withBorder m={{ base: 15, md: 25 }} p={0}>
          <Grid>
            {/* Left Column */}
            <Grid.Col span={{ base: 6, md: 7 }} p={0}>
              <Box className="border-r-1 border-gray-200 border-b-1 xl:border-b-0" h="100%">
                {/* Assignment Selection */}
                <Box p="md">
                  <Stack gap="md">
                    <Group justify="space-between" align="center">
                      <Group>
                        <Skeleton height={24} width={24} />
                        <Skeleton height={20} width={120} />
                      </Group>
                      <Skeleton height={36} width={200} radius="md" />
                    </Group>
                  </Stack>
                </Box>

                <Divider />

                {/* Location Types */}
                <Box p="xl">
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Group>
                        <Skeleton height={24} width={24} />
                        <Skeleton height={20} width={180} />
                      </Group>
                      <Skeleton height={28} width={60} radius="xl" />
                    </Group>

                    <Group gap="md">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} height={24} width={100} radius="xl" />
                      ))}
                    </Group>

                    <Skeleton height={16} width={300} />
                  </Stack>
                </Box>

                {/* Stats Cards */}
                <Stack p="xl">
                  <Group grow wrap="wrap" p={15}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Card key={index} withBorder shadow="sm" p="md" miw={130} radius="xl">
                        <Stack justify="end" gap={25}>
                          <Skeleton height={26} width={26} />
                          <Stack gap={2}>
                            <Skeleton height={12} width={60} />
                            <Skeleton height={24} width={40} />
                          </Stack>
                        </Stack>
                      </Card>
                    ))}
                  </Group>

                  {/* Action Buttons */}
                  <SimpleGrid cols={{ base: 2, md: 3 }} p={10}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} height={36} radius="md" />
                    ))}
                  </SimpleGrid>
                </Stack>
              </Box>
            </Grid.Col>

            {/* Right Column */}
            <Grid.Col span={{ base: 6, md: 5 }} p={0}>
              <Box>
                {/* Header */}
                <Group justify="space-between" p="md">
                  <Group>
                    <Skeleton height={24} width={24} />
                    <Skeleton height={24} width={150} />
                  </Group>
                  <Group>
                    <Skeleton height={28} width={80} radius="xl" />
                    <Skeleton height={32} width={120} radius="md" />
                    <Skeleton height={32} width={100} radius="md" />
                    <Skeleton height={28} width={60} radius="xl" />
                  </Group>
                </Group>
                <Divider />

                {/* Location Tree */}
                <Box p="md">
                  <Stack gap="xs">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Box key={index} style={{ marginLeft: (index % 3) * 24 }}>
                        <Skeleton height={60} width="100%" radius="md" mb={4} />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Grid.Col>
          </Grid>
        </Card>
      </Stack>
    </div>
  )
}

export default LocationManagementSkeleton