'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

interface FollowUpPayload {
  Id: number;
  AccountId: number;
  InspectionId: number;
  Responsibles: { UserId: string }[];
  TEGId: number;
  DueDate?: string;
  StatusId: number;
  Notes: any[];
  CreatedOn: string;
  MediaUrls: string[];
  InformedParties: { UserId: string; DisplayName: string }[];
}

interface UpdateResponseData {
  success: boolean;
  message: string;
  error?: string;
}

export const updateFollowUp = async (payload: FollowUpPayload[]): Promise<UpdateResponseData> => {
  try {
    const url = `${apiEndpoint}/api/Followup`;

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
        message: 'Follow-up updated successfully',
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to update follow-up');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while updating the follow-up');
  }
};