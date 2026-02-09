import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET() {
  try {
    const response = await adminFetch('status-dashboard', '/incidents');

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[System Health Incidents API] Error:', error);
    return apiError('Failed to fetch incidents');
  }
}
