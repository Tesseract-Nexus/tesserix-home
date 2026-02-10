import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ONBOARDING_SERVICE_URL = process.env.ONBOARDING_SERVICE_URL || 'http://localhost:4201';
const ONBOARDING_ADMIN_API_KEY = process.env.ONBOARDING_ADMIN_API_KEY || '';

/**
 * Verify the user has an active session (bff_home_session cookie exists).
 * Returns true if authenticated, false otherwise.
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('bff_home_session');
  return !!sessionCookie;
}

/**
 * Server-side fetch helper for tenant-onboarding service.
 *
 * Auth flow:
 * 1. Verify user has bff_home_session cookie (is authenticated in tesserix-home)
 * 2. Forward request to tenant-onboarding with X-Admin-Key header
 *
 * This is separate from adminFetch because:
 * - adminFetch does session → JWT exchange → Istio headers (for Go services)
 * - onboardingFetch does session validation → API key auth (for the Next.js onboarding service)
 */
export async function onboardingFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('bff_home_session');

  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!ONBOARDING_ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: 'Onboarding service not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = `${ONBOARDING_SERVICE_URL}${path}`;

  const { headers: extraHeaders, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Admin-Key': ONBOARDING_ADMIN_API_KEY,
    ...(extraHeaders as Record<string, string> || {}),
  };

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}

/**
 * Helper to return a JSON error response for API routes.
 */
export function onboardingApiError(message: string, status: number = 500): NextResponse {
  return NextResponse.json({ error: message }, { status });
}
