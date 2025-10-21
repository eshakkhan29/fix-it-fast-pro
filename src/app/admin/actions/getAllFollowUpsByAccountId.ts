'use server';

import { apiEndpoint } from "@/constants";
import { fetchWithAuth } from "@/lib/auth";



export interface StatusItem {
  Id: number;
  GlobalId: number;
  Name: string;
}

export interface InspectionItem {
  Id: number;
  Name: string;
  AssignmentId: number;
}

export interface ResponseOptItem {
  Id: number;
  Label: string;
}

export interface FollowUpData {
  AccountId: number;
  FollowUpId: number;
  StatusId: StatusItem[];
  Inspection: InspectionItem[];
  Location: string;
  CreateDate: string;
  ResponseOpt: ResponseOptItem[];
}

interface ResponseData {
  success: boolean;
  message: string;
  data?: FollowUpData[];
  error?: string;
}

interface QueryParams {
  accountId: number;
  sorted?: boolean;
  startDate?: string; // Format: YYYY-MM-DD
  endDate?: string; // Format: YYYY-MM-DD
}

// Helper function to get date 30 days ago
const getDefaultStartDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
};

// Helper function to get today's date
const getDefaultEndDate = (): string => {
  const date = new Date();
  return date.toISOString().split('T')[0];
};

export const getAllFollowUpsByAccountId = async (
  params: QueryParams
): Promise<ResponseData> => {
  try {
    const url = `${apiEndpoint}/api/FollowUp/GetAllByAccountId`;
    const queryParams = new URLSearchParams();

    // accountId is required
    queryParams.append('accountId', params.accountId.toString());

    // sorted is optional, default to false if not provided
    if (params.sorted !== undefined) {
      queryParams.append('sorted', params.sorted.toString());
    }

    // Use provided dates or default to last 30 days
    const startDate = params.startDate || getDefaultStartDate();
    const endDate = params.endDate || getDefaultEndDate();

    queryParams.append('startDate', startDate);
    queryParams.append('endDate', endDate);

    const fullUrl = `${url}?${queryParams.toString()}`;

    const response = await fetchWithAuth(fullUrl, {
      method: 'GET',
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'Follow-ups fetched successfully',
        data: data as FollowUpData[],
      };
    } else {
      return {
        success: false,
        error: await response.text(),
        message: 'Failed to fetch follow-ups',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An error occurred while fetching follow-ups',
    };
  }
};