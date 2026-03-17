import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async rewrites() {
      return [
        {
          source: '/a/:path*',
          destination: 'https://analytics.afrotomation.com/:path*',
        },
      ];
    },
  serverExternalPackages: ['@neondatabase/serverless'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
