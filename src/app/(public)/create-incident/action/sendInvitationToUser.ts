'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function sendInvitationToUser(payload: any) {
  try {
    const formattedPayload = {
      userId: payload.userId,
      email: payload.email,
      accountId: payload.accountId,
    };

    const res = await fetchWithAuth(
      `${apiEndpoint}/api/UserAccount/SendInvitation`,
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
