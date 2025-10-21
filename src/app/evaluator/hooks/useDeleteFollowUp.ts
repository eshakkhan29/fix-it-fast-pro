'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFollowUpById } from '../actions/deleteFollowuUpById';

interface UseDeleteFollowUpParams {
  followUpId: number;
}

export const useDeleteFollowUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UseDeleteFollowUpParams) =>
      deleteFollowUpById(params.followUpId),
    onSuccess: () => {
      // Invalidate or refetch queries related to follow-ups to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ['followUps'] });
    },
    onError: (error) => {
      console.error('Error deleting follow-up:', error);
    },
  });
};
