import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const queryString = searchParams.toString();
    const path = queryString ? `/templates?${queryString}` : '/templates';

    const response = await adminFetch('notification', path);

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Templates API] Error:', error);
    return apiError('Failed to fetch email templates');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await adminFetch('notification', '/templates', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Templates API] Error:', error);
    return apiError('Failed to create email template');
  }
}
