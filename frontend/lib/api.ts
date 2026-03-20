/**
 * API client — all calls go through here.
 * Attaches Clerk Bearer token automatically.
 */

import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = axios.create({ baseURL: BASE });

/** Call before API requests to inject fresh Clerk token */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Agency {
  id: string;
  name: string;
  subdomain: string | null;
  plan: "starter" | "pro" | "agency";
  active: boolean;
  created_at: string;
}

export interface Business {
  id: string;
  agency_id: string;
  name: string;
  vertical: "salon" | "restaurant" | "repair" | "general";
  phone_number: string | null;
  active: boolean;
  created_at: string;
  agent_config?: AgentConfig;
}

export interface AgentConfig {
  id: string;
  business_id: string;
  agent_name: string;
  greeting: string;
  faq: { q: string; a: string }[];
  services: string[];
}

export interface Call {
  id: string;
  business_id: string;
  caller_number: string;
  duration_seconds: number | null;
  status: string;
  outcome: string | null;
  created_at: string;
}

export interface UsageSummary {
  calls_this_month: number;
  calls_limit: number;
  client_count: number;
  client_limit: number | null;
}

// ─── Agency endpoints ────────────────────────────────────────────────────────

export const agencyApi = {
  get: () => api.get<Agency>("/api/v1/agencies/me").then(r => r.data),
  create: (data: { name: string; subdomain?: string }) =>
    api.post<Agency>("/api/v1/agencies/", data).then(r => r.data),
  update: (data: Partial<{ name: string; subdomain: string; branding: object }>) =>
    api.patch<Agency>("/api/v1/agencies/me", data).then(r => r.data),
  usage: () => api.get<UsageSummary>("/api/v1/agencies/me/usage").then(r => r.data),
};

// ─── Business endpoints ──────────────────────────────────────────────────────

export const businessApi = {
  list: () => api.get<Business[]>("/api/v1/businesses/").then(r => r.data),
  get: (id: string) => api.get<Business>(`/api/v1/businesses/${id}`).then(r => r.data),
  create: (data: { name: string; vertical: string; timezone?: string }) =>
    api.post<Business>("/api/v1/businesses/", data).then(r => r.data),
  update: (id: string, data: Partial<Business>) =>
    api.patch<Business>(`/api/v1/businesses/${id}`, data).then(r => r.data),
  provision: (id: string, areaCode?: string) =>
    api.post<{ phone_number: string }>(`/api/v1/businesses/${id}/provision-number`, { area_code: areaCode }).then(r => r.data),
};

// ─── Calls endpoints ─────────────────────────────────────────────────────────

export const callsApi = {
  list: (businessId: string) =>
    api.get<Call[]>(`/api/v1/calls/?business_id=${businessId}&limit=50`).then(r => r.data),
};

// ─── Billing endpoints ───────────────────────────────────────────────────────

export const billingApi = {
  portal: () => api.post<{ url: string }>("/api/v1/billing/portal").then(r => r.data),
  checkout: (plan: string) =>
    api.post<{ url: string }>("/api/v1/billing/checkout", { plan }).then(r => r.data),
};
