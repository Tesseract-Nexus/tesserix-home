"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import {
  useEmailTemplates,
  useNotifications,
  type TemplateStatus,
  type NotificationStatus,
  type Notification,
} from "@/lib/api/email-templates";

function templateStatusVariant(status: TemplateStatus): "success" | "destructive" | "secondary" {
  switch (status) {
    case "active":
      return "success";
    case "inactive":
      return "destructive";
    case "draft":
    default:
      return "secondary";
  }
}

function notificationStatusVariant(status: NotificationStatus): "success" | "destructive" | "warning" | "secondary" {
  switch (status) {
    case "sent":
      return "success";
    case "failed":
    case "bounced":
      return "destructive";
    case "pending":
      return "warning";
    default:
      return "secondary";
  }
}

function NotificationDetailDialog({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notification Detail</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Recipient</p>
            <p className="font-medium">{notification.recipient}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Subject</p>
            <p className="font-medium">{notification.subject}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant={notificationStatusVariant(notification.status)}>
              {notification.status}
            </Badge>
          </div>
          {notification.template_name && (
            <div>
              <p className="text-muted-foreground">Template</p>
              <p className="font-medium">{notification.template_name}</p>
            </div>
          )}
          {notification.sent_at && (
            <div>
              <p className="text-muted-foreground">Sent At</p>
              <p className="font-medium">
                {new Date(notification.sent_at).toLocaleString()}
              </p>
            </div>
          )}
          {notification.delivered_at && (
            <div>
              <p className="text-muted-foreground">Delivered At</p>
              <p className="font-medium">
                {new Date(notification.delivered_at).toLocaleString()}
              </p>
            </div>
          )}
          {notification.error_message && (
            <div>
              <p className="text-muted-foreground">Error</p>
              <p className="text-destructive">{notification.error_message}</p>
            </div>
          )}
          {notification.metadata &&
            Object.keys(notification.metadata).length > 0 && (
              <div>
                <p className="text-muted-foreground mb-1">Metadata</p>
                <pre className="rounded-md bg-muted p-3 text-xs overflow-x-auto">
                  {JSON.stringify(notification.metadata, null, 2)}
                </pre>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default function EmailTemplatesPage() {
  const [activeTab, setActiveTab] = useState<"templates" | "notifications">(
    "templates"
  );
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
    mutate: mutateTemplates,
  } = useEmailTemplates();
  const {
    data: notifications,
    isLoading: notificationsLoading,
    error: notificationsError,
    mutate: mutateNotifications,
  } = useNotifications();

  return (
    <>
      <AdminHeader
        title="Email Templates"
        description="Manage email templates and view notification logs"
      />

      <main className="p-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 border-b">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "templates"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "notifications"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              Notification Log
            </button>
          </div>
          {activeTab === "templates" && (
            <Link href="/admin/email-templates/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Template
              </Button>
            </Link>
          )}
        </div>

        {activeTab === "templates" && (
          <>
            {templatesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : templatesError ? (
              <ErrorState
                message={templatesError}
                onRetry={mutateTemplates}
              />
            ) : !templates || templates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No email templates yet.
                  </p>
                  <Link href="/admin/email-templates/new">
                    <Button variant="outline" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Create your first template
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Subject
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Updated
                      </th>
                      <th className="h-10 px-4 text-right font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates.map((template) => (
                      <tr
                        key={template.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/email-templates/${template.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {template.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {template.type}
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          {template.subject}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={templateStatusVariant(template.status)}
                          >
                            {template.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {template.updated_at
                            ? new Date(
                                template.updated_at
                              ).toLocaleDateString()
                            : "\u2014"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link href={`/admin/email-templates/${template.id}`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "notifications" && (
          <>
            {notificationsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : notificationsError ? (
              <ErrorState
                message={notificationsError}
                onRetry={mutateNotifications}
              />
            ) : !notifications || notifications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No notifications sent yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Recipient
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Subject
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Template
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-10 px-4 text-left font-medium text-muted-foreground">
                        Sent At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notif) => (
                      <tr
                        key={notif.id}
                        className="border-b hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => setSelectedNotification(notif)}
                      >
                        <td className="px-4 py-3">{notif.recipient}</td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          {notif.subject}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {notif.template_name || "\u2014"}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={notificationStatusVariant(notif.status)}
                          >
                            {notif.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {notif.sent_at
                            ? new Date(notif.sent_at).toLocaleString()
                            : "\u2014"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Notification Detail Dialog */}
        {selectedNotification && (
          <NotificationDetailDialog
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
      </main>
    </>
  );
}
