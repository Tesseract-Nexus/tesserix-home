import { NextRequest, NextResponse } from 'next/server';
import { adminFetch, apiError, proxyResponse } from '@/lib/api/admin-fetch';

export async function GET() {
  try {
    const response = await adminFetch('notification', '/templates');

    if (response.status === 401) {
      // Don't return 401 to the client — it triggers a login redirect.
      // The notification-service may reject the token (Istio JWT validation
      // with Logto opaque tokens). Return an empty array so the page loads
      // with empty category sections instead of logging the user out.
      console.warn('[Email Templates API] Notification service returned 401 — returning empty list');
      return NextResponse.json([]);
    }

    return proxyResponse(response);
  } catch (error) {
    console.error('[Email Templates API] Error:', error);
    // Return empty array on network errors too, so the page is usable
    return NextResponse.json([]);
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
