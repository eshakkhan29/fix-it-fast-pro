'use client'
import { Icon } from '@iconify/react'
import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import React, { useState } from 'react'
import QRCodeTemplate2 from '../../location-management/components/QRCodeTemplate2';
import QRTemplatesList from './QRTemplatesList';
import { useGetAllQRTemplates } from '../../hooks/QRTemplate/useGetQRTemplates';

const LocationTemplateContent = () => {
    const [isQRTemplateModalOpen, setIsQRTemplateModalOpen] = useState(false);
     const { data: qrCodeTemplates } = useGetAllQRTemplates();

  return (
   <Stack p={15}>
     <Group justify='space-between'>
            <Text fw={500} fz={{base:18, md:22}}>QR Code Templates</Text>
            <Button leftSection={<Icon icon="majesticons:plus"/>} onClick={() => setIsQRTemplateModalOpen(true)}>
            Create Template
            </Button>
     </Group>
    {/* list of templates */}
     <QRTemplatesList/>

     {/* modal */}
      <Modal
        opened={isQRTemplateModalOpen}
        onClose={() => setIsQRTemplateModalOpen(false)}
        size="xxl"
        centered
        closeOnClickOutside={true}
        withCloseButton={false}
        padding={0}
      >
        <QRCodeTemplate2
        qrCodeTemplates={qrCodeTemplates}
        isEdit={false}
          qrCodeUrl="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=sample"
          locationName="Sample Location"
          level="Campus"
          allowEditTitle={true}
          showControls={true}
          onDownload={() => {
            
            setIsQRTemplateModalOpen(false);
          }}
        />
      </Modal>
   </Stack>
  )
}

export default LocationTemplateContent