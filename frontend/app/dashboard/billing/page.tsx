"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CreditCard, Zap, Check } from "lucide-react";
import { agencyApi, billingApi, setAuthToken, type Agency, type UsageSummary } from "@/lib/api";
import { planLabel } from "@/lib/utils";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "$49",
    clients: 3,
    calls: "300",
    features: ["3 client businesses", "300 calls/month", "All templates", "Email support"],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$99",
    clients: 10,
    calls: "1,000",
    features: ["10 client businesses", "1,000 calls/month", "White-label dashboard", "Priority support"],
    highlight: true,
  },
  {
    key: "agency",
    name: "Agency",
    price: "$199",
    clients: null,
    calls: "Unlimited",
    features: ["Unlimited clients", "Unlimited calls", "Custom domain", "Dedicated support"],
  },
];

export default function BillingPage() {
  const { getToken } = useAuth();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [usage, setUsage] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      setAuthToken(token);
      const [a, u] = await Promise.all([agencyApi.get(), agencyApi.usage()]);
      setAgency(a);
      setUsage(u);
      setLoading(false);
    }
    load();
  }, [getToken]);

  async function handlePlan(planKey: string) {
    if (!agency || planKey === agency.plan) return;
    setUpgrading(planKey);
    try {
      const token = await getToken();
      setAuthToken(token);
      const { url } = await billingApi.checkout(planKey);
      window.location.href = url;
    } catch {
      alert("Billing redirect failed. Try again.");
    } finally {
      setUpgrading(null);
    }
  }

  async function handlePortal() {
    try {
      const token = await getToken();
      setAuthToken(token);
      const { url } = await billingApi.portal();
      window.location.href = url;
    } catch {
      alert("Portal redirect failed. Try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500 text-sm mt-1">
            Current plan: <span className="font-medium text-gray-900">{planLabel(agency?.plan ?? "starter")}</span>
          </p>
        </div>
        <button onClick={handlePortal} className="btn-secondary flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Manage billing
        </button>
      </div>

      {/* Usage */}
      {usage && (
        <div className="card mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-600" />
            This month
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-2xl font-bold text-gray-900">{usage.calls_this_month}</p>
              <p className="text-sm text-gray-500">
                of {usage.calls_limit === 0 ? "unlimited" : usage.calls_limit} calls
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{usage.client_count}</p>
              <p className="text-sm text-gray-500">
                of {usage.client_limit === null ? "unlimited" : usage.client_limit} clients
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = agency?.plan === plan.key;
          return (
            <div
              key={plan.key}
              className={`card flex flex-col relative ${
                plan.highlight ? "border-violet-500 border-2" : ""
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                  Most popular
                </span>
              )}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">{plan.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-400">/mo</span>
                </p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlan(plan.key)}
                disabled={isCurrent || upgrading === plan.key}
                className={isCurrent ? "btn-secondary w-full cursor-default opacity-60" : (plan.highlight ? "btn-primary w-full" : "btn-secondary w-full")}
              >
                {isCurrent ? "Current plan" : upgrading === plan.key ? "Redirecting..." : "Switch to " + plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
