"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Building2,
  PhoneCall,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { api, type Business, type Call, type Lead } from "@/lib/api";

const LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Maya Chen",
    company: "Northline Dental",
    phone: "+1 (415) 555-0184",
    location: "San Francisco, CA",
    score: 94,
    status: "queued",
    summary: "Interested in after-hours call coverage and appointment reminders. Asked for pricing and setup speed.",
  },
  {
    id: "lead-2",
    name: "Jordan Patel",
    company: "Harbor Wellness",
    phone: "+1 (212) 555-0136",
    location: "New York, NY",
    score: 89,
    status: "called",
    summary: "Confirmed they miss weekend calls. Wants a branded voice agent with dashboard visibility for staff.",
  },
  {
    id: "lead-3",
    name: "Ava Brooks",
    company: "Summit Repair Co.",
    phone: "+1 (305) 555-0119",
    location: "Miami, FL",
    score: 81,
    status: "new",
  },
];

function callStatusLabel(status: Lead["status"]) {
  if (status === "queued") return "Queued for auto-call";
  if (status === "called") return "Call completed";
  return "New lead";
}

export default function Dashboard() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [leads, setLeads] = useState<Lead[]>(LEADS);

  useEffect(() => {
    Promise.all([api.businesses.list(), api.calls.list()])
      .then(([biz, callLog]) => {
        setBusinesses(biz);
        setCalls(callLog);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredLeads = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) =>
      [lead.name, lead.company, lead.location].some((value) => value.toLowerCase().includes(term)),
    );
  }, [leads, query]);

  const stats = useMemo(
    () => ({
      businesses: businesses.length,
      queuedLeads: leads.filter((lead) => lead.status === "queued").length,
      completedCalls: leads.filter((lead) => lead.status === "called").length,
      summaries: leads.filter((lead) => lead.summary).length,
    }),
    [businesses, leads],
  );

  const recentSummaries = useMemo(() => leads.filter((lead) => lead.summary).slice(0, 3), [leads]);

  function queueLead(leadId: string) {
    setLeads((current) =>
      current.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: "queued",
              summary:
                lead.summary ?? "Queued for automatic outreach. Agent will place the call, qualify the lead, and log the outcome here.",
            }
          : lead,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="surface mb-8 overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Sparkles className="h-4 w-4" />
              AgentDesk operator cockpit
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl">
              Search leads, trigger calls automatically, and review summaries in one place.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
              This dashboard is now shaped like an outbound AI calling workspace. Find leads, queue automatic outreach, and review what the agent learned after each call.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/dashboard/new" className="btn-secondary inline-flex items-center justify-center gap-1.5">
              <Building2 className="h-4 w-4" /> Add business
            </Link>
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-1.5">
              View site
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="surface-muted p-4">
            <p className="text-sm text-gray-500">Businesses</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.businesses}</p>
          </div>
          <div className="surface-muted p-4">
            <p className="text-sm text-gray-500">Queued calls</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.queuedLeads}</p>
          </div>
          <div className="surface-muted p-4">
            <p className="text-sm text-gray-500">Completed calls</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.completedCalls}</p>
          </div>
          <div className="surface-muted p-4">
            <p className="text-sm text-gray-500">Logged summaries</p>
            <p className="mt-2 text-2xl font-semibold text-gray-950">{stats.summaries}</p>
          </div>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading dashboard...</p>}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          We couldn&apos;t load the operator view right now. {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="surface p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Lead search</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">Prospects ready for outreach</h2>
                </div>
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    className="input pl-9"
                    placeholder="Search company, lead, or city"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="surface-muted p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-gray-950">{lead.company}</p>
                          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                            Score {lead.score}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{lead.name} • {lead.location}</p>
                        <p className="mt-1 text-sm text-gray-500">{lead.phone}</p>
                        <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-400">
                          {callStatusLabel(lead.status)}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
                        <button
                          className="btn-primary"
                          onClick={() => queueLead(lead.id)}
                          disabled={lead.status !== "new"}
                        >
                          <PhoneCall className="mr-2 h-4 w-4" /> Auto call
                        </button>
                        <Link href="/dashboard/new" className="btn-secondary">
                          Create workflow
                        </Link>
                      </div>
                    </div>

                    {lead.summary && (
                      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Bot className="h-4 w-4 text-violet-600" />
                          Call summary
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{lead.summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="surface p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active workspaces</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950">Businesses behind the calling engine</h2>
                </div>
                <span className="text-sm text-gray-400">{businesses.length} total</span>
              </div>

              <div className="mt-5 grid gap-4">
                {businesses.map((b) => (
                  <Link key={b.id} href={`/dashboard/${b.id}`} className="group block">
                    <div className="surface-muted p-4 transition-all hover:-translate-y-0.5 hover:border-violet-300">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-base font-semibold text-gray-950 group-hover:text-violet-700">{b.name}</p>
                          <p className="mt-1 text-sm text-gray-500">{b.vertical} workspace</p>
                        </div>
                        <div className="text-sm text-gray-500 sm:text-right">
                          <p className="font-medium text-gray-900">{b.phone_number ?? "No phone number yet"}</p>
                          <p className="mt-1 text-xs">{b.active ? "Accepting call workflows" : "Paused"}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface p-6">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Users className="h-4 w-4 text-violet-600" />
                Summary feed
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">What the agent learned on recent calls</h2>

              <div className="mt-5 space-y-4">
                {recentSummaries.map((lead) => (
                  <div key={lead.id} className="surface-muted p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-950">{lead.company}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-400">{lead.name}</p>
                      </div>
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        Summary ready
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{lead.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface p-6">
              <p className="text-sm font-medium text-gray-500">Live call log</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">Recent call activity</h2>

              {calls.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <PhoneCall className="mx-auto h-7 w-7 text-gray-300" />
                  <p className="mt-3 text-sm font-medium text-gray-900">No completed calls yet</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Once outbound or inbound call flows are active, summaries and activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {calls.slice(0, 5).map((call) => (
                    <div key={call.id} className="surface-muted p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{call.caller_number ?? "Unknown caller"}</p>
                          <p className="mt-1 text-xs text-gray-400">{new Date(call.started_at).toLocaleString()}</p>
                        </div>
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          {call.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
