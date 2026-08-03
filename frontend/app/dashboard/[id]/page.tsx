"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  Phone, 
  PhoneCall, 
  PhoneDisconnect, 
  Graph,
  WarningCircle
} from "@phosphor-icons/react";
import { api, type Business, type Call } from "@/lib/api";

/* Hallmark · genre: modern-minimal · macrostructure: Stat-Led · theme: Coral · enrichment: Tier C */

function dur(s: number | null) {
  if (!s) return "--";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString();
}

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-theme-surface border-theme-btn-accent/20 text-theme-btn-accent",
  in_progress: "bg-theme-surface border-blue-200 text-blue-700",
  missed: "bg-theme-surface border-red-200 text-red-700",
  failed: "bg-theme-surface border-red-200 text-red-700",
};

const VERTICAL_LABELS: Record<string, string> = {
  salon: "Salon",
  restaurant: "Restaurant",
  repair: "Repair Shop",
  general: "General",
};

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  },
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
      .then(([b, c]) => {
        setBiz(b);
        setCalls(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function provision() {
    setProvisioning(true);
    setError("");
    try {
      const res = await api.businesses.provision(id, areaCode);
      setBiz((prev) => (prev ? { ...prev, phone_number: res.phone_number, telephony_provider: res.provider } : prev));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setProvisioning(false);
    }
  }

  const callStats = useMemo(
    () => ({
      total: calls.length,
      completed: calls.filter((c) => c.status === "completed").length,
      missed: calls.filter((c) => c.status === "missed" || c.status === "failed").length,
    }),
    [calls],
  );

  if (loading) {
    return <div className="mx-auto max-w-[1400px] px-4 py-12 text-sm text-theme-label">Loading workspace...</div>;
  }

  if (!biz) {
    return <div className="mx-auto max-w-[1400px] px-4 py-12 text-sm text-red-500">{error || "Business not found"}</div>;
  }

  return (
    <motion.div 
      className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <Link href="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-theme-label hover:text-theme-fg transition-colors">
        <ArrowLeft weight="bold" className="h-4 w-4" /> Back to Workspaces
      </Link>

      <motion.div variants={itemVariants} className="surface p-8 sm:p-12 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-theme-btn-accent">
           <Graph size={320} weight="duotone" />
        </div>
        
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-theme-surface border border-theme-border-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-theme-label shadow-sm">
              {VERTICAL_LABELS[biz.vertical] ?? biz.vertical}
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.02em] text-theme-fg sm:text-5xl leading-[1.1]">{biz.name}</h1>
            <p className="mt-4 text-base leading-relaxed text-theme-label">
              Review phone readiness, call activity, and the operational status of this workspace engine.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={`/dashboard/${biz.id}/flow`}
              className="btn-secondary inline-flex w-fit items-center gap-2"
            >
              <Graph weight="bold" className="h-4 w-4" />
              Visual Flow Editor
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-theme-border-muted bg-theme-surface px-4 py-2 text-sm font-semibold shadow-sm text-theme-fg">
              <div className={`h-2 w-2 rounded-full ${biz.active ? 'bg-theme-btn-accent animate-pulse' : 'bg-theme-border-muted'}`} />
              {biz.active ? "Active & Listening" : "Paused"}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <div className="surface-muted p-6 hover:bg-theme-surface hover:border-theme-border transition-colors border border-transparent">
            <p className="text-sm font-medium text-theme-label">Total Calls</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-theme-fg">{callStats.total}</p>
          </div>
          <div className="surface-muted p-6 hover:bg-theme-surface hover:border-theme-border transition-colors border border-transparent">
            <p className="text-sm font-medium text-theme-label">Completed</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-theme-fg">{callStats.completed}</p>
          </div>
          <div className="surface-muted p-6 hover:bg-theme-surface hover:border-theme-border transition-colors border border-transparent">
            <p className="text-sm font-medium text-theme-label">Missed / Failed</p>
            <p className="mt-3 font-mono text-3xl font-semibold text-theme-fg">{callStats.missed}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div variants={itemVariants} className="surface p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-theme-btn-accent uppercase tracking-widest mb-6">
            <Phone weight="bold" className="h-5 w-5" />
            Telecom Provisioning
          </div>

          {biz.phone_number ? (
            <div className="surface-muted p-6 border border-theme-btn-accent/20 bg-theme-btn-accent/5">
              <p className="text-sm font-medium text-theme-label">Active Assigned Number</p>
              <p className="mt-3 font-mono text-3xl font-semibold text-theme-fg tracking-tight">{biz.phone_number}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-theme-btn-accent font-medium">
                <div className="h-2 w-2 rounded-full bg-theme-btn-accent" />
                Ready for inbound calls via {biz.telephony_provider === "exotel" ? "Exotel" : "Twilio"}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-theme-border-muted bg-theme-surface-muted p-6">
              <div className="mb-6">
                <p className="text-base font-semibold text-theme-fg">Provision a number</p>
                <p className="mt-2 text-sm leading-relaxed text-theme-label">
                  {biz.telephony_provider === "exotel"
                    ? "Attach the Exotel trial ExoPhone configured in the backend environment."
                    : "Pick a 3-digit area code to claim a dedicated Twilio number for this workspace."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  className="input sm:max-w-32 font-mono"
                  placeholder={biz.telephony_provider === "exotel" ? "Not used" : "Area code"}
                  value={areaCode}
                  onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, "").slice(0, 3))}
                />
                <button className="btn-primary" onClick={provision} disabled={provisioning || (biz.telephony_provider !== "exotel" && areaCode.length !== 3)}>
                  {provisioning ? "Provisioning..." : "Claim Number"}
                </button>
              </div>
              <p className="mt-4 text-xs font-medium text-theme-label opacity-60">
                {biz.telephony_provider === "exotel" ? "EXOTEL_CALLER_ID must be set before provisioning." : "Example: 415, 212, or 305."}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <WarningCircle weight="fill" className="h-5 w-5" />
              {error}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="surface p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-theme-btn-accent uppercase tracking-widest">
              <PhoneCall weight="bold" className="h-5 w-5" />
              Recent Calls
            </div>
            {calls.length > 0 && <span className="font-mono text-sm font-medium bg-theme-surface-muted border border-theme-border-muted text-theme-label px-3 py-1 rounded-full">{calls.length} Total</span>}
          </div>

          {calls.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-theme-border-muted bg-theme-surface-muted px-6 py-12 text-center">
              <PhoneDisconnect weight="duotone" className="mx-auto h-10 w-10 text-theme-border-muted mb-4" />
              <p className="text-base font-semibold text-theme-fg">No activity yet</p>
              <p className="mt-2 text-sm leading-relaxed text-theme-label max-w-sm mx-auto">
                Once this workspace has an active number, real-time call transcripts and activity will stream here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {calls.map((c) => (
                <div key={c.id} className="surface-muted p-5 hover:bg-theme-surface border border-transparent hover:border-theme-border transition-colors">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-semibold text-theme-fg">{c.caller_number ?? "Unknown caller"}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-theme-label">
                        <Clock weight="bold" className="h-3.5 w-3.5 opacity-60" />
                        <span>{fmt(c.started_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm ${
                          STATUS_STYLES[c.status] ?? "bg-theme-surface border-theme-border-muted text-theme-label"
                        }`}
                      >
                        {c.status.replace("_", " ")}
                      </span>
                      <p className="text-xs font-medium text-theme-label font-mono">Duration {dur(c.duration_sec)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
