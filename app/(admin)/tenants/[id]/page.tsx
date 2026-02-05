"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Calendar, Building2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const tenantData: Record<string, {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: "active" | "pending" | "suspended";
  plan: string;
  createdAt: string;
  description?: string;
  customDomain?: string;
  stats: {
    products: number;
    orders: number;
    customers: number;
    revenue: string;
  };
}> = {
  "1": {
    id: "1",
    name: "Acme Store",
    slug: "acme-store",
    email: "admin@acme-store.com",
    status: "active",
    plan: "professional",
    createdAt: "2024-01-15",
    description: "Premium electronics and gadgets retailer",
    customDomain: "shop.acme.com",
    stats: {
      products: 245,
      orders: 1234,
      customers: 892,
      revenue: "$45,230",
    },
  },
};

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const tenant = tenantData[id] || tenantData["1"]; // Fallback for demo

  return (
    <>
      <AdminHeader
        title="Tenant Details"
      />

      <main className="p-6 space-y-6">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenants
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{tenant.name}</h2>
              <p className="text-muted-foreground">{tenant.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(tenant.status)} className="text-sm">
              {tenant.status}
            </Badge>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Store
            </Button>
            {tenant.status === "active" ? (
              <Button variant="destructive" size="sm">
                Suspend
              </Button>
            ) : (
              <Button size="sm">
                Activate
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tenant.stats.products}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tenant.stats.orders}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tenant.stats.customers}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{tenant.stats.revenue}</p>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Tenant Information</CardTitle>
                <CardDescription>Basic details about this tenant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${tenant.email}`} className="text-primary hover:underline">
                        {tenant.email}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{tenant.createdAt}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <Badge>{tenant.plan}</Badge>
                  </div>
                  {tenant.customDomain && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Custom Domain</p>
                      <a
                        href={`https://${tenant.customDomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        {tenant.customDomain}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
                {tenant.description && (
                  <>
                    <Separator />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Description</p>
                      <p>{tenant.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Settings</CardTitle>
                <CardDescription>Configure tenant-specific settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Subscription and payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Billing content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Activity log for this tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Activity content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
