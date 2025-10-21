'use client';

import { useQuery } from '@tanstack/react-query';
import { getFollowUpDetails } from '../actions/getFollowUpDetails';

// Define the parameters for the hook, matching the payload expected by the server action
interface UseGetFollowUpDetailsParams {
  AccountId: number;
  UserId: string;
  RoleId: number;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
  LocationNodeLevelType?: string;
  FollowUpId: number;
}

export const useGetFollowUpDetails = (params: UseGetFollowUpDetailsParams) => {
  return useQuery({
    queryKey: ['followUpDetails', params],
    queryFn: () => getFollowUpDetails(params),
    // staleTime: 5 * 60 * 1000, // 5 minutes (uncomment if needed)
    enabled: !!params.AccountId && !!params.UserId && !!params.FollowUpId, // Only run query if required params are provided
  });
};