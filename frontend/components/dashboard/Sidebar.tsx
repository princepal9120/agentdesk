"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Phone, LayoutGrid, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Clients", icon: LayoutGrid },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 min-h-screen border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">AgentDesk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <UserButton afterSignOutUrl="/" />
      </div>
    </aside>
  );
}
