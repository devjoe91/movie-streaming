import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'archive.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Fast build optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
