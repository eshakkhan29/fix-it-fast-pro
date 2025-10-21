'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export const createInitiatorRole = async (body: {
  accountId: number;
  userId: string;
  roleId: number;
}) => {
  try {
    const res = await fetchWithAuth(
      `${apiEndpoint}/api/UserAccount/AddUserInitiatorRole`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );

    // ✅ Read the response once as text
    const text = await res.text();
    let data;

    // ✅ Try parsing JSON — fallback to raw text
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      success: res.ok,
      status: res.status,
      data,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create user role';
    return { success: false, error: errorMessage };
  }
};
