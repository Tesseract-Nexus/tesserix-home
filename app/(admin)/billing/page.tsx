"use client";

import { useState } from "react";
import { RefreshCw, Check, X, Zap, Crown, Rocket, Building2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import {
  usePlans,
  syncPlansToStripe,
  type SubscriptionPlan,
} from "@/lib/api/subscriptions";

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
        {/* Pricing */}
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

        {/* Limits */}
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

        {/* Features */}
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

        {/* Stripe sync status */}
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

export default function BillingPlansPage() {
  const { data: plans, isLoading, error, mutate } = usePlans();
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
        description="Manage billing plans for your platform tenants"
      />

      <main className="p-6 space-y-6">
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
