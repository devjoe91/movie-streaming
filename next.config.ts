import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Your existing config options here */

  eslint: {
    ignoreDuringBuilds: true, // ⬅ Skip ESLint errors during build
  },
};

export default nextConfig;
