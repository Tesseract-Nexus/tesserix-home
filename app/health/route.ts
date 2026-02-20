import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'tesserix-home',
    timestamp: new Date().toISOString(),
  });
}
