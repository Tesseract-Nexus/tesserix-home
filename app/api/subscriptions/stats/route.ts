import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET() {
  try {
    const response = await adminFetch('subscription', '/api/v1/stats/overview');
    console.log(`[Subscription Stats API] GET /api/v1/stats/overview → status ${response.status}`);
    if (response.status === 401) return apiError('Unauthorized', 401);
    return proxyResponse(response);
  } catch (error) {
    console.error('[Subscription Stats API] Error:', error);
    return apiError('Failed to fetch subscription stats');
  }
}
