"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Phone, Plus, Sparkles } from "lucide-react";
import { api, type Business } from "@/lib/api";

const VERTICAL_LABELS: Record<string, string> = {
  salon: "Salon",
  restaurant: "Restaurant",
  repair: "Repair Shop",
  general: "General",
};

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.businesses
      .list()
      .then(setBusinesses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: businesses.length,
      active: businesses.filter((b) => b.active).length,
      needNumber: businesses.filter((b) => !b.phone_number).length,
    }),
    [businesses],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface mb-8 p-6 sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              AgentDesk workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-gray-950 sm:text-4xl">Dashboard</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              Manage businesses, assign numbers, and keep each workspace looking calm, ready, and operational.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-1.5">
              View site
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/dashboard/new" className="btn-primary inline-flex items-center justify-center gap-1.5">
              <Plus className="h-4 w-4" /> Add business
            </Link>
          </div>
        </div>

        {!loading && !error && businesses.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="surface-muted p-4">
              <p className="text-sm text-gray-500">Businesses</p>
              <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.total}</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-gray-500">Live workspaces</p>
              <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.active}</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-gray-500">Missing number</p>
              <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.needNumber}</p>
            </div>
          </div>
        )}
      </div>

      {loading && <p className="text-sm text-gray-400">Loading businesses...</p>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          We couldn&apos;t load the dashboard right now. {error}
        </div>
      )}

      {!loading && !error && businesses.length === 0 && (
        <div className="surface border-dashed border-gray-300 px-6 py-14 text-center">
          <Phone className="mx-auto mb-4 h-9 w-9 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-950">Create your first business</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            Start a workspace to provision a number, review call activity, and move from setup into day-to-day operations.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Start setup
            </Link>
            <Link href="/" className="btn-secondary inline-flex items-center gap-1.5">
              View landing page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && businesses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-950">Your businesses</h2>
              <p className="text-sm text-gray-500">Open a workspace to manage numbers and review calls.</p>
            </div>
          </div>

          <div className="grid gap-4">
            {businesses.map((b) => (
              <Link key={b.id} href={`/dashboard/${b.id}`} className="group block">
                <div className="surface rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-gray-950 group-hover:text-violet-700">{b.name}</p>
                        <p className="mt-1 text-sm text-gray-500">{VERTICAL_LABELS[b.vertical] ?? b.vertical}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                          b.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {b.active ? "Active" : "Paused"}
                      </span>
                      <div className="text-sm text-gray-600 sm:text-right">
                        <p className="font-medium text-gray-900">{b.phone_number ?? "No phone number yet"}</p>
                        <p className="mt-1 text-xs text-gray-400">
                          {b.phone_number ? "Ready for inbound calls" : "Open workspace to provision a number"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
