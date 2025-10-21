'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";

export interface UserItem {
  Id: number;
  Name: string;
  UserId: string;
}

export interface LocationNodeItem {
  Id: number;
  Name: string;
}

export interface LocationTypeItem {
  Id: number;
  Name: string;
}

export interface InspectionTemplateItem {
  Id: number;
  Title: string;
}

export interface AssignmentData {
  Name: string;
  AccountId: number;
  IsAssignmentForOperator: boolean;
  Evaluators: UserItem[];
  Operators: UserItem[];
  Managers: UserItem[];
  LocationNodes: LocationNodeItem[];
  LocationTypes: LocationTypeItem[];
  InspectionTemplates: InspectionTemplateItem[];
  Id: number;
  Status: string;
  CreateTimestamp: string;
}

interface AssignmentResponseData {
  success: boolean;
  message: string;
  data?: AssignmentData;
  error?: string;
}

interface AssignmentQueryParams {
  accountId: number;
  id: number;
}

export const getAssignmentDetails = async (
  params: AssignmentQueryParams
): Promise<AssignmentResponseData> => {
  try {
    const url = `${apiEndpoint}/api/Assignment/getByAssignmentId`;
    const queryParams = new URLSearchParams();

    // Both accountId and id are required
    queryParams.append('accountId', params.accountId.toString());
    queryParams.append('id', params.id.toString());

    const fullUrl = `${url}?${queryParams.toString()}`;

    const response = await fetchWithAuth(fullUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Assignment fetched successfully',
        data: data as AssignmentData,
      };
    } else {
      return {
        success: false,
        error: await response.text(),
        message: 'Failed to fetch assignment',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An error occurred while fetching assignment',
    };
  }
};