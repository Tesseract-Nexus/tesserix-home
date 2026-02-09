import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET() {
  try {
    const response = await adminFetch('audit', '/audit-logs/compliance/report');

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Audit Compliance API] Error:', error);
    return apiError('Failed to fetch compliance report');
  }
}
