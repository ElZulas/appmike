import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const webRoot = path.dirname(fileURLToPath(import.meta.url));
// Monorepo: Vercel Root Directory = web, pero el tracing debe ver la raíz del repo
const monorepoRoot = path.resolve(webRoot, "..");

const apiServer = (
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  /** Mismo origen en el navegador → evita CORS con Render */
  async rewrites() {
    return [{ source: "/api-backend/:path*", destination: `${apiServer}/:path*` }];
  },
  // Evita Turbopack en build (falla en Vercel con WorkerError)
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/../api/**",
          "**/../mobile/**",
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
