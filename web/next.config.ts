import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const webRoot = path.dirname(fileURLToPath(import.meta.url));
// Monorepo: Vercel Root Directory = web, pero el tracing debe ver la raíz del repo
const monorepoRoot = path.resolve(webRoot, "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
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
