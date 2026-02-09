import { NextRequest, NextResponse } from 'next/server';

const BFF_BASE_URL = process.env.BFF_BASE_URL || process.env.AUTH_BFF_URL || 'http://localhost:8080';

/**
 * Proxy auth requests to the BFF.
 *
 * For redirects (302): extracts Set-Cookie headers and sets them on the
 * NextResponse redirect, ensuring cookies survive the proxy layer.
 * For other responses: forwards headers, status, and body as-is.
 */
async function proxyToBff(request: NextRequest, path: string) {
  const queryString = request.nextUrl.search;
  const url = `${BFF_BASE_URL}${path}${queryString}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // Ensure x-forwarded-host is set for auth-bff host detection
  if (!headers.has('x-forwarded-host')) {
    headers.set('x-forwarded-host', request.headers.get('host') || '');
  }
  if (!headers.has('x-forwarded-proto')) {
    headers.set('x-forwarded-proto', 'https');
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    credentials: 'include',
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text();
    if (body) {
      init.body = body;
    }
  }

  try {
    const response = await fetch(url, init);

    // Collect Set-Cookie headers
    const setCookies = response.headers.getSetCookie?.() || [];

    // Handle redirects: build a NextResponse.redirect and attach cookies
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        // Resolve relative URLs against the request origin
        const redirectUrl = location.startsWith('http')
          ? location
          : new URL(location, request.nextUrl.origin).toString();

        const redirectResponse = NextResponse.redirect(redirectUrl, response.status);

        // Attach all Set-Cookie headers from auth-bff
        for (const cookie of setCookies) {
          redirectResponse.headers.append('set-cookie', cookie);
        }

        return redirectResponse;
      }
    }

    // Non-redirect responses: forward as-is
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'set-cookie') {
        responseHeaders.set(key, value);
      }
    });
    for (const cookie of setCookies) {
      responseHeaders.append('set-cookie', cookie);
    }

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Auth Proxy] Error:', error);
    return NextResponse.json(
      { error: 'Auth service unavailable' },
      { status: 503 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const authPath = '/auth/' + path.join('/');
  return proxyToBff(request, authPath);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const authPath = '/auth/' + path.join('/');
  return proxyToBff(request, authPath);
}
