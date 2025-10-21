'use client';

import { getApiData } from '@/lib/getApiData';
import { useQuery } from '@tanstack/react-query';

interface UseGetNestedLocationParams {
  accountId: number;
  locationTypes: number[];
}

export const useGetNestedLocation = (params: UseGetNestedLocationParams) => {
  return useQuery({
    queryKey: ['nestedLocation', params],
    queryFn: async () => {
      const locationTypesStr = params.locationTypes.join(',');
      const data = await getApiData(
        `/locationNodes/ByLocationType?accountId=${params.accountId}&locationTypes=${locationTypesStr}`
      );
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    enabled: !!params.accountId && params.locationTypes.length > 0,
  });
};