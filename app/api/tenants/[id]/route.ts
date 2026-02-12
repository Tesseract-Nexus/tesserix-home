import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const response = await adminFetch('tenant', `/internal/tenants/${id}`, {
      headers: { 'X-Internal-Service': 'tesserix-home' },
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }
    if (response.status === 404) {
      return apiError('Tenant not found', 404);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Tenant Detail API] Error:', error);
    return apiError('Failed to fetch tenant');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await adminFetch('tenant', `/api/v1/tenants/${id}`, {
      method: 'DELETE',
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Tenant Delete API] Error:', error);
    return apiError('Failed to delete tenant');
  }
}
