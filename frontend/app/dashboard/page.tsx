"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Robot,
  Buildings,
  PhoneCall,
  MagnifyingGlass,
  Sparkle,
  Users,
} from "@phosphor-icons/react";
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

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

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
    <motion.div 
      className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="surface mb-10 overflow-hidden p-8 sm:p-12 relative">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
           <Robot size={320} weight="duotone" />
        </div>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 backdrop-blur-md px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm"
            >
              <Sparkle weight="fill" className="h-4 w-4 text-emerald-500" />
              AgentDesk Operator Cockpit
            </motion.div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-6xl leading-[1.1]">
              Search leads, trigger calls automatically, and review summaries.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-500">
              This dashboard is shaped like an outbound AI calling workspace. Find leads, queue automatic outreach, and review what the agent learned after each call.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/dashboard/new" className="btn-secondary inline-flex items-center justify-center gap-2">
              <Buildings weight="bold" className="h-4 w-4" /> Add Workspace
            </Link>
            <Link href="/" className="btn-primary inline-flex items-center justify-center gap-2">
              View Site
              <ArrowRight weight="bold" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <div className="surface-muted p-6 transition-colors hover:bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Workspaces</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-zinc-950">{stats.businesses}</p>
          </div>
          <div className="surface-muted p-6 transition-colors hover:bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Queued Calls</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-zinc-950">{stats.queuedLeads}</p>
          </div>
          <div className="surface-muted p-6 transition-colors hover:bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Completed Calls</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-zinc-950">{stats.completedCalls}</p>
          </div>
          <div className="surface-muted p-6 transition-colors hover:bg-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Logged Summaries</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-zinc-950">{stats.summaries}</p>
          </div>
        </div>
      </motion.div>

      {loading && (
        <motion.p variants={itemVariants} className="text-sm text-zinc-400">Loading metrics...</motion.p>
      )}
      
      {error && (
        <motion.div variants={itemVariants} className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load operator view. {error}
        </motion.div>
      )}

      {!loading && !error && (
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="surface p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
                <div>
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest">Lead Search</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Prospects ready for outreach</h2>
                </div>
                <div className="relative w-full sm:max-w-sm">
                  <MagnifyingGlass weight="bold" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                  <input
                    className="input pl-11 rounded-full"
                    placeholder="Search company, lead, or city..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredLeads.map((lead) => (
                    <motion.div 
                      key={lead.id} 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="surface-muted p-5 hover:bg-zinc-100 transition-colors"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-lg font-semibold text-zinc-950">{lead.company}</p>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                              Score {lead.score}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-zinc-600 font-medium">{lead.name} <span className="text-zinc-300 mx-1">•</span> {lead.location}</p>
                          <p className="mt-1 font-mono text-sm text-zinc-500">{lead.phone}</p>
                          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            <div className={`h-1.5 w-1.5 rounded-full ${lead.status === 'new' ? 'bg-blue-500' : lead.status === 'queued' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                            {callStatusLabel(lead.status)}
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                          <button
                            className="btn-accent"
                            onClick={() => queueLead(lead.id)}
                            disabled={lead.status !== "new"}
                          >
                            <PhoneCall weight="fill" className="mr-2 h-4 w-4" /> Auto Call
                          </button>
                          <Link href="/dashboard/new" className="btn-secondary text-xs">
                            Create Workflow
                          </Link>
                        </div>
                      </div>

                      {lead.summary && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900 mb-3">
                            <Robot weight="fill" className="h-5 w-5 text-emerald-600" />
                            Call Summary
                          </div>
                          <p className="text-sm leading-relaxed text-zinc-600">{lead.summary}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="surface p-8">
              <div className="flex items-center justify-between gap-3 mb-8">
                <div>
                  <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest">Active Workspaces</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Businesses behind the engine</h2>
                </div>
                <span className="font-mono text-sm font-medium bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full">{businesses.length} Total</span>
              </div>

              <div className="grid gap-4">
                {businesses.map((b) => (
                  <Link key={b.id} href={`/dashboard/${b.id}`} className="group block">
                    <div className="surface-muted p-5 transition-all duration-300 hover:scale-[1.01] hover:border-zinc-300 hover:bg-white hover:shadow-md">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-zinc-950 group-hover:text-emerald-700 transition-colors">{b.name}</p>
                          <p className="mt-1 text-sm font-medium text-zinc-500 capitalize">{b.vertical} Workspace</p>
                        </div>
                        <div className="text-sm text-zinc-500 sm:text-right">
                          <p className="font-mono font-medium text-zinc-800 bg-zinc-100 px-2 py-1 rounded w-fit sm:ml-auto">{b.phone_number ?? "No Number"}</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                             <div className={`h-1.5 w-1.5 rounded-full ${b.active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300'}`} />
                             {b.active ? "Accepting Calls" : "Paused"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div variants={itemVariants} className="surface p-8">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 uppercase tracking-widest mb-2">
                <Users weight="bold" className="h-4 w-4" />
                Summary Feed
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-8">What the agent learned</h2>

              <div className="space-y-4">
                {recentSummaries.map((lead) => (
                  <div key={lead.id} className="surface-muted p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-base font-semibold text-zinc-950">{lead.company}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">{lead.name}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                        Processed
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-600">{lead.summary}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="surface p-8">
              <p className="text-sm font-medium text-emerald-600 uppercase tracking-widest mb-2">Live Activity</p>
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 mb-8">Recent Call Log</h2>

              {calls.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-zinc-300 bg-zinc-50/50 px-6 py-12 text-center">
                  <PhoneCall weight="duotone" className="mx-auto h-10 w-10 text-zinc-300 mb-4" />
                  <p className="text-base font-semibold text-zinc-900">No completed calls yet</p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-xs mx-auto">
                    Once outbound or inbound call flows are active, summaries will stream in here in real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {calls.slice(0, 5).map((call) => (
                    <div key={call.id} className="surface-muted p-4 hover:bg-zinc-100 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-mono text-sm font-medium text-zinc-900">{call.caller_number ?? "Unknown caller"}</p>
                          <p className="mt-1 text-xs text-zinc-400 font-medium">{new Date(call.started_at).toLocaleString()}</p>
                        </div>
                        <span className="rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 uppercase tracking-wider shadow-sm">
                          {call.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
