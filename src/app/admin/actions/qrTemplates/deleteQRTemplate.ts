'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

interface DeleteResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const deleteQRTemplate= async (id: number): Promise<DeleteResponseData> => {
  try {
    const url = `${apiEndpoint}/api/LocationNodes/DeleteQRCode?id=${id}`;

    const response = await fetchWithAuth(url, {
      method: 'DELETE',
      cache: 'no-store',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'QR code template deleted successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete QR code template');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while deleting the QR code template');
  }
};