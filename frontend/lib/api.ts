const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      "X-Dev-Agency-Id": KEY,
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
  caller_number: string;
  status: string;
  outcome: string | null;
  duration_seconds: number | null;
  created_at: string;
}

export const api = {
  businesses: {
    list: () => req<Business[]>(`/api/v1/businesses/agency/${KEY}`),
    get: (id: string) => req<Business>(`/api/v1/businesses/${id}`),
    create: (data: { name: string; vertical: string; timezone?: string }) =>
      req<Business>("/api/v1/businesses/", {
        method: "POST",
        body: JSON.stringify({ agency_id: KEY, timezone: "America/New_York", ...data }),
      }),
    provision: (id: string, area_code = "415") =>
      req<{ phone_number: string }>(`/api/v1/numbers/business/${id}/provision`, {
        method: "POST",
        body: JSON.stringify({ area_code }),
      }),
  },
  calls: {
    list: (businessId?: string) => req<Call[]>(businessId ? `/api/v1/calls/business/${businessId}` : `/api/v1/calls/business/${KEY}`),
  },
};
