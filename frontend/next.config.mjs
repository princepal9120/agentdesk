import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const cloudflare = process.env.CLOUDFLARE === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Docker keeps standalone. Cloudflare Pages/Workers uses static export.
  output: cloudflare ? "export" : "standalone",
  ...(cloudflare ? { images: { unoptimized: true } } : {}),
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
