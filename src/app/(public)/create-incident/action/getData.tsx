'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

export async function getData(url: string) {
  try {
    const res = await fetchWithAuth(`${apiEndpoint}/api${url}`);

    if (!res.ok) {
      const data = await res.json();
      return { error: data.message || 'Failed to fetch data' };
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch data';
    return { error: errorMessage };
  }
}
