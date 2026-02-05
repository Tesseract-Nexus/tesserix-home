"use client";

import { Users, Building2, Ticket, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data - in a real app this would come from the API
const stats = {
  totalTenants: 524,
  activeTenants: 498,
  pendingTickets: 12,
  monthlyGrowth: 8.2,
};

const recentTenants = [
  { id: "1", name: "Acme Store", status: "active", createdAt: "2024-01-15" },
  { id: "2", name: "Fresh Foods", status: "active", createdAt: "2024-01-14" },
  { id: "3", name: "Tech Gadgets", status: "pending", createdAt: "2024-01-13" },
  { id: "4", name: "Fashion Hub", status: "active", createdAt: "2024-01-12" },
];

const recentTickets = [
  { id: "1", subject: "Payment integration issue", status: "open", priority: "high" },
  { id: "2", subject: "Custom domain setup", status: "in-progress", priority: "medium" },
  { id: "3", subject: "Product import help", status: "open", priority: "low" },
  { id: "4", subject: "API rate limit question", status: "resolved", priority: "medium" },
];

function getStatusColor(status: string) {
  switch (status) {
    case "active":
    case "resolved":
      return "success";
    case "pending":
    case "in-progress":
      return "warning";
    case "open":
      return "info";
    default:
      return "secondary";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function DashboardPage() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your platform"
      />

      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tenants"
            value={stats.totalTenants}
            description="All time"
            icon={<Building2 className="h-4 w-4" />}
          />
          <StatsCard
            title="Active Tenants"
            value={stats.activeTenants}
            description="Currently active"
            icon={<Users className="h-4 w-4" />}
            trend={{ value: stats.monthlyGrowth, label: "vs last month" }}
          />
          <StatsCard
            title="Pending Tickets"
            value={stats.pendingTickets}
            description="Requires attention"
            icon={<Ticket className="h-4 w-4" />}
          />
          <StatsCard
            title="Monthly Growth"
            value={`${stats.monthlyGrowth}%`}
            description="New tenants"
            icon={<TrendingUp className="h-4 w-4" />}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Tenants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Tenants</CardTitle>
                <CardDescription>Newly onboarded businesses</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tenants">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/tenants/${tenant.id}`}
                        className="font-medium hover:underline"
                      >
                        {tenant.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {tenant.createdAt}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Tickets</CardTitle>
                <CardDescription>Support requests from tenants</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tickets">
                  View all
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="font-medium hover:underline block truncate"
                      >
                        {ticket.subject}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                          {ticket.status}
                        </Badge>
                        <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
