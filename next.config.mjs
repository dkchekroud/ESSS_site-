// next.config.mjs
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Webpack/Turbopack alias
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(process.cwd());
    config.resolve.alias["@/"] = path.resolve(process.cwd()); // handle "@/..."
    // Optionally map subpaths explicitly (belt & suspenders)
    config.resolve.alias["@/lib"] = path.resolve(process.cwd(), "lib");
    return config;
  },
  experimental: {
    // Turbopack must be told about aliases explicitly
    turbo: {
      resolveAlias: {
        "@": "./",
        "@/": "./",
        "@/lib": "./lib"
      }
    }
  }
};

export default nextConfig;
