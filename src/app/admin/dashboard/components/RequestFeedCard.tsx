'use client'
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor'
// import { getTimeAgo } from '@/utils/getTimeAgo'

import { Icon } from '@iconify/react'
import { ActionIcon, Badge, Button, Card, Checkbox, Divider, Flex, Grid, Group, Modal, Stack, Text } from '@mantine/core'
import React from 'react'

import { useDisclosure } from '@mantine/hooks'

import DeleteFollowUpModal from '../../incident-management/components/DeleteFollowUpModal'
import Link from 'next/link'
import { FollowUp } from '../../actions/getFollowUpListByFilters'

interface RequestFeedCardProps {
  followUp: FollowUp;
  isChecked: boolean;
  onCheckboxChange: (followUpId: number, isChecked: boolean) => void;
  refetch?: () => void;
}

const RequestFeedCard = ({followUp, isChecked, onCheckboxChange, refetch}: RequestFeedCardProps) => {
  
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(followUp?.FollowupId, event.currentTarget.checked);
  };

  return (
    <Card withBorder className={` ${isChecked ? '!border-1 !border-[#007D37]' : ''} !relative`} maw={650}>
      <Grid>
        <Grid.Col span={{base:12, lg:7}}>
          <Flex >
            <Stack px={5}>
              {/* title, badge, location */}
              <Stack gap={5}>
                <Group wrap="nowrap">
                   <Checkbox
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                  <Text fw={600} fz={18} className="line-clamp-1">
                   {followUp?.Topic}
                  </Text>
                  {/* <Group gap={5}>
                    <Icon
                      icon="majesticons:clock-line"
                      className="text-gray-400"
                    />
                    <Text c="dimmed">{getTimeAgo(followUp?.CreateDate)}</Text>
                  </Group> */}
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
                  
                 <Text c='dimmed' fz={{base:16, md:14}}>{followUp?.Location?.split('-->').join(', ')}</Text>
                </Group>
              </Stack>

             {/*  Queation*/}
              <Group gap={2}>
                <Text fw={500} fz={16} c="primary">Question:</Text>
                <Text fz={14}>{followUp?.Question}</Text>
              </Group>

              
              
              
              
            </Stack>
            <Divider orientation="vertical" visibleFrom='lg' />
          </Flex>
        </Grid.Col>
        <Grid.Col span={{base:12, lg:5}}>
          <Stack align="center" gap={5} >

       {/* ICONS at top right */}
            <Group  className="!absolute !top-0 !right-0" gap={1}>
                  <ActionIcon color="black" variant='transparent' onClick={openDelete} >
                    <Icon icon="mage:trash" color='red'/>
                </ActionIcon>
                 <ActionIcon color="black" variant='transparent' >
                    <Icon icon="ion:scan" />
                </ActionIcon>
            </Group>
           
                
                
            
            {/* {
                followUp.operator ?
                <Stack align='start'>
                  <Group gap={5}>
                        <Avatar c='red' size='lg' src={''} />
                        <Stack gap={0}>
                            <Text fw={500} fz={18}>{followUp.operator.name}</Text>
                            <Text size='sm' c="dimmed">operator</Text>
                        </Stack>
                    </Group>
                   <Button size="lg" leftSection={<Icon icon="tabler:eye" />}>
                    View Details
            </Button>
                </Stack> 
                :(
                    <>
                   
                    <Icon
              icon="streamline-block:basic-ui-add-user"
              className="text-5xl"
              color="#8ED2AC"
            />
            <Text c="dimmed">Operator has not been assigned</Text>
            <Button size="lg" leftSection={<Icon icon="ic:round-plus" />} my={10}>
              Assign Operator
            </Button>
                    </>
                    
                ) 

            } */}
            <>
                   
              <Icon
              icon="streamline-block:basic-ui-add-user"
              className="text-5xl"
              color="#8ED2AC"
            />
            <Text c="dimmed">Operator has not been assigned</Text>
            <Button size="md" leftSection={<Icon icon="ic:round-plus" />} my={10} component={Link} href={`/evaluator/incident-management/${followUp?.FollowupId}`}>
              Assign Operator
            </Button>
                    </>
           
          </Stack>
        </Grid.Col>
      </Grid>
      {/* Assign modal */}
      

      {/*Delete Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} withCloseButton={false} padding={0} centered>
        {/* Modal content */}
        <DeleteFollowUpModal  close={closeDelete} name={followUp?.Question} id={followUp?.FollowupId} refetch={refetch} />
      
      </Modal>
    </Card>
  );
}

export default RequestFeedCard