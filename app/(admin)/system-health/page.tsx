"use client";

import { useEffect, useRef } from "react";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import {
  useSystemStatus,
  useServices,
  useIncidents,
  type OverallStatus,
  type ServiceHealth,
  type Incident,
} from "@/lib/api/system-health";

function statusBannerColor(status: OverallStatus) {
  switch (status) {
    case "operational":
      return "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400";
    case "degraded":
      return "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-400";
    case "outage":
      return "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400";
  }
}

function statusLabel(status: OverallStatus) {
  switch (status) {
    case "operational":
      return "All Systems Operational";
    case "degraded":
      return "Degraded Performance";
    case "outage":
      return "System Outage";
  }
}

function healthBadgeVariant(health: ServiceHealth): "success" | "destructive" | "warning" | "secondary" {
  switch (health) {
    case "healthy":
      return "success";
    case "unhealthy":
      return "destructive";
    case "degraded":
      return "warning";
    case "unknown":
    default:
      return "secondary";
  }
}

function incidentSeverityVariant(severity: Incident["severity"]): "destructive" | "warning" | "secondary" {
  switch (severity) {
    case "critical":
      return "destructive";
    case "major":
      return "warning";
    case "minor":
      return "secondary";
  }
}

function ServiceCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-20" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function SystemHealthPage() {
  const {
    data: status,
    isLoading: statusLoading,
    error: statusError,
    mutate: mutateStatus,
  } = useSystemStatus();
  const {
    data: services,
    isLoading: servicesLoading,
    error: servicesError,
    mutate: mutateServices,
  } = useServices();
  const {
    data: incidents,
    isLoading: incidentsLoading,
    error: incidentsError,
    mutate: mutateIncidents,
  } = useIncidents();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      mutateStatus();
      mutateServices();
      mutateIncidents();
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mutateStatus, mutateServices, mutateIncidents]);

  function handleRefresh() {
    mutateStatus();
    mutateServices();
    mutateIncidents();
  }

  const activeIncidents = incidents?.filter((i) => i.status !== "resolved") ?? [];

  return (
    <>
      <AdminHeader
        title="System Health"
        description="Monitor service status and active incidents"
      />

      <main className="p-6 space-y-6">
        {/* Refresh button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {status?.updated_at
              ? `Last updated: ${new Date(status.updated_at).toLocaleTimeString()}`
              : "Loading..."}
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {/* Overall status banner */}
        {statusLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : statusError ? (
          <ErrorState message={statusError} onRetry={mutateStatus} />
        ) : status ? (
          <Card className={`border ${statusBannerColor(status.status)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {statusLabel(status.status)}
                  </h2>
                  <p className="text-sm mt-1 opacity-80">{status.message}</p>
                </div>
                <div className="text-right text-sm">
                  <p>
                    {status.services_healthy}/{status.services_total} services healthy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Services grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          {servicesLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </div>
          ) : servicesError ? (
            <ErrorState message={servicesError} onRetry={mutateServices} />
          ) : !services || services.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No monitored services configured.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {services.map((svc) => (
                <Card key={svc.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium truncate">{svc.name}</h4>
                      <Badge variant={healthBadgeVariant(svc.health)}>
                        {svc.health}
                      </Badge>
                    </div>
                    {svc.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {svc.description}
                      </p>
                    )}
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-mono">{svc.latency_ms}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-mono">
                          {svc.uptime_percentage.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Check</span>
                        <span className="text-xs">
                          {new Date(svc.last_checked).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Active incidents */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Active Incidents</h3>
          {incidentsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : incidentsError ? (
            <ErrorState message={incidentsError} onRetry={mutateIncidents} />
          ) : activeIncidents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No active incidents. All systems are running normally.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{incident.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={incidentSeverityVariant(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                    </div>
                    <CardDescription>{incident.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span>
                          Started{" "}
                          {new Date(incident.started_at).toLocaleString()}
                        </span>
                      </div>
                      {incident.affected_services.length > 0 && (
                        <span>
                          Affecting: {incident.affected_services.join(", ")}
                        </span>
                      )}
                    </div>
                    {incident.updates && incident.updates.length > 0 && (
                      <div className="mt-3 space-y-2 border-t pt-3">
                        {incident.updates.slice(0, 3).map((update) => (
                          <div key={update.id} className="text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {update.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(update.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              {update.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
