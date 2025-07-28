import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cms.decorationcart.com', 'images.remotePatterns', 'images.unsplash.com'],
  }
};

export default nextConfig;
