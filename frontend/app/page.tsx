import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers3,
  Mic,
  Orbit,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const pillars = [
  {
    title: "Brand-first launch surface",
    description:
      "Give every visitor a sharp first impression before they ever enter the product. Lead with positioning, clarity, and a credible product story.",
    icon: Sparkles,
  },
  {
    title: "White-label agency workflow",
    description:
      "Run multiple business setups from one dashboard and shape the experience like a product your clients would gladly pay for.",
    icon: Layers3,
  },
  {
    title: "Open-source control",
    description:
      "Own the stack, customize the flows, and keep the path open from quick demo setup to a more advanced production rollout.",
    icon: Code2,
  },
];

const highlights = [
  "Landing page first, dashboard second. Better first-run storytelling.",
  "OpenAI-first demo path so setup stays simple for now.",
  "Dashboard remains the operational layer after branding and setup.",
  "Built to evolve into a real production voice platform.",
];

const setupFlow = [
  {
    title: "Discover the product",
    description: "The landing page explains what AgentDesk is, who it is for, and why the setup path is simple right now.",
  },
  {
    title: "Start setup",
    description: "Connect the essential config, choose the demo path, and get the product feeling real without heavy onboarding friction.",
  },
  {
    title: "Open the dashboard",
    description: "After setup, move into the dashboard to manage businesses, operations, and future voice workflows.",
  },
];

const dashboardCards = [
  {
    label: "Landing",
    value: "Branding-first",
    note: "Clear narrative, crisp positioning, strong CTA",
  },
  {
    label: "Setup",
    value: "OpenAI-first",
    note: "Simple first-run configuration for faster adoption",
  },
  {
    label: "Dashboard",
    value: "Ops-ready",
    note: "Businesses, workflows, and future production controls",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight">AgentDesk</p>
                <p className="text-sm text-gray-500">Open-source AI voice agent platform</p>
              </div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <a
                href="https://github.com/princepal9120/agentdesk"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                GitHub
              </a>
              <Link href="/dashboard" className="btn-primary">
                Open dashboard
              </Link>
            </div>
          </header>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <Orbit className="h-4 w-4" />
              Brand-first launch experience
            </div>
            <h1 className="mt-8 text-5xl font-semibold tracking-tight text-gray-950 sm:text-6xl">
              Your AI voice product should sell itself before users ever reach the dashboard.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
              AgentDesk gives you a polished first landing page, a simple setup path, and an operations dashboard behind it. For now, the brand story leads. Then setup happens. Then the dashboard takes over.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm">
                Continue to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="http://localhost:8000/docs"
                className="btn-secondary inline-flex items-center justify-center px-5 py-3 text-sm"
              >
                View API docs
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-6 text-gray-600">
                  <div className="mb-2 flex items-center gap-2 text-gray-900">
                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                    <span className="font-medium">AgentDesk flow</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <div className="rounded-[1.5rem] border border-violet-100 bg-white p-6 shadow-[0_20px_80px_-50px_rgba(124,58,237,0.55)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Launch structure</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950">Landing. Setup. Dashboard.</h2>
                </div>
                <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                  <PanelsTopLeft className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {dashboardCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-gray-500">{card.label}</p>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">{card.value}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{card.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-violet-800">
                  <ShieldCheck className="h-4 w-4" />
                  Current launch approach
                </div>
                <p className="mt-2 text-sm leading-6 text-violet-900/80">
                  Use the landing page as the brand layer for now. After setup, users move into the dashboard where the full product experience lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Positioning</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              A cleaner front door for AgentDesk, inspired by modern product-branding pages.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              The goal is simple. Make the homepage feel like a real software company first, then hand users into setup and dashboard flows without confusion.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">How users move</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
              First impression matters. Then setup. Then operations.
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              This is the right sequence for now. Sell the product clearly on the homepage. Let setup stay simple. Once that is done, the dashboard becomes the system of record.
            </p>
          </div>

          <div className="space-y-5">
            {setupFlow.map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-violet-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Workflow className="h-4 w-4 text-violet-600" />
                Current first-run path
              </div>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm">
                <pre className="whitespace-pre-wrap font-mono text-xs leading-6 sm:text-sm">{`Landing page → setup path → dashboard

OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-violet-200 bg-white px-8 py-12 shadow-[0_20px_80px_-45px_rgba(124,58,237,0.45)] sm:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">Ready to explore</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-950 sm:text-4xl">
                Use the landing page as the brand layer, then move straight into setup and dashboard.
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                This gives AgentDesk a much stronger first impression right now, while keeping the real product surface in the dashboard where it belongs.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm">
                Open dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://github.com/princepal9120/agentdesk"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary inline-flex items-center justify-center px-5 py-3 text-sm"
              >
                View GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
