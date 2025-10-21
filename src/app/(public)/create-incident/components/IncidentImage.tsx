import { useAccountIdStore } from '@/stores/user/accountId-store';
import {
  Box,
  Button,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { uploadImage } from '../action/uploadImage';
import { fileToBase64, getBlobType } from '../utils/fileUtils';
import { Icon } from '@iconify/react';
import { useDisclosure } from '@mantine/hooks';
import IncidentImagePreviewModal from './IncidentImagePreviewModal';
import { notifications } from '@mantine/notifications';
import { convertImageToJpeg } from '@/utils/convertImageToJpeg';
import { useTranslations } from 'next-intl';

function IncidentImage({ form }: { form: any }) {
  const { userAccountId } = useAccountIdStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [blobUrls, setBlobUrls] = useState<{ [key: number]: string }>({});
  const t = useTranslations('IncidentForm.incidentImage');

  // Create and manage blob URLs
  useEffect(() => {
    const urls: { [key: number]: string } = {};

    form.values.images?.forEach((item: any, index: number) => {
      if (item instanceof File) {
        urls[index] = URL.createObjectURL(item);
      }
    });

    setBlobUrls(urls);

    // Cleanup function
    return () => {
      Object.values(urls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [form.values.images]);

  // handle modal open
  const handleModalOpen = (imgUrl: string) => {
    setSelectedImage(imgUrl);
    open();
  };

  // handle image upload with blob
  const handleImageUpload = async (file: File) => {
    if (!file || !userAccountId) {
      return;
    }

    const fileName = `fix_if_fast_${Math.random().toString(36).substring(2)}_${
      file.name
    }`;

    try {
      const blobValue = await fileToBase64(file);
      const blobType = getBlobType(file);

      const res = await uploadImage({
        accountId: parseInt(userAccountId),
        blobName: fileName,
        blobValue,
        blobType,
      });
     

      if (res.success) {
        form.setFieldValue('incidentImages', [
          ...(form?.values?.incidentImages || []),
          fileName,
        ]);
      } else {
        console.error('Upload failed:', res.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <Box>
      <Text size="sm" fw={500} mb="xs">
        {t('label')}
      </Text>
      <Dropzone
        onDrop={async (files) => {
          // Convert JFIF and WebP files to JPEG
          const processedFiles = await Promise.all(
            files.map(async (file) => {
              const extension = file.name.toLowerCase().split('.').pop();

              if (extension === 'jfif' || extension === 'webp') {
                try {
                  const convertedFile = await convertImageToJpeg(file);
                 
                  return convertedFile;
                } catch (error) {
                  notifications.show({
                    title: 'Conversion Failed',
                    message: `Could not convert ${file.name}. Please try another file.`,
                    color: 'red',
                    autoClose: 5000,
                  });
                  console.error('Image conversion error:', error);
                  return null;
                }
              }
              return file;
            })
          );

          // Filter out any failed conversions
          const validFiles = processedFiles.filter(
            (f): f is File => f !== null
          );

          if (validFiles.length === 0) {
            notifications.show({
              title: 'No Valid Files',
              message:
                'All files failed to process. Please try different images.',
              color: 'orange',
              autoClose: 3000,
            });
            return;
          }

          const currentImages = form.values.images || [];
          form.setFieldValue('images', [...currentImages, ...validFiles]);

          // Upload each file
          for (const file of validFiles) {
            await handleImageUpload(file);
          }
        }}
        maxSize={20 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        multiple
        style={{
          border: '2px dashed var(--mantine-color-gray-4)',
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
          gap="xl"
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

          <div className="px-4">
            <Text fz={{ base: 14, sm: 16, md: 18 }} inline fw={500}>
              {t('clickToSelect')}
            </Text>
          </div>
        </Group>
      </Dropzone>

      {form.values.images && form.values.images.length > 0 && (
        <Box mt="md">
          <Text size="sm" fw={500} mb="xs">
            {t('selectedImages')} ({form.values.images.length}):
          </Text>
          <ScrollArea h={form.values.images.length > 4 ? 400 : undefined}>
            <Stack gap="sm">
              {form.values.images.map((item: any, index: number) => {
                const isFile = item instanceof File;
                // Use the stored blob URL from state instead of creating a new one
                const imageUrl = isFile ? blobUrls[index] : item.url;
                const fileName = isFile
                  ? item.name
                  : item.name || 'Uploaded Image';
                const fileSize = isFile ? item.size : null;
                const isUploaded = !isFile && item.uploaded;

                return (
                  <Group
                    key={index}
                    justify="space-between"
                    p="sm"
                    bg={isUploaded ? 'green.0' : 'gray.0'}
                    style={{
                      borderRadius: 8,
                      border: `1px solid var(--mantine-color-${
                        isUploaded ? 'green' : 'gray'
                      }-3)`,
                    }}
                  >
                    <Group gap="md">
                      <Box
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 6,
                          overflow: 'hidden',
                          border: '1px solid var(--mantine-color-gray-3)',
                          flexShrink: 0,
                        }}
                      >
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={fileName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            loading="lazy"
                            width={500}
                            height={500}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              background: 'var(--mantine-color-gray-1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon
                              icon="lucide:loader"
                              className="animate-spin"
                            />
                          </div>
                        )}
                      </Box>
                      <Box>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {fileName}
                          {isUploaded && (
                            <Text component="span" size="xs" c="green" ml="xs">
                              ✓ Uploaded
                            </Text>
                          )}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {fileSize
                            ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
                            : 'Uploaded to server'}
                        </Text>
                      </Box>
                    </Group>
                    <Group>
                      <Button
                        type="button"
                        size="compact-sm"
                        variant="default"
                        color="red"
                        leftSection={<Icon icon="lucide:eye" />}
                        onClick={() => handleModalOpen(imageUrl)}
                      >
                       {t('view')}
                      </Button>
                      <Button
                        type="button"
                        size="compact-sm"
                        variant="filled"
                        color="red"
                        onClick={() => {
                          const newImages = form.values.images.filter(
                            (_: any, i: number) => i !== index
                          );
                          form.setFieldValue('images', newImages);
                        }}
                      >
                       {t('remove')}
                      </Button>
                    </Group>
                  </Group>
                );
              })}
            </Stack>
            <Modal
              opened={opened}
              onClose={close}
              className="!bg-transparent"
              withCloseButton={false}
              padding={0}
              centered
              size="xl"
            >
              <IncidentImagePreviewModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                close={close}
                blobUrls={blobUrls}
              />
            </Modal>
          </ScrollArea>
        </Box>
      )}
    </Box>
  );
}

export default IncidentImage;
