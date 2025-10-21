import { Icon } from '@iconify/react'
import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core'
import React from 'react'
import { useTranslations } from 'next-intl'

interface UnsavedChangesModalProps {
    onKeepEditing:()=>void;
    onCloseWithoutSaving:()=>void;
   

}

const UnsavedChangesModal = ({onKeepEditing, onCloseWithoutSaving}:UnsavedChangesModalProps) => {
  const t = useTranslations('IncidentManagement');
  return (
    <Stack gap={30}>
      <Group justify="space-between" p={15} className="!border-b border-solid !border-gray-300">
        <Group gap={5}>
                <Icon icon="jam:triangle-danger" className='text-xl' color="#DF1C41"/>
                 <Text fw={500} fz={20} c="#DF1C41">{t('modals.unsavedChangesTitle')}</Text>
        </Group>
       
        <ActionIcon variant="default" radius="xl" onClick={onKeepEditing}>
          <Icon icon="material-symbols:close-rounded" />
        </ActionIcon>
      </Group>

      <Stack p={15} >
        
        
           <Text size='lg'>{t('messages.unsavedChangesDescription')}</Text>
   
      </Stack>

      <Group justify="end" p={15} className="!border-t border-solid !border-gray-300">
        <Button variant="default" onClick={onCloseWithoutSaving}>
          {t('actions.closeWithoutSaving')}
        </Button>
        <Button color="#DF1C41" onClick={onKeepEditing} >
          {t('actions.keepEditing')}
        </Button>
      </Group>
    </Stack>
  )
}

export default UnsavedChangesModal