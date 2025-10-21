'use client';

import { useMutation } from '@tanstack/react-query';
import { updateFollowUp } from '../actions/updateFollowUp';

interface FollowUpPayload {
  Id: number;
  AccountId: number;
  InspectionId: number;
  Responsibles: { UserId: string }[];
  TEGId: number;
  DueDate: string;
  StatusId: number;
  Notes: any[];
  CreatedOn: string;
  MediaUrls: any[];
  InformedParties: { UserId: string; DisplayName: string }[];
}

interface UpdateFollowUpParams {
  payload: FollowUpPayload[];
}

interface UpdateResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const useUpdateFollowUp = () => {
  return useMutation<UpdateResponseData, Error, UpdateFollowUpParams>({
    mutationKey: ['updateFollowUp'],
    mutationFn: async ({ payload }) => {
      const data = await updateFollowUp(payload);

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    },
  });
};
