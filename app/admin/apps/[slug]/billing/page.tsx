"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Check,
  X,
  Zap,
  Crown,
  Rocket,
  Building2,
  ChevronRight,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  CalendarClock,
  Receipt,
  ExternalLink,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  usePlans,
  syncPlansToStripe,
  useEnhancedStats,
  useExpiringTrials,
  useAdminInvoices,
  extendTrial,
  type SubscriptionPlan,
  type EnhancedStats,
  type ExpiringTrial,
  type SubscriptionInvoice,
} from "@/lib/api/subscriptions";

const APP_NAMES: Record<string, string> = {
  mark8ly: "Mark8ly",
};

function getPlanIcon(name: string) {
  switch (name) {
    case "free":
      return <Zap className="h-6 w-6" />;
    case "starter":
      return <Rocket className="h-6 w-6" />;
    case "professional":
      return <Crown className="h-6 w-6" />;
    case "enterprise":
      return <Building2 className="h-6 w-6" />;
    default:
      return <Zap className="h-6 w-6" />;
  }
}

function formatCents(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

function formatStorage(mb: number): string {
  if (mb === -1) return "Unlimited";
  if (mb >= 1024) return `${(mb / 1024).toFixed(0)}GB`;
  return `${mb}MB`;
}

function formatLimit(value: number): string {
  if (value === -1) return "Unlimited";
  return value.toLocaleString();
}

function formatMrr(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getDaysLeft(trialEnd?: string): number {
  if (!trialEnd) return 0;
  const end = new Date(trialEnd);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ---------- KPI Section ----------

function KpiCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

function KpiCards({ stats }: { stats: EnhancedStats | null }) {
  if (!stats) return null;

  const kpis = [
    {
      title: "Active",
      value: stats.active_subscriptions,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Trialing",
      value: stats.trialing_subscriptions,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Expiring Soon (7d)",
      value: stats.expiringTrials7d,
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    },
    {
      title: "Suspended",
      value: stats.suspendedCount,
      icon: <ShieldAlert className="h-4 w-4 text-destructive" />,
    },
    {
      title: "MRR",
      value: formatMrr(stats.mrr),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      isFormatted: true,
    },
    {
      title: "Conversion Rate",
      value: `${stats.trialConversionRate.toFixed(1)}%`,
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      isFormatted: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            {kpi.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpi.isFormatted ? kpi.value : Number(kpi.value).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---------- Extend Trial Dialog ----------

function ExtendTrialDialog({
  trial,
  open,
  onOpenChange,
  onSuccess,
}: {
  trial: ExpiringTrial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [days, setDays] = useState<number>(14);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!trial) return;
    if (days < 1 || days > 365) {
      setError("Days must be between 1 and 365");
      return;
    }
    if (!reason.trim()) {
      setError("A reason is required");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await extendTrial(trial.tenant_id, days, reason.trim());

    setSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setDays(14);
      setReason("");
      onOpenChange(false);
      onSuccess();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend Trial</DialogTitle>
          <DialogDescription>
            Extend the trial period for tenant {trial?.tenant_id?.slice(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="extend-days">Additional Days</Label>
            <Input
              id="extend-days"
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Enter a value between 1 and 365 days.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extend-reason">Reason</Label>
            <Textarea
              id="extend-reason"
              placeholder="Why is this trial being extended?"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Extending..." : "Extend Trial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Recent Payments Section ----------

const INVOICE_STATUSES = [
  { label: "All", value: "" },
  { label: "Paid", value: "paid" },
  { label: "Open", value: "open" },
  { label: "Void", value: "void" },
  { label: "Draft", value: "draft" },
];

function formatAmountCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function invoiceStatusVariant(status: string): "success" | "warning" | "secondary" {
  switch (status) {
    case "paid":
      return "success";
    case "open":
      return "warning";
    default:
      return "secondary";
  }
}

function RecentPaymentsSection() {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;
  const { data, isLoading, error, mutate } = useAdminInvoices(
    statusFilter || undefined,
    PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // Reset to page 0 when filter changes
  function handleStatusChange(value: string) {
    setStatusFilter(value);
    setPage(0);
  }

  const invoices = data?.invoices ?? [];
  const total = data?.total ?? 0;
  const rangeStart = total > 0 ? page * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min((page + 1) * PAGE_SIZE, total);
  const hasNext = (page + 1) * PAGE_SIZE < total;
  const hasPrev = page > 0;

  if (error) {
    return <ErrorState message={error} onRetry={mutate} />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>
              Invoice payments across all tenants
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status filter */}
        <div className="flex flex-wrap gap-1">
          {INVOICE_STATUSES.map((s) => (
            <Button
              key={s.value}
              variant={statusFilter === s.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No invoices found.
          </p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv: SubscriptionInvoice) => (
                  <TableRow key={inv.id}>
                    <TableCell>{formatDate(inv.created_at)}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {inv.tenant_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>{formatAmountCents(inv.amount_due_cents)}</TableCell>
                    <TableCell>
                      <Badge variant={invoiceStatusVariant(inv.status)}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.stripe_hosted_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={inv.stripe_hosted_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        {inv.stripe_invoice_pdf && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={inv.stripe_invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              PDF
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Showing {rangeStart}-{rangeEnd} of {total}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={!hasPrev}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Expiring Trials Table ----------

function ExpiringTrialsSection() {
  const { data: trials, isLoading, error, mutate } = useExpiringTrials(30);
  const [selectedTrial, setSelectedTrial] = useState<ExpiringTrial | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleExtendClick(trial: ExpiringTrial) {
    setSelectedTrial(trial);
    setDialogOpen(true);
  }

  function handleExtendSuccess() {
    mutate();
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={mutate} />;
  }

  const sorted = trials
    ? [...trials].sort((a, b) => {
        const aEnd = a.trial_end ? new Date(a.trial_end).getTime() : Infinity;
        const bEnd = b.trial_end ? new Date(b.trial_end).getTime() : Infinity;
        return aEnd - bEnd;
      })
    : [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-500" />
            <div>
              <CardTitle>Expiring Trials</CardTitle>
              <CardDescription>
                Tenants with trials ending within the next 30 days
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No trials expiring in the next 30 days.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant ID</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Trial Ends</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((trial) => {
                  const daysLeft = getDaysLeft(trial.trial_end);
                  return (
                    <TableRow key={trial.id}>
                      <TableCell className="font-mono text-sm">
                        {trial.tenant_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {trial.plan?.display_name || trial.plan_id.slice(0, 8)}
                      </TableCell>
                      <TableCell>{formatDate(trial.trial_end)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={daysLeft <= 3 ? "destructive" : daysLeft <= 7 ? "warning" : "secondary"}
                        >
                          {daysLeft} {daysLeft === 1 ? "day" : "days"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExtendClick(trial)}
                        >
                          Extend Trial
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ExtendTrialDialog
        trial={selectedTrial}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleExtendSuccess}
      />
    </>
  );
}

// ---------- Plan Cards ----------

function PlanCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );
}

function PlanCard({ plan }: { plan: SubscriptionPlan }) {
  const features = plan.features || {};
  const featureList = Object.entries(features).filter(([, v]) => v);
  const isStripeSynced = !!plan.stripe_product_id;

  return (
    <Card className={!plan.is_active ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {getPlanIcon(plan.name)}
            </div>
            <div>
              <CardTitle className="text-lg">{plan.display_name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {plan.is_free && <Badge variant="secondary">Free</Badge>}
            {plan.is_active ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold">{formatCents(plan.monthly_price_cents)}</span>
            {!plan.is_free && <span className="text-muted-foreground">/mo</span>}
          </div>
          {!plan.is_free && (
            <p className="text-sm text-muted-foreground">
              {formatCents(plan.yearly_price_cents)}/yr (save {Math.round((1 - plan.yearly_price_cents / (plan.monthly_price_cents * 12)) * 100)}%)
            </p>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Products</span>
            <span className="font-medium">{formatLimit(plan.max_products)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Users</span>
            <span className="font-medium">{formatLimit(plan.max_users)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">{formatStorage(plan.max_storage_mb)}</span>
          </div>
          {plan.trial_days > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trial</span>
              <span className="font-medium">{plan.trial_days} days</span>
            </div>
          )}
        </div>

        {featureList.length > 0 && (
          <div className="space-y-1.5 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">Features</p>
            {featureList.map(([feature]) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-green-500" />
                <span>{feature.replace(/_/g, " ")}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 text-sm">
            {isStripeSynced ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Synced to Stripe</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-amber-500" />
                <span className="text-muted-foreground">Not synced to Stripe</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------- Main Page ----------

export default function AppBillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const appName = APP_NAMES[slug] || slug;
  const { data: plans, isLoading, error, mutate } = usePlans();
  const { data: enhancedStats, isLoading: statsLoading } = useEnhancedStats();
  const [syncing, setSyncing] = useState(false);

  async function handleSyncToStripe() {
    setSyncing(true);
    const result = await syncPlansToStripe();
    setSyncing(false);
    if (!result.error) {
      mutate();
    }
  }

  return (
    <>
      <AdminHeader
        title="Subscription Plans"
        description={`Manage billing plans for ${appName} tenants`}
      />

      <main className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          <Link href={`/admin/apps/${slug}`} className="hover:text-foreground transition-colors">
            {appName}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Billing</span>
        </nav>

        {/* KPI Row */}
        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <KpiCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <KpiCards stats={enhancedStats} />
        )}

        {/* Recent Payments */}
        <RecentPaymentsSection />

        {/* Expiring Trials */}
        <ExpiringTrialsSection />

        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {plans ? `${plans.length} plans configured` : "Loading..."}
          </p>
          <Button
            onClick={handleSyncToStripe}
            disabled={syncing}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync to Stripe"}
          </Button>
        </div>

        {/* Plans grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={mutate} />
        ) : !plans || plans.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No subscription plans configured yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Plans are seeded automatically when the subscription service starts.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
          </div>
        )}
      </main>
    </>
  );
}
