"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Plus } from "lucide-react";
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
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">AgentDesk</h1>
          <p className="text-sm text-gray-500">Your AI receptionists</p>
        </div>
        <Link href="/dashboard/new" className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add business
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && businesses.length === 0 && (
        <div className="card text-center py-14">
          <Phone className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">No businesses yet. Add one to deploy your first agent.</p>
          <Link href="/dashboard/new" className="btn-primary inline-flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add business
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {businesses.map((b) => (
          <Link key={b.id} href={`/dashboard/${b.id}`}>
            <div className="card hover:border-violet-300 transition-colors cursor-pointer flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{b.name}</p>
                <p className="text-xs text-gray-400">{VERTICAL_LABELS[b.vertical] ?? b.vertical}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm text-gray-600">{b.phone_number ?? "No number"}</p>
                <span
                  className={`text-xs font-medium ${b.active ? "text-green-600" : "text-gray-400"}`}
                >
                  {b.active ? "Active" : "Paused"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
