'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

interface UpdateFollowUpStatusPayload {
  FollowUpStatusId: number;
  FollowUpIds: number[];
  CreatedOn: string;
  AccountId: number;
}

interface UpdateResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const updateFollowUpStatus = async (payload: UpdateFollowUpStatusPayload): Promise<UpdateResponseData> => {
  try {
    const url = `${apiEndpoint}/api/FollowUp/BulkFollowUpStatusUpdate`;

    const response = await fetchWithAuth(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Follow-up status updated successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update follow-up status');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while updating the follow-up status');
  }
};