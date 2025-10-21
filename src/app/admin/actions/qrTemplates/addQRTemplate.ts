'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

export interface AddQRCodePayload {
  id: number;
  assignmentId: number;
  accountId: number;
  headerText: string;
  footerText: string;
  headerBody: string;
  footerBody: string;
  headerPosition: string;
  footerPosition: string;
  headerAlignment: string;
  footerAlignment: string;
  locationNamePosition: string;
  format: string;
  paperSize: string;
  rows: number;
  columns: number;
  createdBy: string;
}

interface AddQRCodeResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const addQRTemplate = async (payload: AddQRCodePayload): Promise<AddQRCodeResponseData> => {
  try {
    const url = `${apiEndpoint}/api/LocationNodes/AddQRCode`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'QR code added successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to add QR code');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while adding the QR code');
  }
};