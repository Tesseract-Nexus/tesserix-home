"use client";

import { Users, Building2, Ticket, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { StatsCard } from "@/components/admin/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import { useTenants, type Tenant } from "@/lib/api/tenants";
import { useTickets, type Ticket as TicketType } from "@/lib/api/tickets";

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "active":
    case "resolved":
      return "success";
    case "pending":
    case "in_progress":
    case "in-progress":
      return "warning";
    case "open":
      return "info";
    default:
      return "secondary";
  }
}

function getPriorityColor(priority: string) {
  switch (priority?.toLowerCase()) {
    case "high":
    case "critical":
    case "urgent":
      return "destructive";
    case "medium":
      return "warning";
    case "low":
      return "secondary";
    default:
      return "secondary";
  }
}

function StatsLoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function RecentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: tenantsData, isLoading: tenantsLoading, error: tenantsError, mutate: mutateTenants } = useTenants({ limit: 4 });
  const { data: ticketsData, isLoading: ticketsLoading, error: ticketsError, mutate: mutateTickets } = useTickets({ limit: 4 });
  const { data: openTicketsData } = useTickets({ status: 'open', limit: 1 });

  const totalTenants = tenantsData?.total ?? 0;
  const openTickets = openTicketsData?.total ?? 0;
  const recentTenants = tenantsData?.data ?? [];
  const recentTickets = ticketsData?.data ?? [];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your platform"
      />

      <main className="p-6 space-y-6">
        {/* Stats Grid */}
        {tenantsLoading || ticketsLoading ? (
          <StatsLoadingSkeleton />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Tenants"
              value={totalTenants}
              description="All time"
              icon={<Building2 className="h-4 w-4" />}
            />
            <StatsCard
              title="Active Tenants"
              value={totalTenants}
              description="Currently active"
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Open Tickets"
              value={openTickets}
              description="Requires attention"
              icon={<Ticket className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Tickets"
              value={ticketsData?.total ?? 0}
              description="All time"
              icon={<TrendingUp className="h-4 w-4" />}
            />
          </div>
        )}

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
              {tenantsLoading ? (
                <RecentListSkeleton />
              ) : tenantsError ? (
                <ErrorState message={tenantsError} onRetry={mutateTenants} />
              ) : recentTenants.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No tenants yet</p>
              ) : (
                <div className="space-y-4">
                  {recentTenants.map((tenant: Tenant) => (
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
                          {tenant.slug}
                        </p>
                      </div>
                      {tenant.status && (
                        <Badge variant={getStatusColor(tenant.status)}>
                          {tenant.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
              {ticketsLoading ? (
                <RecentListSkeleton />
              ) : ticketsError ? (
                <ErrorState message={ticketsError} onRetry={mutateTickets} />
              ) : recentTickets.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No tickets yet</p>
              ) : (
                <div className="space-y-4">
                  {recentTickets.map((ticket: TicketType) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/tickets/${ticket.id}`}
                          className="font-medium hover:underline block truncate"
                        >
                          {ticket.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(ticket.status)} className="text-xs">
                            {ticket.status?.toLowerCase().replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant={getPriorityColor(ticket.priority)} className="text-xs">
                            {ticket.priority?.toLowerCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
