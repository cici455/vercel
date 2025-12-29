import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages works best with default (dynamic) output if using Edge functions,
  // or 'export' if purely static. Since we have API routes, we remove 'export' to allow server-side features.
  // output: "export", 

  // Image optimization is supported on Cloudflare if configured, but keeping unoptimized is safer for simple setups.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
