import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Active Turbopack proprement
  turbopack: {
    resolveAlias: {
      "@lib": path.resolve(__dirname, "../lib"),
    },
  },

  // ✅ Corrige l'avertissement "workspace root"
  experimental: {
    turbopackRoot: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
