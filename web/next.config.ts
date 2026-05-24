import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const webRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Solo compilar/vigilar la carpeta web (no api/, mobile/, etc.)
  turbopack: {
    root: webRoot,
  },
  outputFileTracingRoot: webRoot,
  // Menos trabajo del dev server en carpetas pesadas
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
