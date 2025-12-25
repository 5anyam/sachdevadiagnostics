import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['thesiswriting.xyz', 'images.remotePatterns', 'images.unsplash.com'],
  }
};

export default nextConfig;
