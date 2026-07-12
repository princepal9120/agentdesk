import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CodeBlock,
  Stack,
  MicrophoneStage,
  Planet,
  Browser,
  ShieldCheck,
  Sparkle,
  Graph,
} from "@phosphor-icons/react/dist/ssr";

const pillars = [
  {
    title: "Brand-first launch surface",
    description:
      "Give every visitor a sharp first impression before they ever enter the product. Lead with positioning, clarity, and a credible product story.",
    icon: Sparkle,
  },
  {
    title: "White-label agency workflow",
    description:
      "Run multiple business setups from one dashboard and shape the experience like a product your clients would gladly pay for.",
    icon: Stack,
  },
  {
    title: "Open-source control",
    description:
      "Own the stack, customize the flows, and keep the path open from quick demo setup to a more advanced production rollout.",
    icon: CodeBlock,
  },
];

const highlights = [
  "Lead with product clarity before asking users to configure anything.",
  "Keep first-run setup lightweight with an OpenAI-first demo path.",
  "Hand users into a workspace that already feels operational.",
  "Preserve a path from demo onboarding to a deeper voice stack later.",
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
    value: "Clear positioning",
    note: "A sharper product story with a calmer, more premium first impression.",
  },
  {
    label: "Setup",
    value: "Fast onboarding",
    note: "A lightweight first-run path that gets users into the product quickly.",
  },
  {
    label: "Dashboard",
    value: "Operational core",
    note: "Workspaces, businesses, and call flows stay organized in one place.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 overflow-hidden">
      <section className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 py-4 lg:px-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
                <MicrophoneStage weight="fill" className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-zinc-950">AgentDesk</p>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Open-source voice agent</p>
              </div>
            </div>
            <div className="hidden items-center gap-4 sm:flex">
              <a
                href="https://github.com/princepal9120/agentdesk"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                GitHub Repo
              </a>
              <Link href="/dashboard" className="btn-primary">
                Open Dashboard
              </Link>
            </div>
          </header>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="mx-auto grid max-w-[1400px] gap-16 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-32 relative z-10">
          <div className="max-w-3xl flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/60 backdrop-blur-md px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm w-fit">
              <Planet weight="fill" className="h-4 w-4 text-emerald-500" />
              Brand-first launch experience
            </div>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tighter text-zinc-950 sm:text-7xl leading-[1.05]">
              A warmer, calmer front door for AI voice.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600">
              AgentDesk now feels grounded and professional. The experience opens with a premium brand layer, moves into lightweight setup, and hands users into an operational workspace built for AI calling.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base">
                Explore Dashboard
                <ArrowRight weight="bold" className="h-5 w-5" />
              </Link>
              <a
                href="http://localhost:8000/docs"
                className="btn-secondary inline-flex items-center justify-center px-8 py-4 text-base"
              >
                View API Docs
              </a>
            </div>

            <div className="mt-16 grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="surface-muted p-5 text-sm leading-relaxed text-zinc-600 border-none bg-zinc-100/50">
                  <div className="mb-3 flex items-center gap-2 text-zinc-950">
                    <CheckCircle weight="fill" className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold tracking-tight">AgentDesk Flow</span>
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-8 bg-zinc-900 border-zinc-800 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
            <div className="surface border-zinc-700/50 bg-zinc-800/50 p-8 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Launch Structure</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Landing. Setup. Workspace.</h2>
                </div>
                <div className="rounded-2xl bg-zinc-700/50 p-4 text-emerald-400">
                  <Browser weight="duotone" className="h-8 w-8" />
                </div>
              </div>

              <div className="space-y-4">
                {dashboardCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-zinc-700/50 bg-zinc-800/80 p-5 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="text-sm font-semibold text-zinc-300">{card.label}</p>
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">{card.value}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{card.note}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
                  <ShieldCheck weight="fill" className="h-5 w-5" />
                  Current Launch Approach
                </div>
                <p className="text-sm leading-relaxed text-emerald-100/70">
                  Use the landing page as the brand layer for now. After setup, users move into the dashboard where the full product experience lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 border-y border-zinc-200/50">
        <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Positioning</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl leading-tight">
              A cleaner front door for AgentDesk, inspired by modern product branding.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              The goal is simple. Make the homepage feel like a real software company first, then hand users into setup and dashboard flows without confusion.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {pillars.map(({ title, description, icon: Icon }) => (
              <div key={title} className="surface p-8 transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 mb-6">
                  <Icon weight="duotone" className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="sticky top-32">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">How users move</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-zinc-950 sm:text-5xl leading-tight">
              First impression. Then setup. Then operations.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-zinc-500">
              This is the right sequence for now. Sell the product clearly on the homepage. Let setup stay simple. Once that is done, the dashboard becomes the system of record.
            </p>
          </div>

          <div className="space-y-6">
            {setupFlow.map((step, index) => (
              <div key={step.title} className="surface p-8 transition-transform hover:-translate-y-1">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-zinc-900 text-base font-bold text-white shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-zinc-950">{step.title}</h3>
                    <p className="mt-3 text-base leading-relaxed text-zinc-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="surface-muted p-8 border-none bg-zinc-100">
              <div className="flex items-center gap-3 text-sm font-bold text-zinc-900 mb-6">
                <Graph weight="fill" className="h-5 w-5 text-emerald-600" />
                Current First-Run Path
              </div>
              <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-800">{`Landing page → setup path → dashboard

OPENAI_API_KEY=sk-...
VOICE_MODE=demo
VOICE_PROVIDER=openai`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-[1400px] rounded-[3rem] bg-zinc-950 px-8 py-16 text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] sm:px-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
             <MicrophoneStage size={400} weight="duotone" />
          </div>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Ready to explore</p>
              <h2 className="mt-6 text-4xl font-semibold tracking-tighter text-white sm:text-6xl leading-[1.1]">
                Start with a stronger landing page, move naturally into setup.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                This makes AgentDesk feel more considered, more premium, and more trustworthy while keeping the real product depth in the dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row shrink-0">
              <Link href="/dashboard" className="btn-primary bg-emerald-500 border-emerald-500 hover:bg-emerald-600 hover:border-emerald-600 text-white inline-flex items-center justify-center gap-2 px-8 py-4 text-base">
                Open Dashboard
                <ArrowRight weight="bold" className="h-5 w-5" />
              </Link>
              <a
                href="https://github.com/princepal9120/agentdesk"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 hover:text-white inline-flex items-center justify-center px-8 py-4 text-base transition-colors"
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
