import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization is supported on Cloudflare if configured, but keeping unoptimized is safer for simple setups.
  images: {
    unoptimized: true,
  },
  // Turbopack configuration to reduce resource usage
  experimental: {
    turbo: {
      rules: {
        '*.tsx': {
          loaders: ['tsx-loader'],
        },
      },
      memoryLimit: 4096, // Limit to 4GB of memory
    },
  },
};

export default nextConfig;
