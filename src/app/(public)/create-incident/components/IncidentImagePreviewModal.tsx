import { Icon } from '@iconify/react'
import { ActionIcon, Group, Image, Stack, Text } from '@mantine/core'
import React from 'react'
interface IncidentImagePreviewModalProps {
    selectedImage:string | null
    close:()=>void;
    blobUrls:{ [key: number]: string }
    setSelectedImage:(url: string) => void
}
const IncidentImagePreviewModal = ({selectedImage,close,blobUrls, setSelectedImage}: IncidentImagePreviewModalProps) => {
   
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
            Image Preview
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
        alt="Selected Image"
       
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
        {Object.values(blobUrls)?.map((url, index) => (
          <div
            key={index}
            style={{ position: 'relative' }}
            onClick={() => setSelectedImage(url || '')}
            className="cursor-pointer"
          >
            <Image
              className="!border-1 !border-primary-300 "
              src={url || ''}
              alt={`Uploaded image ${index + 1}`}
              w={70}
              h={70}
              radius="md"
              fit="cover"
            />
          </div>
        ))}
      </Group>
    </Stack>
    
  )
}

export default IncidentImagePreviewModal