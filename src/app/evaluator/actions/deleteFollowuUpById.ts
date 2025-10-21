'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

interface DeleteResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const deleteFollowUpById = async (followUpId: number): Promise<DeleteResponseData> => {
  try {
    const url = `${apiEndpoint}/api/FollowUp/SoftDelete?id=${followUpId}`;

    const response = await fetchWithAuth(url, {
      method: 'PUT',
      cache: 'no-store',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Follow-up deleted successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to delete follow-up');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while deleting the follow-up');
  }
};