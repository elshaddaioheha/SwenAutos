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
};

export default nextConfig;
