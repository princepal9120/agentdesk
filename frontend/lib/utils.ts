import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDuration(seconds: number) {
  if (!seconds) return "0s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function planLabel(plan: string) {
  return { starter: "Starter", pro: "Pro", agency: "Agency" }[plan] ?? plan;
}

export function verticalLabel(v: string) {
  return { salon: "Salon", restaurant: "Restaurant", repair: "Repair Shop", general: "General" }[v] ?? v;
}
