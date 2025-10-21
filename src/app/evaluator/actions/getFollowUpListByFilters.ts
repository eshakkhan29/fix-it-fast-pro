'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

// Interface for a single follow-up object based on provided structure
export interface FollowUp {
  FollowupId: number;
  InspectionId: number;
  Location: string;
  DueDate: string;
  CreatedOn: string;
  AssignedTo: string;
  CreatedBy: string;
  Topic: string;
  OverDueFlag: string;
  Question: string;
  StatusId: number;
  OverDueDay: number;
  Status: string;
  InspectionTemplateName: string;
  TotalResult: number;
  PageCount: number;
  Notes: string;
  [key: string]: any;
}

// Interface for the response data
interface GetFollowUpsListResponse {
  success: boolean;
  message: string;
  data?: FollowUp[];
  error?: string;
}

// Payload type based on provided structure
interface GetFollowUpsListPayload {
  AccountId: number;
  UserId: string;
  RoleId: number;
  PageNumber: number;
  PageSize: number;
  Sorted: boolean;
  CreatedDateFrom?: string;
  CreatedDateTo?: string;
  LocationNodeLevelType?: string;
}

export const getFollowUpsListByFilter = async (payload: GetFollowUpsListPayload): Promise<GetFollowUpsListResponse> => {
  try {
    const url = `${apiEndpoint}/api/FollowUp/GetFollowupByFilters`;

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
        message: 'Follow-up list fetched successfully',
        data: data as FollowUp[],
      };
    } else {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch follow-up list');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'An error occurred while fetching follow-up list');
  }
};