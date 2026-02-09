import { NextRequest, NextResponse } from 'next/server';

const BFF_BASE_URL = process.env.BFF_BASE_URL || process.env.AUTH_BFF_URL || 'http://localhost:8080';

/**
 * Proxy auth requests to the BFF
 */
async function proxyToBff(request: NextRequest, path: string) {
  const url = `${BFF_BASE_URL}${path}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Skip headers that shouldn't be forwarded
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  const init: RequestInit = {
    method: request.method,
    headers,
    credentials: 'include',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const body = await request.text();
    if (body) {
      init.body = body;
    }
  }

  try {
    const response = await fetch(url, init);

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

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
