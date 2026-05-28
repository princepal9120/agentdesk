import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentDesk | Open-source AI voice agent platform",
  description:
    "AgentDesk is an open-source white-label AI voice agent platform with an OpenAI-first demo path and a production voice stack for live deployments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  );
}
