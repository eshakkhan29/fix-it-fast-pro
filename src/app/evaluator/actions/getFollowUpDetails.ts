'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

// Interface for the response data (single object based on your component usage)
interface FollowUpDetail {
  Inspection?: Array<{
    Name: string;
    [key: string]: any;
  }>;
  StatusId?: Array<{
    Name: string;
    [key: string]: any;
  }>;
  TEGId?: Array<{
    Topic: string;
    Question: string;
    [key: string]: any;
  }>;
  ResponseOpt?: Array<{
    Label: string;
    [key: string]: any;
  }>;
  Location?: string;
  [key: string]: any;
}

interface GetFollowUpDetailsResponse {
  success: boolean;
  message: string;
  data?: FollowUpDetail; // Changed from array to single object
  error?: string;
}

// Payload type based on provided structure
interface GetFollowUpDetailsPayload {
  AccountId: number;
  UserId: string;
  RoleId: number;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
  LocationNodeLevelType?: string;
  FollowUpId: number;
}

export const getFollowUpDetails = async (payload: GetFollowUpDetailsPayload): Promise<GetFollowUpDetailsResponse> => {
  try {
    const url = `${apiEndpoint}/api/FollowUp/GetFollowUpDetailByIdAndFilters`;

    const response = await fetchWithAuth(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Follow-up details fetched successfully',
        data: data as FollowUpDetail, // Changed from array to single object
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch follow-up details');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while fetching follow-up details');
  }
};