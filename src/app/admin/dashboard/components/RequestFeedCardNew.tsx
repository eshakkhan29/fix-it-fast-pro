'use client'
import { FollowUp } from '@/app/evaluator/actions/getFollowUpListByFilters'
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor'
import { getTimeAgoBadge } from '@/utils/getTimeAgoBadge'
import { Icon } from '@iconify/react'
import { Badge, Button, Card, Checkbox, Grid, Group, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import React from 'react'
import DeleteFollowUpModal from '../../incident-management/components/DeleteFollowUpModal'
import Link from 'next/link'
import { formatDatePart, formatTimePart } from '@/utils/formatDate'
import { useTranslations } from 'next-intl'

interface RequestFeedCardNewProps {
  followUp: FollowUp
  refetch?: () => void
  isChecked: boolean
  onCheckboxChange: (followUpId: number, isChecked: boolean) => void
  path?: string
  role?:string;
}

function RequestFeedCardNew({ followUp, refetch, isChecked, onCheckboxChange, path, role }: RequestFeedCardNewProps) {
  // const router = useRouter()
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const t = useTranslations('IncidentManagement')
  const tDashboard = useTranslations('Dashboard')

  const handleDeleteModalOpen = () => {
    openDelete()
  }

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation() // Prevent the card's onClick from firing
    onCheckboxChange(followUp?.FollowupId, event.currentTarget.checked)
  }

  const handleCheckboxClick = (event: React.MouseEvent<HTMLInputElement>) => {
    event.stopPropagation() // Additional safeguard for click events
  }

  return (
    <>
      <Card

        className={`${isChecked ? '!border-1 !border-[#007D37]' : ''
          } !relative bg-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:!bg-gray-50`}
        withBorder
        p={14}
        w="100%"
      >
        {/* ICONS at top right */}
        {/* <Group className="!absolute !top-0 !right-2" gap={5} pt={10}>
                    
                    
                    <Button variant="default"  onClick={(e) => {
                            e.stopPropagation() // Prevent card onClick from firing
                            handleDeleteModalOpen()
                        }}
                        c='red.6'>Delete</Button>
                        <Button c="primary" variant="default" onClick={() =>
                            router.push(`/operator/incident/${followUp?.FollowupId}`)
                        }>Details</Button>
                    
                </Group> */}
        <Grid>
          <Grid.Col span={role && role === 'operator' ? 0 : 1}>
            {
              role && role === 'operator' ? null : <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              onClick={handleCheckboxClick} // Added to catch click events
            />
            }
            
          </Grid.Col>
          {/* col 2 info */}
          <Grid.Col span={11}>
            <Group justify="space-between">
              <Group gap={10}>
                <Text fz={20} fw={500} c={'neutral.8'}>
                  {followUp?.Topic}
                </Text>
                <Text fw={400} c={'primary'}>
                  #{followUp?.FollowupId}
                </Text>
              </Group>
              <Group gap={5}>
                {role && role === 'operator'? null :
                <Button
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card onClick from firing
                    handleDeleteModalOpen();
                  }}
                  c="red.6"
                >
                  {t('actions.delete')}
                </Button>
                
                }
                
                <Button
                  c="primary"
                  variant="default"
                  component={Link}
                  href={path || '/'}
                >
                  {t('actions.details')}
                </Button>
              </Group>
            </Group>

            <Text fw={500} c={'neutral.8'}>
              {followUp?.Question}
            </Text>
            <Text c={'dimmed'}>
              {followUp?.Location?.split('-->').join(', ')}
            </Text>

            {/* info */}
            <Group gap={8} mt={18} dir="column">
              {/* Date Created */}
              <Group justify="space-between" w={'100%'}>
                <Text c={'dimmed'}>{t('labels.dateCreated')}</Text>
                <Group gap={6}>
                  <Text fw={500} c={'neutral.8'}>
                    {formatDatePart(followUp?.CreatedOn)}
                  </Text>
                  <Text fw={500} c={'dimmed'} size='sm'>
                    {formatTimePart(followUp?.CreatedOn)}
                  </Text>
                </Group>
              </Group>

              {/* Due Date */}
              <Group justify="space-between" w={'100%'}>
                <Text c={'dimmed'}>{t('labels.dueDate')}</Text>
                {getTimeAgoBadge(followUp?.DueDate)}
              </Group>

              {/* Status */}
              <Group justify="space-between" w={'100%'}>
                <Text c={'dimmed'}>{t('labels.status')}</Text>
                <Badge
                  variant="outline"
                  radius="xl"
                  leftSection={<Icon icon="oui:dot" />}
                  color={getFollowUpStatusColor(followUp?.Status)}
                >
                  {followUp?.Status === 'Closed'
                    ? tDashboard('status.resolved')
                    : followUp?.Status}
                </Badge>
              </Group>

              {/* operator */}
              <Group justify="space-between" w={'100%'}>
                <Text c={'dimmed'}>{t('labels.operator')}</Text>
                <Text fw={500} c={'dimmed'}>
                  {followUp?.AssignedTo ? followUp.AssignedTo : t('messages.notAssigned')}
                </Text>
              </Group>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        withCloseButton={false}
        padding={0}
        centered
      >
        {/* Modal content */}
        <DeleteFollowUpModal
          close={closeDelete}
          name={followUp?.Question}
          id={followUp?.FollowupId}
          refetch={refetch}
        />
      </Modal>
    </>
  );
}

export default RequestFeedCardNew