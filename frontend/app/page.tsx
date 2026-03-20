import Link from "next/link";
import { Phone, Zap, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "AI voice agents in minutes",
    desc: "Pick a template, customize the name, deploy. Your client gets a real phone number.",
  },
  {
    icon: Globe,
    title: "White-labeled for your agency",
    desc: "Your brand, your subdomain. Clients see your agency name, not ours.",
  },
  {
    icon: Zap,
    title: "Handles calls 24/7",
    desc: "Books appointments, answers FAQs, takes messages. Never misses a call.",
  },
  {
    icon: BarChart3,
    title: "Call logs and analytics",
    desc: "See every call, duration, and outcome. Know what's working.",
  },
];

const plans = [
  { name: "Starter", price: "$49", clients: "3 clients", calls: "300 calls/mo" },
  { name: "Pro", price: "$99", clients: "10 clients", calls: "1,000 calls/mo", highlight: true },
  { name: "Agency", price: "$199", clients: "Unlimited clients", calls: "Unlimited calls" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">AgentDesk</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="btn-secondary">Sign in</Link>
          <Link href="/sign-up" className="btn-primary">Start free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="inline-block px-3 py-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-full mb-6">
          White-label AI Voice Agents for Agencies
        </span>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Deploy AI receptionists
          <br />
          for every client you have
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Your clients need a phone line that never sleeps. You need a platform
          that handles it all. AgentDesk gives you both.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="btn-primary px-8 py-3 text-base">
            Get started free
          </Link>
          <span className="text-gray-400 text-sm">No credit card required</span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Simple pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`card flex flex-col ${p.highlight ? "border-violet-500 border-2 relative" : ""}`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full">
                  Most popular
                </span>
              )}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">{p.name}</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">
                  {p.price}<span className="text-base font-normal text-gray-400">/mo</span>
                </p>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                <li className="text-sm text-gray-600">{p.clients}</li>
                <li className="text-sm text-gray-600">{p.calls}</li>
                <li className="text-sm text-gray-600">White-label dashboard</li>
                <li className="text-sm text-gray-600">All templates included</li>
              </ul>
              <Link
                href="/sign-up"
                className={p.highlight ? "btn-primary text-center" : "btn-secondary text-center"}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        AgentDesk — Built for AI agencies
      </footer>
    </div>
  );
}
