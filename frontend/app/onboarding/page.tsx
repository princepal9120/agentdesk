"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Phone } from "lucide-react";
import { agencyApi, setAuthToken } from "@/lib/api";

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");

    try {
      const token = await getToken();
      setAuthToken(token);
      await agencyApi.create({ name: name.trim(), subdomain: subdomain.trim() || undefined });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up your agency</h1>
          <p className="text-gray-500 mt-2 text-sm">
            This takes 30 seconds. You can change everything later.
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Agency name</label>
              <input
                className="input"
                placeholder="Acme AI Agency"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Subdomain (optional)</label>
              <div className="flex items-center">
                <input
                  className="input rounded-r-none"
                  placeholder="acme"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                />
                <span className="bg-gray-100 border border-l-0 border-gray-200 px-3 py-2.5 text-sm text-gray-500 rounded-r-xl">
                  .agentdesk.app
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Setting up..." : "Create agency"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
