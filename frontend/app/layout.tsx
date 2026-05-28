import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentDesk | Open-source AI voice agent platform",
  description:
    "AgentDesk is an open-source white-label AI voice agent platform with an OpenAI-first demo path and a production voice stack for live deployments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-[#fafafa] text-zinc-900 min-h-[100dvh] font-sans antialiased selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}
