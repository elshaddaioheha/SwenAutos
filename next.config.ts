import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages that should not be bundled on the server
  serverExternalPackages: [
    'pino',
    'thread-stream',
    'pino-pretty',
    'valtio',
    'derive-valtio',
  ],

  // Transpile packages that need it
  transpilePackages: ['@campnetwork/origin'],
};

export default nextConfig;
