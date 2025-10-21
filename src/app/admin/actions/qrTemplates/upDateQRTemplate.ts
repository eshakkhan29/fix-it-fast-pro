'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";
import { AddQRCodePayload } from "./addQRTemplate";


interface UpdateResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const updateQRTemplate = async (id: number, body: AddQRCodePayload): Promise<UpdateResponseData> => {
  try {
    const url = `${apiEndpoint}/api/LocationNodes/UpdateQRCode?id=${id}`;

    const response = await fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'QR code template updated successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update QR code template');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while updating the QR code template');
  }
};