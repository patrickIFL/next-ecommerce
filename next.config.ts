import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Need for the HomeProducts to render properly.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
