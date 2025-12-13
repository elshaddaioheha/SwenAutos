import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages that should not be bundled on the server
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'thread-stream',
    'valtio',
    'derive-valtio',
    'tape',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider',
    '@campnetwork/origin',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Turbopack config (Next.js 16+ default bundler)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    // Keep webpack config below for fallback compatibility
  },
  webpack: (config, { isServer }) => {
    // Only apply fallbacks for client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@react-native-async-storage/async-storage': false,
        'react-native': false,
        'fs': false,
        'net': false,
        'tls': false,
        'stream': false,
        'http': false,
        'https': false,
        'zlib': false,
        'path': false,
        'os': false,
      };
    }

    return config;
  },
};

export default nextConfig;
