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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data
const ticketData: Record<string, {
  id: string;
  subject: string;
  description: string;
  tenant: { id: string; name: string };
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "high" | "medium" | "low";
  createdAt: string;
  createdBy: { name: string; email: string };
  comments: Array<{
    id: string;
    author: { name: string; email: string; role: "tenant" | "admin" };
    content: string;
    createdAt: string;
  }>;
}> = {
  "TKT-001": {
    id: "TKT-001",
    subject: "Payment integration issue",
    description:
      "We are experiencing issues with our Stripe integration. Payments are failing with error code 'card_declined' even for valid test cards. This started happening after the latest update. We need urgent help as it's affecting our live transactions.",
    tenant: { id: "1", name: "Acme Store" },
    status: "open",
    priority: "high",
    createdAt: "2024-01-15 10:30",
    createdBy: { name: "John Doe", email: "john@acme-store.com" },
    comments: [
      {
        id: "1",
        author: { name: "John Doe", email: "john@acme-store.com", role: "tenant" },
        content:
          "I've attached the error logs from our payment gateway. The issue seems to be happening only for international cards.",
        createdAt: "2024-01-15 11:00",
      },
      {
        id: "2",
        author: { name: "Support Team", email: "support@tesserix.com", role: "admin" },
        content:
          "Thank you for reporting this issue. We're investigating the logs you provided. Could you confirm which Stripe API version you're using?",
        createdAt: "2024-01-15 14:22",
      },
    ],
  },
};

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

export default function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const ticket = ticketData[id] || ticketData["TKT-001"]; // Fallback for demo
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState(ticket.status);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    // In a real app, this would submit to the API
    console.log("Submitting comment:", newComment);
    setNewComment("");
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as typeof status);
    // In a real app, this would update the ticket status via API
  };

  return (
    <>
      <AdminHeader title={`Ticket ${ticket.id}`} />

      <main className="p-6 space-y-6">
        {/* Back link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tickets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{ticket.subject}</CardTitle>
                    <CardDescription className="mt-1">
                      Created on {ticket.createdAt}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={getStatusColor(status)}>{status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {ticket.description}
                </p>
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
                {ticket.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {comment.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{comment.author.name}</span>
                        <Badge
                          variant={comment.author.role === "admin" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {comment.author.role}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {comment.createdAt}
                        </span>
                      </div>
                      <p className="mt-1 text-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}

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
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
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
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
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
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tenant</p>
                    <Link
                      href={`/tenants/${ticket.tenant.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {ticket.tenant.name}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created by</p>
                    <p className="font-medium">{ticket.createdBy.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {ticket.createdBy.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-medium">{ticket.createdAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
