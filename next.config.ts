import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Utify runs as a small Node service behind the onion — no CDN, no telemetry.
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
