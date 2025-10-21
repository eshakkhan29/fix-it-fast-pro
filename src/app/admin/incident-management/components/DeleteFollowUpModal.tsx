'use client';

import { Icon } from '@iconify/react';
import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';
import React from 'react';
import { useDeleteFollowUp } from '../../hooks/useDeleteFollowUp';
import { notifications } from '@mantine/notifications';


interface DeleteFollowUpModalProps {
  close: () => void;
  name: string;
  id: number;
  refetch?: () => void;
}

const DeleteFollowUpModal = ({ close, name, id, refetch }: DeleteFollowUpModalProps) => {
  const { mutate, isPending } = useDeleteFollowUp();

  const handleDelete = () => {
    mutate(
      { followUpId: id },
      {
        onSuccess: (data) => {
          if (data.success) {
            notifications.show({
              title: 'Successful',
              message: 'Follow Up deleted successfully!',
              color: 'green',
              autoClose: 3000,
            });
            refetch?.();
            close(); // Close the modal on successful deletion
          } else {
            notifications.show({
              title: 'Error',
              message: data.error || 'Failed to delete follow-up',
              color: 'red',
              autoClose: 3000,
            });
          }
        },
        onError: (error) => {
          notifications.show({
            title: 'Error',
            message: error.message || 'An error occurred while deleting the follow-up',
            color: 'red',
            autoClose: 3000,
          });
        },
      }
    );
  };

  return (
    <Stack gap={30}>
      <Group justify="space-between" p={15} className="!border-b border-solid !border-gray-300">
        <Text fw={500} fz={20}>Delete Follow Up</Text>
        <ActionIcon variant="default" radius="xl" onClick={close} disabled={isPending}>
          <Icon icon="material-symbols:close-rounded" />
        </ActionIcon>
      </Group>

      <Stack p={15}>
        <Group gap={5}>
          <Text fw={500} c="primary">Incident:</Text>
          <Text>{name || 'FixItFast Followup'}</Text>
        </Group>
        <Text>Are you sure you want to delete this Follow Up?</Text>
        
       
       
        
      </Stack>

      <Group justify="end" p={15} className="!border-t border-solid !border-gray-300">
        <Button variant="default" onClick={close} disabled={isPending}>
          Cancel
        </Button>
        <Button color="#DF1C41" onClick={handleDelete} loading={isPending}>
          Delete
        </Button>
      </Group>
    </Stack>
  );
};

export default DeleteFollowUpModal;