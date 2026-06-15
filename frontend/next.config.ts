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
      { hostname: 'cdn-images.dzcdn.net' },      // Deezer
      { hostname: 'cdns-images.dzcdn.net' },     // Deezer alt
      { hostname: 'api.jamendo.com' },            // Jamendo
      { hostname: 'usercontent.jamendo.com' },   // Jamendo uploads
      { hostname: 'creativecommons.org' },       // Audius
      { hostname: '*.audius.co' },               // Audius CDN
      { hostname: 'static.codia.ai' },           // твои моки
      { hostname: 'i1.sndcdn.com' },  // soundcloud
      { hostname: 'i.scdn.co' },  // soundcloud 
      { hostname: 'a1.sndcdn.com' }, // soundcloud
    ],
  },
};

export default nextConfig;