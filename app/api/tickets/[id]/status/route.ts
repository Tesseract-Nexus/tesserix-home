import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.status) {
      return apiError('Status is required', 400);
    }

    const tenantId = body.tenantId || undefined;

    const response = await adminFetch('tickets', `/tickets/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: body.status.toUpperCase() }),
      tenantId,
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Ticket Status API] Error:', error);
    return apiError('Failed to update ticket status');
  }
}
