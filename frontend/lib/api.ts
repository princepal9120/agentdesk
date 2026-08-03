const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export interface Business {
  id: string;
  name: string;
  vertical: string;
  phone_number: string | null;
  telephony_provider: string;
  active: boolean;
  created_at: string;
}

export interface AgentConfig {
  id: string;
  business_id: string;
  template: string;
  agent_name: string;
  voice_id: string;
  system_prompt: string;
  business_hours: Record<string, any> | null;
  services: any[] | null;
  faq: any[] | null;
  flow_data: Record<string, any> | null;
}

export interface Call {
  id: string;
  business_id: string;
  caller_number: string | null;
  status: string;
  outcome: string | null;
  duration_sec: number | null;
  started_at: string;
}

export interface FlowVersion {
  id: string;
  business_id: string;
  name: string;
  nodes: Array<Record<string, any>>;
  start_node_id: string | null;
  version: number;
  active: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  business_id: string;
  name: string | null;
  phone_number: string;
  extra_data: Record<string, any> | null;
  active: boolean;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  location: string;
  score: number;
  status: "new" | "queued" | "called";
  summary?: string;
}

export const api = {
  businesses: {
    list: () => req<Business[]>(`/api/v1/businesses/`),
    get: (id: string) => req<Business>(`/api/v1/businesses/${id}`),
    create: (data: { name: string; vertical: string; timezone?: string }) =>
      req<Business>("/api/v1/businesses/", {
        method: "POST",
        body: JSON.stringify({ timezone: "America/New_York", ...data }),
      }),
    provision: (id: string, area_code = "415") =>
      req<{ phone_number: string; provider: string }>(`/api/v1/numbers/business/${id}/provision`, {
        method: "POST",
        body: JSON.stringify({ area_code }),
      }),
    getConfig: (id: string) => req<AgentConfig>(`/api/v1/businesses/${id}/config`),
    updateConfig: (id: string, data: Partial<AgentConfig>) =>
      req<AgentConfig>(`/api/v1/businesses/${id}/config`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  calls: {
    list: (businessId?: string) => {
      const params = new URLSearchParams();
      if (businessId) params.set("business_id", businessId);
      return req<Call[]>(`/api/v1/calls/?${params.toString()}`);
    },
    outbound: (data: { business_id: string; phone_number: string; flow_version_id?: string }) =>
      req<Record<string, string>>(`/api/v1/calls/outbound`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  flows: {
    list: (businessId: string) => req<FlowVersion[]>(`/api/v1/businesses/${businessId}/flows`),
    create: (businessId: string, data: { name: string; nodes: Array<Record<string, any>>; start_node_id?: string }) =>
      req<FlowVersion>(`/api/v1/businesses/${businessId}/flows`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  contacts: {
    list: (businessId: string) => req<Contact[]>(`/api/v1/businesses/${businessId}/contacts`),
    create: (businessId: string, data: { name?: string; phone_number: string }) =>
      req<Contact>(`/api/v1/businesses/${businessId}/contacts`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
  campaigns: {
    create: (businessId: string, data: { name: string; flow_version_id: string; contact_ids: string[] }) =>
      req<Record<string, any>>(`/api/v1/businesses/${businessId}/campaigns`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    start: (campaignId: string) =>
      req<Record<string, any>>(`/api/v1/campaigns/${campaignId}/start`, { method: "POST" }),
  },
};
