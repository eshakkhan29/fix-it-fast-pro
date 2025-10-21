'use client';

import { useQuery } from '@tanstack/react-query';
import { getAllFollowUpsByAccountId } from '../actions/getAllFollowUpsByAccountId';

interface UseGetAllFollowUpsParams {
  accountId: number;
  sorted?: boolean;
  startDate?: string;
  endDate?: string;
}

export const useGetAllFollowUps = (params: UseGetAllFollowUpsParams) => {
  return useQuery({
    queryKey: ['followUps', params],
    queryFn: () => getAllFollowUpsByAccountId(params),
    // staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!params.accountId, // Only run query if accountId is provided
  });
};
