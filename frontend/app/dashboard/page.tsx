"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Phone, Plus, Sparkles } from "lucide-react";
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <Sparkles className="h-4 w-4" />
            AgentDesk workspace
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950">Your businesses and AI receptionist setups</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            This is the operations layer after the landing page and first-run setup. Add a business, review call activity, and grow the workspace from here.
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-1.5 self-start">
          <Plus className="w-4 h-4" /> Add business
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && businesses.length === 0 && (
        <div className="rounded-3xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <Phone className="mx-auto mb-4 h-9 w-9 text-gray-300" />
          <h2 className="text-xl font-semibold text-gray-950">No businesses yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
            You have the landing page in place. Now create the first business so AgentDesk can open a real workspace and start feeling like a product, not just a demo.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Start setup
            </Link>
            <Link href="/" className="btn-secondary inline-flex items-center gap-1.5">
              View landing page
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {businesses.length > 0 && (
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Businesses</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{businesses.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{businesses.filter((b) => b.active).length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Need number</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{businesses.filter((b) => !b.phone_number).length}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {businesses.map((b) => (
          <Link key={b.id} href={`/dashboard/${b.id}`}>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-violet-300">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{b.name}</p>
                  <p className="text-xs text-gray-400">{VERTICAL_LABELS[b.vertical] ?? b.vertical}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-600">{b.phone_number ?? "No number"}</p>
                  <span className={`text-xs font-medium ${b.active ? "text-green-600" : "text-gray-400"}`}>
                    {b.active ? "Active" : "Paused"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
