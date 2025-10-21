'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function sendNotification(payload: any) {
  try {
    const formattedPayload = {
      accountId: payload.accountId,
      assignmentId: payload.assignmentId,
      location: payload.location,
      toEmail: payload.toEmail,
      ccEmail: payload.ccEmail,
      url: payload.url,
      inspectionId: payload.inspectionId,
      followupId: payload.followupId,
      status: payload.status,
      createdByUserId: payload.createdByUserId,
      modifiedByUserId: payload.modifiedByUserId,
      modifiedByUserName: payload.modifiedByUserName,
    };

    const res = await fetchWithAuth(
      `${apiEndpoint}/api/UserAccount/SendInitiatorEmailNotification`,
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
        data,
      };
    } else {
      return {
        success: false,
        error: data,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create user';
    return { success: false, error: errorMessage };
  }
}
