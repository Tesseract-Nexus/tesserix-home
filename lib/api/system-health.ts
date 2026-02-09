"use client";

import { useApi } from './use-api';

export type OverallStatus = 'operational' | 'degraded' | 'outage';
export type ServiceHealth = 'healthy' | 'unhealthy' | 'degraded' | 'unknown';

export interface SystemStatus {
  status: OverallStatus;
  message: string;
  updated_at: string;
  services_total: number;
  services_healthy: number;
  services_unhealthy: number;
  services_degraded: number;
}

export interface MonitoredService {
  id: string;
  name: string;
  description?: string;
  health: ServiceHealth;
  latency_ms: number;
  uptime_percentage: number;
  last_checked: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affected_services: string[];
  started_at: string;
  resolved_at?: string;
  updates?: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  status: string;
  message: string;
  created_at: string;
}

// Hooks

export function useSystemStatus() {
  return useApi<SystemStatus>('/api/system-health/status');
}

export function useServices() {
  return useApi<MonitoredService[]>('/api/system-health/services');
}

export function useService(id: string | null) {
  return useApi<MonitoredService>(id ? `/api/system-health/services/${id}` : null);
}

export function useIncidents() {
  return useApi<Incident[]>('/api/system-health/incidents');
}
