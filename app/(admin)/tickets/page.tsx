"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, MoreHorizontal, Clock } from "lucide-react";
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
const tickets = [
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
  {
    id: "TKT-003",
    subject: "Product import help needed",
    tenant: "Tech Gadgets",
    tenantId: "3",
    status: "open",
    priority: "low",
    createdAt: "2024-01-13 16:45",
    lastUpdated: "2024-01-13 16:45",
  },
  {
    id: "TKT-004",
    subject: "API rate limit question",
    tenant: "Fashion Hub",
    tenantId: "4",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-12 08:00",
    lastUpdated: "2024-01-14 15:30",
  },
  {
    id: "TKT-005",
    subject: "Account access issue",
    tenant: "Home Decor Plus",
    tenantId: "5",
    status: "closed",
    priority: "high",
    createdAt: "2024-01-10 11:20",
    lastUpdated: "2024-01-11 09:15",
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "info";
    case "in-progress":
      return "warning";
    case "resolved":
      return "success";
    case "closed":
      return "secondary";
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

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase()) ||
      ticket.tenant.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <>
      <AdminHeader
        title="Support Tickets"
        description="Manage support requests from tenants"
      />

      <main className="p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
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
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono text-sm">
                    {ticket.id}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-medium hover:underline"
                    >
                      {ticket.subject}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/tenants/${ticket.tenantId}`}
                      className="text-muted-foreground hover:text-foreground hover:underline"
                    >
                      {ticket.tenant}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {ticket.lastUpdated}
                    </div>
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
                          <Link href={`/tickets/${ticket.id}`}>
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {ticket.status === "open" && (
                          <DropdownMenuItem>
                            Mark as In Progress
                          </DropdownMenuItem>
                        )}
                        {ticket.status === "in-progress" && (
                          <DropdownMenuItem>
                            Mark as Resolved
                          </DropdownMenuItem>
                        )}
                        {ticket.status === "resolved" && (
                          <DropdownMenuItem>
                            Close Ticket
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No tickets found</p>
            </div>
          )}
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTickets.length} of {tickets.length} tickets
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
