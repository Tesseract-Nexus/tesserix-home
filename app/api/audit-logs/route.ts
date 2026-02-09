import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    for (const [key, value] of searchParams.entries()) {
      params.set(key, value);
    }

    const qs = params.toString();
    const response = await adminFetch('audit', `/audit-logs${qs ? `?${qs}` : ''}`);

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Audit Logs API] Error:', error);
    return apiError('Failed to fetch audit logs');
  }
}
