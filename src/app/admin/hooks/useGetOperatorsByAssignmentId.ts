
import { getApiData } from '@/lib/getApiData';
import { useQuery } from '@tanstack/react-query';


export interface OperatorItem {
  Id: number;
  UserId: string;
  Name: string;
}

interface UseOperatorsByAssignmentIdParams {
  assignmentId: number;
  enabled?: boolean;
}

export const useGetOperatorsByAssignmentId = ({
  assignmentId,
  enabled = true,
}: UseOperatorsByAssignmentIdParams) => {
  return useQuery({
    queryKey: ['operators', assignmentId],
    queryFn: async () => {
      const data = await getApiData(
        `/UserAccount/GetListOperatorsByAssignmentId?assignmentId=${assignmentId}`
      );

      if (data.error) {
        throw new Error(data.error);
      }

      return data as OperatorItem[];
    },
    enabled: enabled && !!assignmentId,
  });
};