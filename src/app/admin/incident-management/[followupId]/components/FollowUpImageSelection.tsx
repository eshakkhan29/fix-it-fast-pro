import { Group, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import React from 'react'

const FollowUpImageSelection = ({ form }: { form: any }) => {
  return (
    <Dropzone
      onDrop={(files) => {
        // Append new files to existing images in form state
        form.setFieldValue('images', [...form.values.images, ...files]);
      }}
      maxSize={20 * 1024 ** 2} // 5MB
      accept={IMAGE_MIME_TYPE}
      multiple
      style={{
        border: '2px dashed #00A64C',
        borderRadius: '8px',
        backgroundColor: 'var(--mantine-color-gray-0)',

        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      styles={{
        root: {
          '&:hover': {
            borderColor: 'var(--mantine-color-blue-4)',
            backgroundColor: 'var(--mantine-color-blue-0)',
          },
        },
      }}
    >
      <Group
        justify="center"
        gap="md"
        mih={180}
        style={{ pointerEvents: 'none' }}
      >
        <Dropzone.Accept>
          <IconUpload
            style={{
              width: 48,
              height: 48,
              color: 'var(--mantine-color-blue-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            style={{
              width: 48,
              height: 48,
              color: 'var(--mantine-color-red-6)',
            }}
            stroke={1.5}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            style={{
              width: 48,
              height: 48,
              color: 'var(--mantine-color-gray-5)',
            }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div className="px-4 ">
          <Text fz={{ base: 14, sm: 16, md: 18 }} inline fw={500}>
            Drag images here or click to select files
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Attach multiple images, each file should not exceed 20MB
          </Text>
        </div>
      </Group>
    </Dropzone>
  )
}

export default FollowUpImageSelection