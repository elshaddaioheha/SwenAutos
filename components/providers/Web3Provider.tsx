'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseCampTestnet } from '@/lib/campNetwork';
import { injected, walletConnect } from 'wagmi/connectors';
import { ReactNode } from 'react';

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
});

// Create a react-query client
const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
