"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, MoreHorizontal, ExternalLink } from "lucide-react";
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

// Mock data
const tenants = [
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
  {
    id: "3",
    name: "Tech Gadgets",
    slug: "tech-gadgets",
    email: "support@techgadgets.io",
    status: "pending",
    plan: "professional",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    name: "Fashion Hub",
    slug: "fashion-hub",
    email: "hello@fashionhub.co",
    status: "active",
    plan: "enterprise",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    name: "Home Decor Plus",
    slug: "home-decor-plus",
    email: "info@homedecorplus.com",
    status: "suspended",
    plan: "starter",
    createdAt: "2024-01-10",
  },
];

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

function getPlanColor(plan: string) {
  switch (plan) {
    case "enterprise":
      return "default";
    case "professional":
      return "info";
    case "starter":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(search.toLowerCase()) ||
      tenant.slug.toLowerCase().includes(search.toLowerCase()) ||
      tenant.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <AdminHeader
        title="Tenants"
        description="Manage all tenant businesses"
      />

      <main className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <Link
                      href={`/tenants/${tenant.id}`}
                      className="font-medium hover:underline"
                    >
                      {tenant.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">{tenant.slug}</p>
                  </TableCell>
                  <TableCell>{tenant.email}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPlanColor(tenant.plan)}>
                      {tenant.plan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {tenant.createdAt}
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
                          <Link href={`/tenants/${tenant.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Store
                        </DropdownMenuItem>
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

          {filteredTenants.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No tenants found</p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTenants.length} of {tenants.length} tenants
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
