'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQRTemplate } from '../../actions/qrTemplates/deleteQRTemplate';

interface UseDeleteQRCodeParams {
  id: number;
}

export const useDeleteQRTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UseDeleteQRCodeParams) => deleteQRTemplate(params.id),
    onSuccess: () => {
      // Invalidate or refetch queries related to QR code templates to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ['qrCodeTemplates'] });
    },
    onError: (error) => {
      console.error('Error deleting QR code template:', error);
    },
  });
};
