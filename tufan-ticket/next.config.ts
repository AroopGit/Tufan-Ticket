import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ]
      
  },
  async rewrites() {
    return [
      {
        source: '/api/ml/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy to Flask ML service
      },
    ];
  },
};

export default nextConfig;
