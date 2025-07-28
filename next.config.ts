import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['cms.decorationcart.com', 'remotePatterns', 'images.unsplash.com'],
  }
};

export default nextConfig;
