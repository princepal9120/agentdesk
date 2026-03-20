"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";

const VERTICALS = [
  { value: "salon", label: "Salon / Spa" },
  { value: "restaurant", label: "Restaurant" },
  { value: "repair", label: "Repair Shop" },
  { value: "general", label: "General Business" },
];

export default function NewBusiness() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [vertical, setVertical] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="max-w-md mx-auto px-4 py-10">
      <Link href="/dashboard" className="text-sm text-gray-400 flex items-center gap-1 mb-6 hover:text-gray-600">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-lg font-bold mb-5">Add a business</h1>
      <form onSubmit={submit} className="card space-y-4">
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
          <label className="label">Type</label>
          <select
            className="input"
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
          >
            {VERTICALS.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating..." : "Create business"}
        </button>
      </form>
    </div>
  );
}
