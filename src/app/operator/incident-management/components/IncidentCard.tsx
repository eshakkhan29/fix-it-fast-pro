import { FollowUp } from '@/app/evaluator/actions/getFollowUpListByFilters'
import { formatDatePart, formatTimePart } from '@/utils/formatDate'
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor'
import { getTimeAgoBadge } from '@/utils/getTimeAgoBadge'
import { Icon } from '@iconify/react'
import { Badge, Button, Card, Grid, Group, Text } from '@mantine/core'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

function IncidentCard({ followUp, path }: { followUp: FollowUp, path: string }) {
    const t = useTranslations('IncidentCard');

    return (
        <Card
            // onClick={() => router.push(`/operator/incident-management/${followUp?.FollowupId}`)}
            className="!relative cursor-pointer bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:!bg-gray-50 active:scale-100"
            withBorder
            p={14}
            w="100%"
        >
            {/* ICONS at top right */}
            <Group className="!absolute !top-2 !right-2" gap={1}>
                <Button
                    c="primary"
                    variant="default"
                    size='xs'
                    component={Link}
                    // href={`/operator/incident-management/${followUp?.FollowupId}`}
                    href={path || '/'}
                >
                    {t('actions.details')}
                </Button>
            </Group>
            <Grid>

                {/* col 2 info */}
                <Grid.Col span={12}>
                    <Group gap={10}>
                        <Text fw={500} c={"neutral.8"}>
                            {followUp?.Topic}
                        </Text>
                        <Text fw={400} c={"primary.2"}>
                            #{followUp?.FollowupId}
                        </Text>
                    </Group>
                    <Text fw={500} c={"neutral.8"}>
                        {followUp?.Question}
                    </Text>
                    <Text c={"dimmed"} >
                        {followUp?.Location?.split('-->').join(', ')}
                    </Text>

                    {/* info */}
                    <Group gap={8} mt={18} dir='column' >
                        {/* Date Created */}
                        <Group justify='space-between' w={"100%"} >
                            <Text c={"dimmed"}>
                                {t('labels.dateCreated')}
                            </Text>
                            <Group gap={6} >
                                <Text fw={500} c={"neutral.8"}>
                                    
                                    {formatDatePart(followUp?.CreatedOn)}
                                </Text>
                                <Text fw={500} c={"dimmed"} size='sm'>
                                    
                                    {formatTimePart(followUp?.CreatedOn)}
                                </Text>
                            </Group>
                        </Group>

                        {/* Due Date */}
                        <Group justify='space-between' w={"100%"}  >
                            <Text c={"dimmed"}>
                                {t('labels.dueDate')}
                            </Text>

                            {getTimeAgoBadge(followUp?.DueDate)}
                        </Group>

                        {/* Status */}
                        <Group justify='space-between' w={"100%"}>
                            <Text c={"dimmed"}>
                                {t('labels.status')}
                            </Text>
                            <Badge
                                variant="outline"
                                radius="xl"
                                leftSection={<Icon icon="oui:dot" />}
                                color={getFollowUpStatusColor(followUp?.Status)}
                            >
                                {followUp?.Status === 'Closed' ? t('status.resolved') : followUp?.Status}

                            </Badge>
                        </Group>
                    </Group>
                </Grid.Col>



            </Grid>

        </Card>
    )
}

export default IncidentCard