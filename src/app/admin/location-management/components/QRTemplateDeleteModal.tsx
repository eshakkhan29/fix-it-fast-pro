'use client';

import { Icon } from '@iconify/react';
import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import { useTranslations } from 'next-intl';

import { notifications } from '@mantine/notifications';
import { useDeleteQRTemplate } from '../../hooks/QRTemplate/useDeleteQRTemplate';

interface QRTemplateDeleteModalProps {
  close: () => void;
  templateId: number;
  templateName?: string; // Optional: for dynamic Incident name
}

const QRTemplateDeleteModal = ({ close, templateId, templateName = 'FixItFast QR Template' }: QRTemplateDeleteModalProps) => {
  const { mutate, isPending } = useDeleteQRTemplate();
  const t = useTranslations('QRTemplateDeleteModal');

  const handleDelete = () => {
    mutate(
      { id: templateId },
      {
        onSuccess: () => {
          notifications.show({
            title: t('notifications.success.title'),
            message: t('notifications.success.message'),
            color: 'green',
            autoClose: 3000,
          });
          close(); // Close the modal on success
        },
        onError: (error: Error) => {
          notifications.show({
            title: t('notifications.error.title'),
            message: error.message || t('notifications.error.message'),
            color: 'red',
            autoClose: 3000,
          });
        },
      },
    );
  };

  return (
    <Stack gap={30}>
      <Group justify="space-between" p={15} className="!border-b border-solid !border-gray-300">
        <Text fw={500} fz={20}>
          {t('title')}
        </Text>
        <ActionIcon variant="default" radius="xl" onClick={close}>
          <Icon icon="material-symbols:close-rounded" />
        </ActionIcon>
      </Group>

      <Stack p={15}>
        <Group gap={5}>
          <Text fw={500} c="primary">{t('labels.qrTemplate')}</Text>
          <Text>{templateName}</Text>
        </Group>
        <Text>{t('messages.confirmDelete')}</Text>
      </Stack>

      <Group justify="end" p={15} className="!border-t border-solid !border-gray-300">
        <Button variant="default" onClick={close} disabled={isPending}>
          {t('actions.cancel')}
        </Button>
        <Button color="#DF1C41" onClick={handleDelete} loading={isPending}>
          {t('actions.delete')}
        </Button>
      </Group>
    </Stack>
  );
};

export default QRTemplateDeleteModal;