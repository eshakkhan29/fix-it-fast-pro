'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiData } from '@/lib/getApiData'; // Update with the correct path

export interface QRCodeTemplateItem {
  Id: number;
  AssignmentId: number;
  AccountId: number;
  HeaderText: string;
  FooterText: string;
  HeaderBody: string;
  FooterBody: string;
  HeaderPosition: string;
  FooterPosition: string;
  HeaderAlignment: string;
  FooterAlignment: string;
  LocationNamePosition: string;
  Format: string;
  PaperSize: string;
  Rows: number;
  Columns: number;
  CreatedBy: string;
  CreatedOn: string;
}

interface UseGetAllQRCodesParams {
  enabled?: boolean;
}

export const useGetAllQRTemplates = ({ enabled = true }: UseGetAllQRCodesParams = {}) => {
  return useQuery({
    queryKey: ['qrCodeTemplates'],
    queryFn: async () => {
      const data = await getApiData('/LocationNodes/GetAllQRCodes');

      if (data.error) {
        throw new Error(data.error);
      }

      return data as QRCodeTemplateItem[];
    },
    enabled,
  });
};