'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampProvider } from '@campnetwork/origin/react';
import { baseCampTestnet } from '@/lib/campNetwork';
import { injected } from 'wagmi/connectors';
import { ReactNode, useMemo } from 'react';

// Configure Wagmi
const config = createConfig({
    chains: [baseCampTestnet],
    connectors: [
        injected(),
    ],
    transports: {
        [baseCampTestnet.id]: http(),
    },
    ssr: true,
});

export function Web3Provider({ children }: { children: ReactNode }) {
    // Create query client inside component to avoid SSR issues
    const queryClient = useMemo(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
            },
        },
    }), []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <CampProvider
                    clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || "00000000-0000-0000-0000-000000000000"}
                    environment="DEVELOPMENT"
                >
                    {children}
                </CampProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
