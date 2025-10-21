// Path: hooks/useGetAssignmentsList.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { getApiData } from '@/lib/getApiData'; // Update with the correct path to your getApiData function


import { UserItem, LocationNodeItem, LocationTypeItem, InspectionTemplateItem } from '../actions/getAssignmentDetails'; // Update path as needed

// Define AssignmentData for type consistency (copied from your getAssignmentDetails)
interface AssignmentData {
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

// Extend AssignmentData to include additional fields from the list response
interface AssignmentListItem extends AssignmentData {
  CreatedBy: string;
  ModifiedBy: string;
  ModifiedTimestamp: string;
  DataStateFlag: string;
}

interface UseGetAssignmentsListParams {
  accountId: number;
  enabled?: boolean;
}

export const useGetAssignmentsList = (params: UseGetAssignmentsListParams) => {
  return useQuery({
    queryKey: ['assignmentsList', params.accountId],
    queryFn: async () => {
      const data = await getApiData(
        `/Assignment/GetbyAccountId?accountId=${params.accountId}`
      );
     

      if (data.error) {
        throw new Error(data.error);
      }

      return data as AssignmentListItem[]; // Type assertion to match the expected array response
    },
    enabled: params.enabled !== false && !!params.accountId, // Only run query if accountId is provided
    // staleTime: 5 * 60 * 1000, // 5 minutes (uncomment if needed)
  });
};