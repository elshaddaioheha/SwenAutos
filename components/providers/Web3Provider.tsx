'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CampProvider } from '@campnetwork/origin/react';
import { baseCampTestnet } from '@/lib/campNetwork';
import { injected, walletConnect } from 'wagmi/connectors';
import { ReactNode, useEffect, useState } from 'react';

// Configure Wagmi
const config = createConfig({
    chains: [baseCampTestnet],
    connectors: [
        injected(),
        // WalletConnect can be added with project ID
        // walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }),
    ],
    transports: {
        [baseCampTestnet.id]: http(),
    },
    ssr: true,
});

// Create a react-query client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

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
