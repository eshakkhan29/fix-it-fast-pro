'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function getAccountID(url: string) {
  try {
    const res = await fetchWithAuth(`${apiEndpoint}/api${url}`);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to fetch account ID');
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching account ID:', error);
    return null;
  }
}
