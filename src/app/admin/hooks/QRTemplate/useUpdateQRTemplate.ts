'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddQRCodePayload } from '../../actions/qrTemplates/addQRTemplate';
import { updateQRTemplate } from '../../actions/qrTemplates/upDateQRTemplate';


interface UseUpdateQRTemplateParams {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useUpdateQRTemplate = ({ onSuccess, onError }: UseUpdateQRTemplateParams = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: AddQRCodePayload }) => {
      const response = await updateQRTemplate(id, body);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update QR code template');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate the QR code templates query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['qrCodeTemplates'] });
      queryClient.invalidateQueries({ queryKey: ['qrTemplate'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};