"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { businessApi, setAuthToken } from "@/lib/api";

const VERTICALS = [
  { value: "salon", label: "Salon / Barbershop" },
  { value: "restaurant", label: "Restaurant / Cafe" },
  { value: "repair", label: "Repair Shop" },
  { value: "general", label: "General Business" },
];

export default function NewBusinessPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      setAuthToken(token);
      const biz = await businessApi.create({ name: name.trim(), vertical });
      router.push(`/dashboard/businesses/${biz.id}`);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(message ?? "Failed to create client. Check your plan limits.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to clients
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add a client</h1>
      <p className="text-gray-500 text-sm mb-8">
        Pick a vertical and we auto-configure the agent. You can customize everything next.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Business name</label>
            <input
              className="input"
              placeholder="Curl Up & Dye Salon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">Business type</label>
            <div className="grid grid-cols-2 gap-3">
              {VERTICALS.map((v) => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setVertical(v.value)}
                  className={`p-3 rounded-xl border text-sm font-medium text-left transition-colors ${
                    vertical === v.value
                      ? "border-violet-500 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="btn-primary w-full py-3" disabled={loading || !name.trim()}>
            {loading ? "Creating..." : "Create client"}
          </button>
        </form>
      </div>
    </div>
  );
}
