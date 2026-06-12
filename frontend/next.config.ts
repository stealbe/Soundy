import type { NextConfig } from "next";
// ← убери import 'dotenv/config'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'static.codia.ai' },
    ],
  },
};

export default nextConfig;