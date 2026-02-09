import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenantId = request.nextUrl.searchParams.get('tenantId') || undefined;

    const response = await adminFetch('tickets', `/tickets/${id}`, {
      tenantId,
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }
    if (response.status === 404) {
      return apiError('Ticket not found', 404);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Ticket Detail API] Error:', error);
    return apiError('Failed to fetch ticket');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const tenantId = body.tenantId || undefined;

    const response = await adminFetch('tickets', `/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      tenantId,
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Ticket Update API] Error:', error);
    return apiError('Failed to update ticket');
  }
}
