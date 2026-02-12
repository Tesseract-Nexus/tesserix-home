"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Search, Filter, MoreHorizontal, ExternalLink, ChevronRight, Globe } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableSkeleton } from "@/components/admin/table-skeleton";
import { ErrorState } from "@/components/admin/error-state";
import { EmptyState } from "@/components/admin/empty-state";
import { useTenants, type Tenant } from "@/lib/api/tenants";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "tesserix.app";

const APP_NAMES: Record<string, string> = {
  mark8ly: "Mark8ly",
};

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

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function AppTenantsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const appName = APP_NAMES[slug] || slug;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, mutate } = useTenants({
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    page,
    limit: 20,
  });

  const tenants = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <AdminHeader
        title={`${appName} Tenants`}
        description={`Manage tenants for ${appName}`}
      />

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href={`/admin/apps/${slug}`} className="hover:text-foreground transition-colors">
            {appName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Tenants</span>
        </nav>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {isLoading ? (
          <TableSkeleton columns={7} rows={5} />
        ) : error ? (
          <ErrorState message={error} onRetry={mutate} />
        ) : tenants.length === 0 ? (
          <EmptyState
            message="No tenants found"
            description={search ? "Try adjusting your search or filters" : undefined}
          />
        ) : (
          <>
            {/* Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenants.map((tenant: Tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell>
                        <Link
                          href={`/admin/apps/${slug}/${tenant.id}`}
                          className="font-medium hover:underline"
                        >
                          {tenant.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{tenant.slug}</p>
                      </TableCell>
                      <TableCell>
                        {tenant.custom_domain && tenant.use_custom_domain ? (
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://${tenant.custom_domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline text-sm"
                            >
                              <Globe className="h-3 w-3" />
                              {tenant.custom_domain}
                            </a>
                            <Badge variant="outline" className="text-xs px-1.5 py-0">Custom</Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {tenant.slug}.{BASE_DOMAIN}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{tenant.email || "-"}</TableCell>
                      <TableCell>
                        {tenant.status && (
                          <Badge variant={getStatusColor(tenant.status)}>
                            {tenant.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {tenant.plan ? (
                          <Badge variant="secondary">{tenant.plan}</Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tenant.created_at
                          ? new Date(tenant.created_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/apps/${slug}/${tenant.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {tenant.slug && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={`https://${tenant.slug}.${BASE_DOMAIN}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Visit Store
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {tenant.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">
                                Suspend Tenant
                              </DropdownMenuItem>
                            ) : tenant.status === "suspended" ? (
                              <DropdownMenuItem>
                                Activate Tenant
                              </DropdownMenuItem>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {tenants.length} of {total} tenants
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
