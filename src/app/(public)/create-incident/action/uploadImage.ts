'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export interface BlobUploadRequest {
  accountId: number;
  blobName: string;
  blobValue: string;
  blobType: 'Image' | 'File';
}

export interface BlobUploadResponse {
  success: boolean;
  data?: {
    url: string;
    blobId?: string;
  };
  error?: string;
}

export interface UploadImageData {
  accountId: number;
  blobName: string;
  blobValue: string;
  blobType: 'Image' | 'File';
}

export const uploadImage = async (
  data: UploadImageData
): Promise<BlobUploadResponse> => {
  try {
    const { accountId, blobName, blobValue, blobType } = data;

    if (!accountId || !blobName || !blobValue || !blobType) {
      throw new Error(
        'Missing required fields: accountId, blobName, blobValue, or blobType'
      );
    }

    // Prepare the request body according to the API specification
    const requestBody: BlobUploadRequest = {
      accountId,
      blobName,
      blobValue,
      blobType,
    };

    // Make the POST request to /Blob endpoint
    const response = await fetchWithAuth(`${apiEndpoint}/api/Blob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const responseData = await response.json();

    // Return success response with URL
    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
