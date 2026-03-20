"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Plus, Phone, MoreVertical } from "lucide-react";
import { businessApi, agencyApi, setAuthToken, type Business, type UsageSummary } from "@/lib/api";
import { verticalLabel, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      setAuthToken(token);
      try {
        const [biz, u] = await Promise.all([businessApi.list(), agencyApi.usage()]);
        setBusinesses(biz);
        setUsage(u);
      } catch {
        // if agency doesn't exist yet, redirect to onboarding
        window.location.href = "/onboarding";
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          {usage && (
            <p className="text-sm text-gray-500 mt-1">
              {usage.client_count} of{" "}
              {usage.client_limit === null ? "unlimited" : usage.client_limit} clients
            </p>
          )}
        </div>
        <Link href="/dashboard/businesses/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add client
        </Link>
      </div>

      {/* Usage bar */}
      {usage && usage.client_limit !== null && (
        <div className="card mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Client slots</span>
            <span>{usage.client_count} / {usage.client_limit}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all"
              style={{ width: `${Math.min(100, (usage.client_count / usage.client_limit) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Businesses grid */}
      {businesses.length === 0 ? (
        <div className="card text-center py-16">
          <Phone className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No clients yet</h3>
          <p className="text-gray-500 text-sm mb-6">Add your first client to deploy their AI receptionist.</p>
          <Link href="/dashboard/businesses/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add first client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((b) => (
            <Link key={b.id} href={`/dashboard/businesses/${b.id}`}>
              <div className="card hover:border-violet-300 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.name}</h3>
                    <span className="text-xs text-gray-400">{verticalLabel(b.vertical)}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {b.active ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Phone className="w-3.5 h-3.5" />
                  {b.phone_number ?? "No number yet"}
                </div>
                <p className="text-xs text-gray-400 mt-3">{formatDate(b.created_at)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
