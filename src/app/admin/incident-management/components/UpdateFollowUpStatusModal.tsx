'use client';

import { Badge, Button, Group, Select, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';

import { useAccountIdStore } from '@/stores/user/accountId-store';
import { useUpdateFollowUpStatus } from '../../hooks/useUpdateFollowUpStatus';
import StatusModalSkeleton from './StatusModalSkeleton';
import { getFollowUpStatusColor } from '@/utils/getFollowUpStatusColor';
interface selectStatusDataType {
  label: "Open" | "Blocked" | "Resolved";
  value: string;
}
interface UpdateFollowUpStatusModalProps {
  close: () => void;
  statusIds: number[];
  setStatusIds: (ids: number[]) => void;
  refetch: () => void;
  selectStatusData: selectStatusDataType[];
  isStatusLoading: boolean;
}

const UpdateFollowUpStatusModal = ({
  close, statusIds, setStatusIds, refetch, selectStatusData, isStatusLoading }: UpdateFollowUpStatusModalProps
) => {
  const { userAccountId } = useAccountIdStore();



  const { mutate, isPending } = useUpdateFollowUpStatus();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Format status data for Select component


  // Handle status update
  const handleUpdate = () => {
    if (!selectedStatus) {
      notifications.show({
        title: 'Error',
        message: 'Please select a status',
        color: 'red',
        autoClose: 3000,
      });
      return;
    }

    const payload = {
      FollowUpStatusId: Number(selectedStatus),
      FollowUpIds: statusIds,
      CreatedOn: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format: YYYY-MM-DD HH:MM:SS
      AccountId: Number(userAccountId),
    };

    mutate(payload, {
      onSuccess: (data) => {
        if (data.success) {
          notifications.show({
            title: 'Success',
            message: 'Follow-up status updated successfully!',
            color: 'green',
            autoClose: 3000,
          });
          setStatusIds([]);
          refetch();
          close();
        } else {
          notifications.show({
            title: 'Error',
            message: data.error || 'Failed to update follow-up status',
            color: 'red',
            autoClose: 3000,
          });
        }
      },
      onError: (error) => {
        notifications.show({
          title: 'Error',
          message: error.message || 'An error occurred while updating the follow-up status',
          color: 'red',
          autoClose: 3000,
        });
      },
    });
  };

  if (isStatusLoading) {
    return <StatusModalSkeleton />;
  }
  const displayStatusText = selectStatusData.find((status) => status?.value === selectedStatus)
  // if (error) {
  //   return <Text>Error: {error.message}</Text>;
  // }

  return (
    <Stack>
      <Group gap={5} justify='space-between'>
        <Text>Selected Status:</Text>
        <Badge radius="xl" size='md' variant="outline" color={getFollowUpStatusColor(displayStatusText?.label || '')}>{selectedStatus ? displayStatusText?.label : "N/A"}</Badge>

      </Group>


      <Select
        label="Select Status"
        placeholder="Pick value"
        data={selectStatusData}
        value={selectedStatus}
        onChange={setSelectedStatus}
        disabled={isPending}
      />
      <Stack gap={5}>
        <Text fw={500} fz={18} c='primary'>Note</Text>
        <Text c='dimmed' size="sm">You can change the status of multiple follow-ups at once.</Text>
      </Stack>

      <Group justify="end"  >
        <Button variant="default" onClick={close} disabled={isPending}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} loading={isPending}>
          Update
        </Button>
      </Group>
    </Stack>
  );
};

export default UpdateFollowUpStatusModal;