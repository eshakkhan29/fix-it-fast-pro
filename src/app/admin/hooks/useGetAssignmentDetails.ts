'use client';

import { useQuery } from '@tanstack/react-query';
import { getAssignmentDetails } from '../actions/getAssignmentDetails';

 // Update with correct path

interface UseGetAssignmentByIdParams {
  accountId: number;
  id: number;
  enabled?: boolean;
}

export const useGetAssignmentDetails = (params: UseGetAssignmentByIdParams) => {
  return useQuery({
    queryKey: ['assignment', params.accountId, params.id],
    queryFn: () => getAssignmentDetails({
      accountId: params.accountId,
      id: params.id,
    }),
    // staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: params.enabled !== false && !!params.accountId && !!params.id, // Only run query if both params are provided
  });
};