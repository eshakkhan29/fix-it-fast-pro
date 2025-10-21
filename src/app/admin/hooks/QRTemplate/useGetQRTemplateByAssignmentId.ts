import { getApiData } from '@/lib/getApiData';
import { useQuery } from '@tanstack/react-query';
import { QRCodeTemplateItem } from './useGetQRTemplates';



interface UseGetQRTemplateByAssignmentIdParams {
  assignmentId: number;
  accountId: number;
  enabled?: boolean;
}

export const useGetQRTemplateByAssignmentId = ({
  assignmentId,
  accountId,
  enabled = true,
}: UseGetQRTemplateByAssignmentIdParams) => {
  return useQuery({
    queryKey: ['qrTemplate', assignmentId, accountId],
    queryFn: async () => {
      const data = await getApiData(
        `/LocationNodes/GetQRCode?assignmentId=${assignmentId}&accountId=${accountId}`
      );

      if (data.error) {
        throw new Error(data.error);
      }

      return data as QRCodeTemplateItem;
    },
    enabled: enabled && !!assignmentId && !!accountId,
  });
};