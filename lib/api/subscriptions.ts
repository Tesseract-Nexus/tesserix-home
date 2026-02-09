"use client";

import { useApi, apiFetch } from './use-api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  monthly_price_cents: number;
  yearly_price_cents: number;
  currency: string;
  stripe_product_id?: string;
  stripe_monthly_price_id?: string;
  stripe_yearly_price_id?: string;
  max_products: number;
  max_users: number;
  max_storage_mb: number;
  features?: Record<string, boolean>;
  sort_order: number;
  is_active: boolean;
  is_free: boolean;
  trial_days: number;
  created_at?: string;
  updated_at?: string;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  plan?: SubscriptionPlan;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  billing_interval: 'monthly' | 'yearly';
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  cancel_at_period_end: boolean;
  canceled_at?: string;
  billing_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriptionInvoice {
  id: string;
  tenant_id: string;
  subscription_id?: string;
  stripe_invoice_id?: string;
  stripe_hosted_url?: string;
  stripe_invoice_pdf?: string;
  status: 'draft' | 'open' | 'paid' | 'void';
  amount_due_cents: number;
  amount_paid_cents: number;
  currency: string;
  period_start?: string;
  period_end?: string;
  paid_at?: string;
  description?: string;
  created_at?: string;
}

export interface SubscriptionStats {
  mrr: number;
  active_subscriptions: number;
  trialing_subscriptions: number;
  past_due_subscriptions: number;
  canceled_subscriptions: number;
  total_revenue_cents: number;
}

// Hooks

export function usePlans() {
  return useApi<SubscriptionPlan[]>('/api/subscriptions/plans');
}

export function useTenantSubscription(tenantId: string | null) {
  return useApi<TenantSubscription>(tenantId ? `/api/subscriptions/${tenantId}` : null);
}

export function useTenantInvoices(tenantId: string | null) {
  return useApi<SubscriptionInvoice[]>(tenantId ? `/api/subscriptions/${tenantId}/invoices` : null);
}

export function useSubscriptionStats() {
  return useApi<SubscriptionStats>('/api/subscriptions/stats');
}

// Mutations

export async function createPlan(data: Partial<SubscriptionPlan>) {
  return apiFetch<SubscriptionPlan>('/api/subscriptions/plans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePlan(id: string, data: Partial<SubscriptionPlan>) {
  return apiFetch<SubscriptionPlan>(`/api/subscriptions/plans/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePlan(id: string) {
  return apiFetch(`/api/subscriptions/plans/${id}`, {
    method: 'DELETE',
  });
}

export async function syncPlansToStripe() {
  return apiFetch('/api/subscriptions/plans/sync-stripe', {
    method: 'POST',
  });
}

export async function createCheckoutSession(tenantId: string, planId: string, billingInterval: string) {
  return apiFetch<{ checkout_url: string }>('/api/subscriptions/checkout', {
    method: 'POST',
    body: JSON.stringify({ tenant_id: tenantId, plan_id: planId, billing_interval: billingInterval }),
  });
}

export async function createPortalSession(tenantId: string) {
  return apiFetch<{ portal_url: string }>('/api/subscriptions/portal', {
    method: 'POST',
    body: JSON.stringify({ tenant_id: tenantId }),
  });
}

export async function cancelSubscription(tenantId: string) {
  return apiFetch(`/api/subscriptions/${tenantId}/cancel`, {
    method: 'POST',
  });
}

export async function reactivateSubscription(tenantId: string) {
  return apiFetch(`/api/subscriptions/${tenantId}/reactivate`, {
    method: 'POST',
  });
}

export async function changePlan(tenantId: string, planId: string) {
  return apiFetch(`/api/subscriptions/${tenantId}/change-plan`, {
    method: 'PUT',
    body: JSON.stringify({ plan_id: planId }),
  });
}
