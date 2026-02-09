"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Mail, Calendar, Building2, Globe } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import { useTenant } from "@/lib/api/tenants";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "tesserix.app";

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
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

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: tenant, isLoading, error, mutate } = useTenant(id);

  const storeUrl = tenant?.custom_domain && tenant.use_custom_domain
    ? `https://${tenant.custom_domain}`
    : tenant?.slug
      ? `https://${tenant.slug}.${BASE_DOMAIN}`
      : null;

  return (
    <>
      <AdminHeader title="Tenant Details" />

      <main className="p-6 space-y-6">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tenants">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenants
          </Link>
        </Button>

        {isLoading ? (
          <DetailSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={mutate} />
        ) : !tenant ? (
          <ErrorState message="Tenant not found" />
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{tenant.display_name || tenant.name}</h2>
                  <p className="text-muted-foreground">{tenant.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {tenant.status && (
                  <Badge variant={getStatusColor(tenant.status)} className="text-sm">
                    {tenant.status}
                  </Badge>
                )}
                {storeUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Store
                    </a>
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
                {/* Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tenant Information</CardTitle>
                    <CardDescription>Basic details about this tenant</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {tenant.email && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${tenant.email}`} className="text-primary hover:underline">
                              {tenant.email}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Created</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {tenant.created_at
                              ? new Date(tenant.created_at).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>
                      {tenant.industry && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Industry</p>
                          <Badge variant="secondary">{tenant.industry}</Badge>
                        </div>
                      )}
                      {tenant.custom_domain && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Custom Domain</p>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`https://${tenant.custom_domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              {tenant.custom_domain}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Storefront URL</p>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {storeUrl ? (
                            <a
                              href={storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              {tenant.slug}.{BASE_DOMAIN}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                      </div>
                      {tenant.admin_url && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Admin URL</p>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={tenant.admin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              {tenant.slug}-admin.{BASE_DOMAIN}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
                    <p className="text-muted-foreground">Settings management coming soon...</p>
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
                    <p className="text-muted-foreground">Billing management coming soon...</p>
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
                    <p className="text-muted-foreground">Activity log coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </>
  );
}
