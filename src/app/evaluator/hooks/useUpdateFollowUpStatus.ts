'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateFollowUpStatus } from '../actions/updateFollowUpStatus'; // Adjust path as needed

interface UpdateFollowUpStatusParams {
  FollowUpStatusId: number;
  FollowUpIds: number[];
  CreatedOn: string;
  AccountId: number;
}

export const useUpdateFollowUpStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateFollowUpStatusParams) => {
      if (typeof updateFollowUpStatus !== 'function') {
        throw new Error('updateFollowUpStatus is not a function');
      }
      return updateFollowUpStatus(params);
    },
    onSuccess: () => {
      // Invalidate or refetch queries related to follow-ups to reflect the status update
      queryClient.invalidateQueries({ queryKey: ['followUps'] });
    },
    onError: (error) => {
      console.error('Error updating follow-up status:', error);
    },
  });
};
