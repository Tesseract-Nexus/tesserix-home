import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production this would call the tenant service
const mockTenants = [
  {
    id: "1",
    name: "Acme Store",
    slug: "acme-store",
    email: "admin@acme-store.com",
    status: "active",
    plan: "professional",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Fresh Foods",
    slug: "fresh-foods",
    email: "contact@freshfoods.com",
    status: "active",
    plan: "starter",
    createdAt: "2024-01-14",
  },
];

export async function GET(request: NextRequest) {
  // In production, validate admin authentication here

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');

  let tenants = mockTenants;

  if (status && status !== 'all') {
    tenants = tenants.filter(t => t.status === status);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    tenants = tenants.filter(t =>
      t.name.toLowerCase().includes(searchLower) ||
      t.slug.toLowerCase().includes(searchLower) ||
      t.email.toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json({
    data: tenants,
    total: tenants.length,
    page: 1,
    pageSize: 20,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // In production, this would create a new tenant via the tenant service
    const newTenant = {
      id: String(Date.now()),
      name: body.name,
      slug: body.name.toLowerCase().replace(/\s+/g, '-'),
      email: body.email,
      status: 'pending',
      plan: body.plan || 'starter',
      createdAt: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({
      success: true,
      data: newTenant,
    });
  } catch (error) {
    console.error('[Tenants API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create tenant' },
      { status: 500 }
    );
  }
}
