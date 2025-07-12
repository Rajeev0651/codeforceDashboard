import type { NextConfig } from "next";

// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ allow builds with eslint warnings/errors
  },
};

module.exports = nextConfig;