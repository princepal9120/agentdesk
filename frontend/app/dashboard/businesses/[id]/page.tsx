"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, Phone, Clock, User, CheckCircle, XCircle } from "lucide-react";
import { businessApi, callsApi, setAuthToken, type Business, type Call } from "@/lib/api";
import { verticalLabel, formatDate, formatDuration } from "@/lib/utils";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [provisioning, setProvisioning] = useState(false);
  const [areaCode, setAreaCode] = useState("415");

  useEffect(() => {
    async function load() {
      const token = await getToken();
      setAuthToken(token);
      const [biz, callList] = await Promise.all([
        businessApi.get(id),
        callsApi.list(id),
      ]);
      setBusiness(biz);
      setCalls(callList);
      setLoading(false);
    }
    load();
  }, [id, getToken]);

  async function handleProvision() {
    setProvisioning(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const result = await businessApi.provision(id, areaCode);
      setBusiness((b) => b ? { ...b, phone_number: result.phone_number } : b);
    } catch {
      alert("Failed to provision number. Check your Twilio balance.");
    } finally {
      setProvisioning(false);
    }
  }

  if (loading || !business) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to clients
      </Link>

      {/* Business header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{verticalLabel(business.vertical)}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            business.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {business.active ? "Active" : "Paused"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Phone number */}
        <div className="card lg:col-span-1">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-violet-600" />
            Phone number
          </h2>
          {business.phone_number ? (
            <p className="text-2xl font-bold text-gray-900">{business.phone_number}</p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">No number provisioned yet.</p>
              <div className="flex gap-2">
                <input
                  className="input w-24"
                  placeholder="415"
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
                />
                <button
                  onClick={handleProvision}
                  className="btn-primary flex-1"
                  disabled={provisioning}
                >
                  {provisioning ? "Provisioning..." : "Get number"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Agent config */}
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Agent config</h2>
          {business.agent_config ? (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="text-gray-400 w-24">Name</span>
                <span>{business.agent_config.agent_name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-24">Greeting</span>
                <span className="truncate">{business.agent_config.greeting}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-24">Services</span>
                <span>{business.agent_config.services?.join(", ") ?? "—"}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Agent auto-configured from {verticalLabel(business.vertical)} template.</p>
          )}
        </div>
      </div>

      {/* Call log */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-violet-600" />
          Recent calls
          <span className="ml-auto text-xs text-gray-400 font-normal">{calls.length} total</span>
        </h2>

        {calls.length === 0 ? (
          <div className="text-center py-10">
            <Phone className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No calls yet. Share the phone number with your client.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {calls.map((call) => (
              <div key={call.id} className="py-3 flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{call.caller_number}</p>
                  <p className="text-xs text-gray-400">{formatDate(call.created_at)}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-600">{formatDuration(call.duration_seconds ?? 0)}</p>
                  <div className="flex items-center gap-1 justify-end mt-0.5">
                    {call.outcome === "booked" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-gray-300" />
                    )}
                    <span className="text-xs text-gray-400 capitalize">{call.outcome ?? call.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
