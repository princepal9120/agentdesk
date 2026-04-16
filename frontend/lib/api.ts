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
  active: boolean;
  created_at: string;
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
      req<{ phone_number: string }>(`/api/v1/numbers/business/${id}/provision`, {
        method: "POST",
        body: JSON.stringify({ area_code }),
      }),
  },
  calls: {
    list: (businessId?: string) => {
      const params = new URLSearchParams();
      if (businessId) params.set("business_id", businessId);
      return req<Call[]>(`/api/v1/calls/?${params.toString()}`);
    },
  },
};
