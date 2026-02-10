"use client";

import { useState, useMemo } from "react";
import { ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, WorkflowTypeBadge } from "./status-badge";
import type { PipelineRun } from "@/lib/api/releases";

type StatusFilter = "all" | "success" | "failure" | "in_progress";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "failure", label: "Failed" },
  { value: "in_progress", label: "In Progress" },
];

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return "-";
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function PipelineRow({ run }: { run: PipelineRun }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm truncate">
              {run.serviceName}
            </p>
            <WorkflowTypeBadge type={run.workflowType} />
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {run.displayTitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {/* Status */}
        <StatusBadge status={run.status} />

        {/* Time */}
        <div className="text-right hidden sm:block min-w-[80px]">
          <p className="text-xs text-muted-foreground">
            {relativeTime(run.createdAt)}
          </p>
          {run.duration !== null && (
            <div className="flex items-center gap-1 justify-end">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {formatDuration(run.duration)}
              </p>
            </div>
          )}
        </div>

        {/* Commit */}
        <a
          href={run.commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {run.commitSha}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export function PipelinesTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}

export function PipelinesTab({ pipelines }: { pipelines: PipelineRun[] }) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [repoFilter, setRepoFilter] = useState("all");

  // Available repos
  const repos = useMemo(() => {
    const set = new Set<string>();
    for (const p of pipelines) {
      // Extract short repo name from commit URL or run URL
      const match = p.runUrl.match(/github\.com\/[^/]+\/([^/]+)/);
      if (match) set.add(match[1]);
    }
    return Array.from(set).sort();
  }, [pipelines]);

  const filtered = useMemo(() => {
    let result = pipelines;
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }
    if (repoFilter !== "all") {
      result = result.filter((p) => p.runUrl.includes(`/${repoFilter}/`));
    }
    return result;
  }, [pipelines, statusFilter, repoFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <FilterChip
              key={f.value}
              label={f.label}
              active={statusFilter === f.value}
              onClick={() => setStatusFilter(f.value)}
            />
          ))}
        </div>
        {repos.length > 1 && (
          <Select value={repoFilter} onValueChange={setRepoFilter}>
            <SelectTrigger className="w-[200px] h-9">
              <SelectValue placeholder="All repos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All repos</SelectItem>
              {repos.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Pipeline runs */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No pipeline runs match the selected filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((run) => (
            <PipelineRow key={run.id} run={run} />
          ))}
        </div>
      )}
    </div>
  );
}
