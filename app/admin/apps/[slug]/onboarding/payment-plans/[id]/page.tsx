"use client";

import { useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, GripVertical, Star } from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/admin/error-state";
import {
  useOnboardingItem,
  updateOnboardingItem,
  type PaymentPlan,
  type PlanFeature,
} from "@/lib/api/onboarding-content";
import { apiFetch } from "@/lib/api/use-api";

const BASE_PATH = "/api/onboarding-content";

export default function PaymentPlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = use(params);
  const router = useRouter();
  const { data, isLoading, error, mutate } = useOnboardingItem("payment-plans", id);
  const plan = data?.data as PaymentPlan | undefined;

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<PaymentPlan> | null>(null);

  // Initialize form when data loads
  const form = formData ?? plan;

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setFormData((prev) => ({ ...(prev ?? plan), [field]: value } as Partial<PaymentPlan>));
    },
    [plan]
  );

  const handleSave = useCallback(async () => {
    if (!form) return;
    setSaving(true);
    try {
      const { name, slug: planSlug, price, currency, billingCycle, trialDays, description, tagline, featured, sortOrder, active } = form;
      const { error: err } = await updateOnboardingItem("payment-plans", id, {
        name, slug: planSlug, price, currency, billingCycle, trialDays, description, tagline, featured, sortOrder, active,
      });
      if (err) alert(err);
      else mutate();
    } finally {
      setSaving(false);
    }
  }, [form, id, mutate]);

  // Feature management
  const [newFeature, setNewFeature] = useState("");

  const addFeature = useCallback(async () => {
    if (!newFeature.trim()) return;
    const maxOrder = plan?.features?.reduce((max, f) => Math.max(max, f.sortOrder), -1) ?? -1;
    const { error: err } = await apiFetch(`${BASE_PATH}/payment-plans/${id}/features`, {
      method: "POST",
      body: JSON.stringify({ feature: newFeature.trim(), sortOrder: maxOrder + 1 }),
    });
    if (!err) {
      setNewFeature("");
      mutate();
    }
  }, [newFeature, id, plan, mutate]);

  const removeFeature = useCallback(
    async (featureId: string) => {
      await apiFetch(`${BASE_PATH}/payment-plans/${id}/features/${featureId}`, {
        method: "DELETE",
      });
      mutate();
    },
    [id, mutate]
  );

  const toggleHighlight = useCallback(
    async (feature: PlanFeature) => {
      await apiFetch(`${BASE_PATH}/payment-plans/${id}/features/${feature.id}`, {
        method: "PUT",
        body: JSON.stringify({ highlighted: !feature.highlighted }),
      });
      mutate();
    },
    [id, mutate]
  );

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Payment Plan" />
        <main className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </main>
      </>
    );
  }

  if (error || !plan) {
    return (
      <>
        <AdminHeader title="Payment Plan" />
        <main className="p-6">
          <ErrorState message={error || "Plan not found"} onRetry={mutate} />
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={plan.name} description="Edit payment plan details and features" />

      <main className="p-6 space-y-6">
        <Link
          href={`/admin/apps/${slug}/onboarding`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Onboarding
        </Link>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={form?.name || ""} onChange={(e) => updateField("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form?.slug || ""} onChange={(e) => updateField("slug", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input value={form?.price || ""} onChange={(e) => updateField("price", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Input value={form?.currency || "INR"} onChange={(e) => updateField("currency", e.target.value)} maxLength={3} />
                </div>
                <div className="space-y-2">
                  <Label>Billing Cycle</Label>
                  <Select value={form?.billingCycle || "monthly"} onValueChange={(v) => updateField("billingCycle", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                      <SelectItem value="one_time">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Trial Days</Label>
                  <Input type="number" value={form?.trialDays ?? 0} onChange={(e) => updateField("trialDays", parseInt(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={form?.sortOrder ?? 0} onChange={(e) => updateField("sortOrder", parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={form?.tagline || ""} onChange={(e) => updateField("tagline", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form?.description || ""} onChange={(e) => updateField("description", e.target.value)} rows={3} />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form?.featured || false} onChange={(e) => updateField("featured", e.target.checked)} className="rounded" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form?.active !== false} onChange={(e) => updateField("active", e.target.checked)} className="rounded" />
                  Active
                </label>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Features ({plan.features?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature} size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {plan.features?.length ? (
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-2 rounded-md border px-3 py-2"
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 text-sm">{feature.feature}</span>
                      {feature.highlighted && (
                        <Badge variant="warning" className="shrink-0">Highlighted</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => toggleHighlight(feature)}
                        title={feature.highlighted ? "Remove highlight" : "Highlight"}
                      >
                        <Star className={`h-3.5 w-3.5 ${feature.highlighted ? "fill-yellow-500 text-yellow-500" : ""}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive shrink-0"
                        onClick={() => removeFeature(feature.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No features added yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
