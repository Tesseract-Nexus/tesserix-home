import { NextRequest } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await adminFetch('notification', `/templates/${id}`);

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }
    if (response.status === 404) {
      return apiError('Template not found', 404);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Template Detail API] Error:', error);
    return apiError('Failed to fetch email template');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const response = await adminFetch('notification', `/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Template Update API] Error:', error);
    return apiError('Failed to update email template');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await adminFetch('notification', `/templates/${id}`, {
      method: 'DELETE',
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Template Delete API] Error:', error);
    return apiError('Failed to delete email template');
  }
}
