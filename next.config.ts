import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint on Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  images: {
    domains: ['archive.org'],
  },
};

export default nextConfig;
