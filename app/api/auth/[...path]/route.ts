import { NextRequest, NextResponse } from 'next/server';

const BFF_BASE_URL = process.env.BFF_BASE_URL || process.env.AUTH_BFF_URL || 'http://localhost:8080';

/**
 * Parse a raw Set-Cookie string into name, value, and options
 * for use with NextResponse.cookies.set().
 */
function parseSetCookie(raw: string): { name: string; value: string; options: Record<string, unknown> } | null {
  const parts = raw.split(';').map(p => p.trim());
  if (!parts[0]) return null;

  const eqIndex = parts[0].indexOf('=');
  if (eqIndex < 0) return null;

  const name = parts[0].substring(0, eqIndex).trim();
  const value = parts[0].substring(eqIndex + 1);
  const options: Record<string, unknown> = {};

  for (let i = 1; i < parts.length; i++) {
    const attr = parts[i];
    const attrEqIndex = attr.indexOf('=');
    const key = (attrEqIndex < 0 ? attr : attr.substring(0, attrEqIndex)).trim().toLowerCase();
    const val = attrEqIndex < 0 ? '' : attr.substring(attrEqIndex + 1).trim();

    switch (key) {
      case 'domain': options.domain = val; break;
      case 'path': options.path = val; break;
      case 'max-age': options.maxAge = parseInt(val, 10); break;
      case 'expires': options.expires = new Date(val); break;
      case 'httponly': options.httpOnly = true; break;
      case 'secure': options.secure = true; break;
      case 'samesite': options.sameSite = val.toLowerCase() as 'lax' | 'strict' | 'none'; break;
    }
  }

  return { name, value, options };
}

/**
 * Proxy auth requests to the BFF.
 *
 * For redirects (302): extracts Set-Cookie headers and sets them using
 * NextResponse.cookies.set() to ensure cookies survive the proxy layer.
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

    // Collect Set-Cookie headers using getSetCookie() to avoid header merging issues
    const setCookies = response.headers.getSetCookie?.() || [];

    // Handle redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (location) {
        // Resolve relative URLs against the external origin (not request.nextUrl.origin which is the internal pod address in K8s)
        const proto = request.headers.get('x-forwarded-proto') || 'https';
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
        const externalOrigin = `${proto}://${host}`;
        const redirectUrl = location.startsWith('http')
          ? location
          : new URL(location, externalOrigin).toString();

        // If there are cookies to set (e.g., callback response), use a debug page
        // to verify cookies are being set before redirecting.
        if (setCookies.length > 0) {
          const cookieInfo = setCookies.map(c => c.substring(0, 200)).join('\n');
          const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<h2>Auth Debug - Cookies being set:</h2>
<pre>${cookieInfo}</pre>
<p>Check DevTools &gt; Application &gt; Cookies for <code>bff_home_session</code></p>
<p><a href="${redirectUrl}">Click here to continue to dashboard</a></p>
<p><small>Will auto-redirect in 5 seconds...</small></p>
<script>setTimeout(function(){window.location.href=${JSON.stringify(redirectUrl)}},5000)</script>
</body></html>`;
          const htmlResponse = new NextResponse(html, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
          });
          // Set both the auth cookie AND a test cookie to diagnose which attributes cause rejection
          for (const raw of setCookies) {
            const parsed = parseSetCookie(raw);
            if (parsed) {
              htmlResponse.cookies.set(parsed.name, parsed.value, parsed.options);
              console.log(`[Auth Proxy] Set auth cookie: ${parsed.name}, domain=${parsed.options.domain}, secure=${parsed.options.secure}, httpOnly=${parsed.options.httpOnly}, sameSite=${parsed.options.sameSite}`);
            }
          }
          // Simple test cookie — no domain, no secure, no httponly
          htmlResponse.cookies.set('_test_cookie', 'works', { path: '/', maxAge: 300 });
          return htmlResponse;
        }

        // No cookies — use standard 302 redirect
        return NextResponse.redirect(redirectUrl, response.status);
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
