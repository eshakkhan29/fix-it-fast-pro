'use client'
import { FollowUp } from '@/app/evaluator/actions/getFollowUpListByFilters'
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor'
import { Icon } from '@iconify/react'
import { ActionIcon, Badge, Button, Card, Divider, Flex, Grid, Group, Stack, Text } from '@mantine/core'
import { useRouter } from 'next/navigation'
import React from 'react'

interface RequestFeedCardProps {
  followUp: FollowUp;
}

const FollowUpHistoryCard = ({ followUp }: RequestFeedCardProps) => {
  const router = useRouter()

  return (
    <Card withBorder className={`!relative`} maw={650}>
      <Grid>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Flex >
            <Stack px={5}>
              {/* title, badge, location */}
              <Stack gap={5}>
                <Group wrap="nowrap">

                  <Text fw={600} fz={18} className="line-clamp-1">
                    {followUp?.Topic}
                  </Text>

                </Group>
                {/* badges */}

                <Group>
                  <Badge
                    variant="outline"
                    radius="xl"
                    leftSection={<Icon icon="oui:dot" />}
                    color={getFollowUpStatusColor(followUp?.Status)}
                  >
                    {followUp?.Status === 'Closed' ? "Resolved" : followUp?.Status}
                  </Badge>
                </Group>
                {/* location */}
                <Group align="start" gap={5} wrap='nowrap'>

                  <Text>{followUp?.Location?.split('-->').join(', ')}</Text>
                </Group>
              </Stack>


            </Stack>
            <Divider orientation="vertical" visibleFrom='lg' />
          </Flex>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack align="center" gap={5} >

            {/* ICONS at top right */}
            <Group className="!absolute !top-0 !right-0" gap={1}>
              <ActionIcon color="black" variant='transparent' onClick={() => router.push(`/initiator/initiate-history/${followUp?.FollowupId}`)}>
                <Icon icon="ion:scan" />
              </ActionIcon>
            </Group>


            <>
              <Icon
                icon="streamline-block:basic-ui-checkmark"
                className="text-5xl"
                color="#8ED2AC"
              />
              <Text c="dimmed">You created this incident</Text>
              <Button onClick={() => router.push(`/initiator/initiate-history/${followUp?.FollowupId}`)} size="sm" leftSection={<Icon icon="tabler:eye" />} my={10} >
                Incident Details
              </Button>
            </>

          </Stack>
        </Grid.Col>
      </Grid>



    </Card>
  );
}

export default FollowUpHistoryCard