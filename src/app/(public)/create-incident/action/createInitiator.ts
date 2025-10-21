'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function createInitiator(payload: any) {
  try {
    const formattedPayload = {
      accountId: payload.accountId,
      email: payload.email,
      password: payload.password,
      confirmPassword: payload.confirmPassword,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
    };

    const res = await fetchWithAuth(
      `${apiEndpoint}/api/UserAccount/AddUserInitiator`,
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
