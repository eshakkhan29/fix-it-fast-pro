'use client';
import { useQuery } from '@tanstack/react-query';
import { getFollowUpsListByFilter } from '../actions/getFollowUpListByFilters';

// Define the parameters for the hook, matching the payload expected by the server action
interface UseGetFollowUpsListParams {
  AccountId: number;
  UserId: string;
  RoleId: number;
  PageNumber: number;
  PageSize: number;
  Sorted: boolean;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
  LocationNodeLevelType?: string;
}

export const useGetFollowUpsListByFilters = (
  params: UseGetFollowUpsListParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ['followUpsList', params],
    queryFn: () => getFollowUpsListByFilter(params),
    enabled: options?.enabled !== false && !!params.AccountId && !!params.UserId && !!params.PageNumber && !!params.PageSize,
  });
};