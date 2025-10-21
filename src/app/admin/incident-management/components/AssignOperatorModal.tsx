import { Icon } from '@iconify/react';
import { ActionIcon, Button, Group, Select, Stack, Text } from '@mantine/core'
import React from 'react'

const AssignOperatorModal = ({close}: {close: () => void}) => {
  return (
    <Stack gap={30} >
        <Group justify='space-between' p={15} className='!border-b border-solid !border-gray-300'>
            <Text fw={500} fz={20}>Assign Operator</Text>
            <ActionIcon variant='default' radius="xl" onClick={close}>
                <Icon icon="material-symbols:close-rounded" />
            </ActionIcon>
        </Group>
      <Select
      mb={20}
      p={15}
        searchable
        leftSection={<Icon icon="material-symbols:search-rounded" />}
        label="Select an Operator"
        placeholder="Pick value"
        data={['Operator 1', 'Operator 2', 'Operator 3']}
      />
      
      <Group justify="end" p={15} className='!border-t border-solid !border-gray-300'>
        <Button variant="default">Cancel</Button>
        <Button>Assign</Button>
      </Group>
    </Stack>
  );
}

export default AssignOperatorModal