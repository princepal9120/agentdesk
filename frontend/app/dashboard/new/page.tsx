"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

const VERTICALS = [
  { value: "salon", label: "Salon / Spa", prompt: "Handle bookings, reminders, and missed-call recovery." },
  { value: "restaurant", label: "Restaurant", prompt: "Capture reservations, answer common questions, and route peak-hour demand." },
  { value: "repair", label: "Repair Shop", prompt: "Collect issue details, qualify leads, and keep inbound calls organized." },
  { value: "general", label: "General Business", prompt: "Start with a flexible AI receptionist flow and tailor it later." },
];

const STEPS = ["Create the business", "Pick the starting use case", "Continue setup inside the dashboard"];

export default function NewBusiness() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedVertical = useMemo(
    () => VERTICALS.find((item) => item.value === vertical) ?? VERTICALS[VERTICALS.length - 1],
    [vertical],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const b = await api.businesses.create({ name: name.trim(), vertical });
      router.push(`/dashboard/${b.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/dashboard" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
            <Sparkles className="h-4 w-4" />
            Workspace setup
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
            Create a business workspace
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
            This gets the business into AgentDesk so you can assign a number, review activity, and keep setup moving from a real dashboard.
          </p>

          <div className="mt-8 space-y-3">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{step}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-violet-200 bg-violet-50 p-6">
            <p className="text-sm font-semibold text-violet-800">Selected use case</p>
            <p className="mt-3 text-lg font-semibold text-gray-950">{selectedVertical.label}</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">{selectedVertical.prompt}</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-500">Business setup</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">Start a new workspace</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">You can refine routing, prompts, and phone setup after this first step.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="label">Business name</label>
              <input
                className="input"
                placeholder="Aria Salon, Joe's Diner..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="label">Business type</label>
              <select className="input" value={vertical} onChange={(e) => setVertical(e.target.value)}>
                {VERTICALS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-violet-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">What happens next</p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    After creation, AgentDesk opens the business workspace so you can provision a number, review calls, and continue the rest of setup in context.
                  </p>
                </div>
              </div>
            </div>

            {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating workspace..." : "Create workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
