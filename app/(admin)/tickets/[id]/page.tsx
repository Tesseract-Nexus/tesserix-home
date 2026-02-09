"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, User, Building2, Send } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ErrorState } from "@/components/admin/error-state";
import { useTicket, updateTicketStatus, addTicketComment, type TicketComment } from "@/lib/api/tickets";

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "open":
      return "info";
    case "in_progress":
    case "in-progress":
      return "warning";
    case "resolved":
      return "success";
    case "closed":
      return "secondary";
    case "escalated":
      return "destructive";
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

function formatStatus(status: string) {
  return status?.toLowerCase().replace(/_/g, " ") || "";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
          <CardContent><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: ticket, isLoading, error, mutate } = useTicket(id);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentStatus = ticket?.status?.toLowerCase() || "open";

  async function handleStatusChange(newStatus: string) {
    const { error } = await updateTicketStatus(id, newStatus);
    if (!error) {
      mutate();
    }
  }

  async function handleSubmitComment() {
    if (!newComment.trim() || submitting) return;

    setSubmitting(true);
    const { error } = await addTicketComment(id, newComment.trim());
    setSubmitting(false);

    if (!error) {
      setNewComment("");
      mutate();
    }
  }

  return (
    <>
      <AdminHeader title={ticket ? `Ticket ${ticket.ticket_number || ticket.id}` : "Ticket"} />

      <main className="p-6 space-y-6">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>

        {isLoading ? (
          <DetailSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={mutate} />
        ) : !ticket ? (
          <ErrorState message="Ticket not found" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ticket details */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{ticket.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Created{" "}
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleString()
                          : ""}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(ticket.priority)}>
                        {ticket.priority?.toLowerCase()}
                      </Badge>
                      <Badge variant={getStatusColor(ticket.status)}>
                        {formatStatus(ticket.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">
                    {ticket.description || "No description provided."}
                  </p>
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {ticket.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>
                    Communication history for this ticket
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {ticket.comments && ticket.comments.length > 0 ? (
                    ticket.comments.map((comment: TicketComment) => {
                      const authorName = comment.author?.name || comment.created_by_name || "Unknown";
                      const authorRole = comment.author?.role || "user";
                      return (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(authorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{authorName}</span>
                              <Badge
                                variant={authorRole === "admin" ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {authorRole}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {comment.created_at
                                  ? new Date(comment.created_at).toLocaleString()
                                  : ""}
                              </span>
                            </div>
                            <p className="mt-1 text-foreground">{comment.content}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">No comments yet.</p>
                  )}

                  <Separator />

                  {/* New comment form */}
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write a reply..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim() || submitting}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? "Sending..." : "Send Reply"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={currentStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Ticket info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ticket.tenant_id && (
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Tenant</p>
                        <Link
                          href={`/tenants/${ticket.tenant_id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {ticket.tenant_name || ticket.tenant_id}
                        </Link>
                      </div>
                    </div>
                  )}
                  {(ticket.created_by_name || ticket.created_by_email) && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created by</p>
                        <p className="font-medium">{ticket.created_by_name}</p>
                        {ticket.created_by_email && (
                          <p className="text-xs text-muted-foreground">
                            {ticket.created_by_email}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="font-medium">
                        {ticket.created_at
                          ? new Date(ticket.created_at).toLocaleString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  {ticket.type && (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4" />
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary">
                          {ticket.type.toLowerCase().replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
