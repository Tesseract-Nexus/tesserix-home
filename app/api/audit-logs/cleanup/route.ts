import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function POST() {
  try {
    const response = await adminFetch('audit', '/audit-logs/cleanup', {
      method: 'POST',
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Audit Cleanup API] Error:', error);
    return apiError('Failed to trigger cleanup');
  }
}
