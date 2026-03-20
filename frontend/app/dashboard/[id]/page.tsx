"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, PhoneCall } from "lucide-react";
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

const STATUS_COLOR: Record<string, string> = {
  completed: "text-green-600 bg-green-50",
  in_progress: "text-blue-600 bg-blue-50",
  missed: "text-red-500 bg-red-50",
  failed: "text-red-500 bg-red-50",
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
      .then(([b, c]) => { setBiz(b); setCalls(c); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function provision() {
    setProvisioning(true);
    setError("");
    try {
      const res = await api.businesses.provision(id, areaCode);
      setBiz((prev) => prev ? { ...prev, phone_number: res.phone_number } : prev);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProvisioning(false);
    }
  }

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-gray-400">Loading...</div>;
  if (!biz) return <div className="max-w-3xl mx-auto px-4 py-10 text-sm text-red-500">{error || "Not found"}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gray-400 flex items-center gap-1 mb-6 hover:text-gray-600">
        <ArrowLeft className="w-4 h-4" /> All businesses
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{biz.name}</h1>
          <p className="text-sm text-gray-400 capitalize">{biz.vertical}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${biz.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
          {biz.active ? "Active" : "Paused"}
        </span>
      </div>

      {/* Phone number */}
      <div className="card mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Phone number</p>
        {biz.phone_number ? (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-violet-600" />
            <span className="font-mono text-gray-900">{biz.phone_number}</span>
            <span className="text-xs text-gray-400 ml-1">via Twilio</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              className="input max-w-28"
              placeholder="Area code"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
            />
            <button className="btn-primary" onClick={provision} disabled={provisioning}>
              {provisioning ? "Provisioning..." : "Get a number"}
            </button>
          </div>
        )}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>

      {/* Call log */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-4 h-4 text-gray-400" />
          <p className="text-sm font-medium text-gray-700">
            Call log {calls.length > 0 && <span className="text-gray-400">({calls.length})</span>}
          </p>
        </div>

        {calls.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sm text-gray-400">No calls yet. Once a number is active, calls appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {calls.map((c) => (
              <div key={c.id} className="card flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-gray-700">{c.caller_number}</p>
                  <p className="text-xs text-gray-400">{fmt(c.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[c.status] ?? "bg-gray-100 text-gray-500"}`}>
                    {c.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">{dur(c.duration_seconds)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
