"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, Phone, PhoneCall, PhoneIncoming } from "lucide-react";
import { api, type Business, type Call } from "@/lib/api";

function dur(s: number | null) {
  if (!s) return "--";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString();
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-50 text-green-700",
  in_progress: "bg-blue-50 text-blue-700",
  missed: "bg-red-50 text-red-600",
  failed: "bg-red-50 text-red-600",
};

const VERTICAL_LABELS: Record<string, string> = {
  salon: "Salon",
  restaurant: "Restaurant",
  repair: "Repair Shop",
  general: "General",
};

export default function BusinessDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [biz, setBiz] = useState<Business | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [areaCode, setAreaCode] = useState("415");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.businesses.get(id), api.calls.list(id)])
      .then(([b, c]) => {
        setBiz(b);
        setCalls(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function provision() {
    setProvisioning(true);
    setError("");
    try {
      const res = await api.businesses.provision(id, areaCode);
      setBiz((prev) => (prev ? { ...prev, phone_number: res.phone_number } : prev));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProvisioning(false);
    }
  }

  const callStats = useMemo(
    () => ({
      total: calls.length,
      completed: calls.filter((c) => c.status === "completed").length,
      missed: calls.filter((c) => c.status === "missed" || c.status === "failed").length,
    }),
    [calls],
  );

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-gray-400 sm:px-6">Loading workspace...</div>;
  }

  if (!biz) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-red-500 sm:px-6">{error || "Business not found"}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
        <ArrowLeft className="h-4 w-4" /> All businesses
      </Link>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {VERTICAL_LABELS[biz.vertical] ?? biz.vertical}
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">{biz.name}</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Review phone readiness and recent call activity for this workspace.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium ${
              biz.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
            }`}
          >
            {biz.active ? "Active" : "Paused"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Total calls</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{callStats.total}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{callStats.completed}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Missed or failed</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{callStats.missed}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-violet-600" />
            <p className="text-sm font-medium text-gray-900">Phone number</p>
          </div>

          {biz.phone_number ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Assigned number</p>
              <p className="mt-2 font-mono text-lg text-gray-950">{biz.phone_number}</p>
              <p className="mt-2 text-sm text-gray-500">Ready for inbound calls through Twilio.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Provision a number</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Pick a 3-digit area code to claim a number for this workspace.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className="input sm:max-w-32"
                  placeholder="Area code"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
                />
                <button className="btn-primary" onClick={provision} disabled={provisioning || areaCode.length !== 3}>
                  {provisioning ? "Provisioning..." : "Get a number"}
                </button>
              </div>
              <p className="text-xs text-gray-400">Example: 415, 212, or 305.</p>
            </div>
          )}

          {error && <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Recent calls</p>
                <p className="text-sm text-gray-500">Latest activity for this business.</p>
              </div>
            </div>
            {calls.length > 0 && <span className="text-sm text-gray-400">{calls.length} total</span>}
          </div>

          {calls.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <PhoneIncoming className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-sm font-medium text-gray-900">No calls yet</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Once this workspace has an active number, call activity will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {calls.map((c) => (
                <div key={c.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-sm text-gray-800">{c.caller_number ?? "Unknown caller"}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{fmt(c.started_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          STATUS_STYLES[c.status] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                      <p className="text-xs text-gray-500">Duration: {dur(c.duration_sec)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
