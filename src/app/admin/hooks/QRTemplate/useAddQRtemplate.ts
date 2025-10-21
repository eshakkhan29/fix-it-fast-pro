'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddQRCodePayload, addQRTemplate } from '../../actions/qrTemplates/addQRTemplate';





interface UseAddQRCodeParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useAddQRTemplate = ({ onSuccess, onError }: UseAddQRCodeParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AddQRCodePayload) => {
      const response = await addQRTemplate(payload);
      if (!response.success) {
        throw new Error(response.error || 'Failed to add QR code');
      }
      return response;
    },
    onSuccess: () => {
      // Optionally invalidate related queries (e.g., assignments list)
      queryClient.invalidateQueries({ queryKey: ['qrCodeTemplates'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};