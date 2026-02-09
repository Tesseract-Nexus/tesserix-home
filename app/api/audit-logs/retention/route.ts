import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET() {
  try {
    const response = await adminFetch('audit', '/audit-logs/retention');

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Audit Retention API] Error:', error);
    return apiError('Failed to fetch retention settings');
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await adminFetch('audit', '/audit-logs/retention', {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Audit Retention API] Error:', error);
    return apiError('Failed to update retention settings');
  }
}
