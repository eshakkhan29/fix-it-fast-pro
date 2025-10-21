'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function assignInAssignment(payload: any) {
  try {
    const formattedPayload = {
      assignmentId: Number(payload.assignmentId),
      userIds: [Number(payload.userId)],
    };

    const res = await fetchWithAuth(
      `${apiEndpoint}/api/Assignment/AddAssignmentInitiators`,
      {
        method: 'POST',
        body: JSON.stringify(formattedPayload),
      }
    );

    const text = await res.text(); // ✅ Read body once
    let data;

    try {
      data = JSON.parse(text); // Try parsing JSON manually
    } catch {
      data = text; // Fallback to raw text
    }

    if (res.ok) {
      return {
        success: true,
        data: 'User assign in this assignment',
      };
    } else {
      return {
        success: false,
        error: data || 'something went wrong to assign a user in assignment',
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to assign user in assignment';
    return { success: false, error: errorMessage };
  }
}
