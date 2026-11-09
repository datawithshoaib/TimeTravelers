import type { NextConfig } from "next";

// FastAPI backend. Read at build time (next.config is serialized into the
// standalone server), so Docker passes it as a build arg.
const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Proxy API calls through Next so the browser talks to a single origin (no CORS).
  async rewrites() {
    return [
      { source: "/api/v1/:path*", destination: `${apiInternalUrl}/api/v1/:path*` },
      { source: "/health/:path*", destination: `${apiInternalUrl}/health/:path*` },
    ];
  },
};

export default nextConfig;
