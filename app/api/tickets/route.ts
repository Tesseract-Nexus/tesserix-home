import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production this would call the tickets service
const mockTickets = [
  {
    id: "TKT-001",
    subject: "Payment integration issue",
    tenant: "Acme Store",
    tenantId: "1",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15 10:30",
    lastUpdated: "2024-01-15 14:22",
  },
  {
    id: "TKT-002",
    subject: "Custom domain setup request",
    tenant: "Fresh Foods",
    tenantId: "2",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-14 09:15",
    lastUpdated: "2024-01-15 11:00",
  },
];

export async function GET(request: NextRequest) {
  // In production, validate admin authentication here

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');

  let tickets = mockTickets;

  if (status && status !== 'all') {
    tickets = tickets.filter(t => t.status === status);
  }

  if (priority && priority !== 'all') {
    tickets = tickets.filter(t => t.priority === priority);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    tickets = tickets.filter(t =>
      t.subject.toLowerCase().includes(searchLower) ||
      t.id.toLowerCase().includes(searchLower) ||
      t.tenant.toLowerCase().includes(searchLower)
    );
  }

  return NextResponse.json({
    data: tickets,
    total: tickets.length,
    page: 1,
    pageSize: 20,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.subject || !body.tenantId) {
      return NextResponse.json(
        { error: 'Subject and tenantId are required' },
        { status: 400 }
      );
    }

    // In production, this would create a new ticket via the tickets service
    const newTicket = {
      id: `TKT-${String(Date.now()).slice(-6)}`,
      subject: body.subject,
      description: body.description || '',
      tenant: body.tenantName || 'Unknown',
      tenantId: body.tenantId,
      status: 'open',
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newTicket,
    });
  } catch (error) {
    console.error('[Tickets API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
}
