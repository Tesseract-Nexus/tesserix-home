import { NextRequest, NextResponse } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query string for tenant-service
    const params = new URLSearchParams({ page, limit });
    if (status && status !== 'all') params.set('status', status);
    if (search) params.set('search', search);

    // Platform admin fetches all tenants via membership endpoint
    const response = await adminFetch('tenant', `/api/v1/users/me/tenants?${params}`);

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Tenants API] Error:', error);
    return apiError('Failed to fetch tenants');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const response = await adminFetch('tenant', '/api/v1/tenants/create-for-user', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      return apiError('Unauthorized', 401);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Tenants API] Error:', error);
    return apiError('Failed to create tenant');
  }
}
