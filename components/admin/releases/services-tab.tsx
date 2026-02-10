"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Rocket,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./status-badge";
import type { ServiceInfo, BuildStatus } from "@/lib/api/releases";
import type { ServiceType } from "@/lib/releases/services";

type TypeFilter = "all" | ServiceType;

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "backend", label: "Backend" },
  { value: "frontend", label: "Frontend" },
  { value: "mfe", label: "MFE" },
];

function FilterChip({
  label,
  active,
  count,
  onClick,
}: {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
            active
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-background text-muted-foreground"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface RepoGroup {
  repo: string;
  repoShort: string;
  services: ServiceInfo[];
}

function groupByRepo(services: ServiceInfo[]): RepoGroup[] {
  const map = new Map<string, ServiceInfo[]>();
  for (const svc of services) {
    const key = svc.repo || "unknown";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(svc);
  }
  return Array.from(map.entries()).map(([repo, svcs]) => ({
    repo,
    repoShort: repo.split("/").pop() ?? repo,
    services: svcs,
  }));
}

function repoGroupStatus(services: ServiceInfo[]): BuildStatus {
  if (services.some((s) => s.latestBuild?.status === "failure")) return "failure";
  if (services.some((s) => s.latestBuild?.status === "in_progress")) return "in_progress";
  if (services.every((s) => s.latestBuild?.status === "success")) return "success";
  return "none";
}

function ServiceRow({
  service,
  onPromote,
}: {
  service: ServiceInfo;
  onPromote: (svc: ServiceInfo) => void;
}) {
  const canPromote = !!service.repo;
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">{service.displayName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="secondary" className="text-xs">
              {service.type}
            </Badge>
          </div>
        </div>
      </div>

      {/* Build status */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block min-w-[120px]">
          {service.latestBuild ? (
            <div className="space-y-0.5">
              <StatusBadge status={service.latestBuild.status} />
              <p className="text-xs text-muted-foreground truncate">
                {service.latestBuild.tag}
              </p>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>

        {/* Release version */}
        <div className="text-right hidden md:block min-w-[100px]">
          {service.latestRelease ? (
            <div className="space-y-0.5">
              <Badge variant="outline" className="font-mono text-xs">
                v{service.latestRelease.version}
              </Badge>
              {service.latestRelease.status !== "none" && (
                <StatusBadge status={service.latestRelease.status} />
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">-</span>
          )}
        </div>

        {/* Promote */}
        <Button
          variant="outline"
          size="sm"
          disabled={!canPromote}
          onClick={() => onPromote(service)}
          className="shrink-0"
        >
          <Rocket className="h-3.5 w-3.5 mr-1" />
          Promote
        </Button>
      </div>
    </div>
  );
}

function RepoGroupSection({
  group,
  onPromote,
  defaultExpanded,
}: {
  group: RepoGroup;
  onPromote: (svc: ServiceInfo) => void;
  defaultExpanded: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const status = repoGroupStatus(group.services);
  const failed = group.services.filter(
    (s) => s.latestBuild?.status === "failure"
  ).length;

  return (
    <Card>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <h4 className="text-sm font-semibold">{group.repoShort}</h4>
          <span className="text-xs text-muted-foreground">
            {group.services.length} services
          </span>
        </div>
        <div className="flex items-center gap-2">
          {failed > 0 && (
            <Badge variant="destructive">{failed} failed</Badge>
          )}
          {status === "success" && (
            <Badge variant="success">All passing</Badge>
          )}
          {status === "in_progress" && (
            <Badge variant="warning">Building</Badge>
          )}
        </div>
      </button>
      {expanded && (
        <CardContent className="pt-0 pb-4 px-4">
          <div className="space-y-2">
            {group.services.map((svc) => (
              <ServiceRow
                key={svc.name}
                service={svc}
                onPromote={onPromote}
              />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function ServicesTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  );
}

export function ServicesTab({
  services,
  onPromote,
}: {
  services: ServiceInfo[];
  onPromote: (svc: ServiceInfo) => void;
}) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = services;
    if (typeFilter !== "all") {
      result = result.filter((s) => s.type === typeFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.displayName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [services, typeFilter, search]);

  const groups = useMemo(() => groupByRepo(filtered), [filtered]);

  // Stats
  const failedBuilds = services.filter(
    (s) => s.latestBuild?.status === "failure"
  ).length;
  const inProgress = services.filter(
    (s) => s.latestBuild?.status === "in_progress"
  ).length;
  const successBuilds = services.filter(
    (s) => s.latestBuild?.status === "success"
  ).length;

  // Type counts
  const typeCounts: Record<TypeFilter, number> = {
    all: services.length,
    backend: services.filter((s) => s.type === "backend").length,
    frontend: services.filter((s) => s.type === "frontend").length,
    mfe: services.filter((s) => s.type === "mfe").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{successBuilds}</p>
                <p className="text-xs text-muted-foreground">Passing Builds</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{failedBuilds}</p>
                <p className="text-xs text-muted-foreground">Failed Builds</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                <Loader2 className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgress}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={typeFilter === f.value}
              count={typeCounts[f.value]}
              onClick={() => setTypeFilter(f.value)}
            />
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Service groups */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No services match the selected filters.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setTypeFilter("all");
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        groups.map((group) => (
          <RepoGroupSection
            key={group.repo}
            group={group}
            onPromote={onPromote}
            defaultExpanded={groups.length <= 4}
          />
        ))
      )}
    </div>
  );
}
