'use server';
import { fetchWithAuth } from '@/lib/auth';

export async function getLocationHierarchy(url: string) {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Failed to fetch data');
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
