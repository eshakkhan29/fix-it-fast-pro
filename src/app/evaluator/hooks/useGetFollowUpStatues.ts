'use client';

import { getApiData } from '@/lib/getApiData';
import { useQuery } from '@tanstack/react-query';


interface UseGetFollowUpStatusesParams {
  accountId: number;
}

export const useGetFollowUpStatuses = (params: UseGetFollowUpStatusesParams) => {
  return useQuery({
    queryKey: ['followUpStatuses', params],
    queryFn: async () => {
      const data = await getApiData(
        `/Followup/GetListStatuses?category=followup&accountId=${params.accountId}`
      );
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    enabled: !!params.accountId,
  });
};