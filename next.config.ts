import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/nava-fav.svg",
      },
    ];
  },
};

export default nextConfig;
