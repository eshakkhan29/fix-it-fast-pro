'use server';
import { apiEndpoint } from '@/constants';
import { fetchWithAuth } from '@/lib/auth';

// interface inspectionFormData {

// }

export async function postIncident(formData: any) {
  try {
    const res = await fetchWithAuth(`${apiEndpoint}/api/Inspections`, {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    // Build headers object without relying on Headers.entries for broader TS lib compatibility
    const headersObj: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    if (!res.ok) {
      // Check if response has content before trying to parse JSON
      const contentLength = res.headers.get('content-length');
      const contentType = res.headers.get('content-type');

      let errorData = null;

      // Only try to parse JSON if there's content and it's JSON
      if (
        contentLength &&
        contentLength !== '0' &&
        contentType?.includes('application/json')
      ) {
        try {
          errorData = await res.json();
        } catch (parseError) {
          console.log('Failed to parse error response as JSON:', parseError);
        }
      } else {
        // For empty responses or non-JSON responses, try to get text
        try {
          const errorText = await res.text();
          console.log(
            'Error response text:',
            errorText || 'Empty response body'
          );
        } catch (textError) {
          console.log('Failed to read error response as text:', textError);
        }
      }

      return {
        error:
          errorData?.message || `Server error: ${res.status} ${res.statusText}`,
        status: res.status,
        statusText: res.statusText,
        success: false,
      };
    }

    const data = await res.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error('Error posting incident:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to post incident';
    return { error: errorMessage };
  }
}
