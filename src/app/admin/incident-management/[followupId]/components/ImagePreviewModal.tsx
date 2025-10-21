import { Icon } from '@iconify/react'
import { ActionIcon, Group, Image, Stack, Text } from '@mantine/core'
import React from 'react'
import { useTranslations } from 'next-intl';

interface ImagePreviewModalProps {
  selectedImage: string
 
  close: () => void
  mediaUrl: any
 setSelectedImage:(url: string) => void
}

const ImagePreviewModal = ({
  selectedImage,
  
  close,
  mediaUrl,
  setSelectedImage,
}: ImagePreviewModalProps ) => {
  const t = useTranslations('IncidentManagement');
  return (
    <Stack gap={30}>
      <Group
        justify="space-between"
        p={15}
        className="!border-b border-solid !border-gray-300"
      >
        <Group gap={5}>
          <Icon icon="bx:image-alt" className="text-4xl" />
          <Text fw={500} fz={20}>
            {t('modals.imagePreviewTitle')}
          </Text>
        </Group>

        <ActionIcon variant="default" radius="xl" onClick={close}>
          <Icon icon="material-symbols:close-rounded" />
        </ActionIcon>
      </Group>

      

      <Image
        mx="auto"
        // className="!border-1 !border-primary-300 "
        src={selectedImage}
        alt={t('labels.uploadImage')}
       
        w="80%"
        h={{ base: 300, md: 400 }}
        radius="md"
        fit="contain"
      />
      <Group
        justify="end"
        p={15}
        className="!border-t border-solid !border-gray-300"
      >
        {mediaUrl?.map((file: { URL: string }, index: number) => (
          <div
            key={index}
            style={{ position: 'relative' }}
            onClick={() => setSelectedImage(file?.URL || '')}
            className="cursor-pointer"
          >
            <Image
              className="!border-1 !border-primary-300 "
              src={file?.URL || ''}
              alt={`${t('labels.uploadImage')} ${index + 1}`}
              w={70}
              h={70}
              radius="md"
              fit="cover"
            />
          </div>
        ))}
      </Group>
    </Stack>
  );
}

export default ImagePreviewModal