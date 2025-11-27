import { defineChain } from 'viem';

/**
 * CAMP Network (BaseCAMP Testnet) Configuration
 */
export const baseCampTestnet = defineChain({
    id: 123420001114,
    name: 'BaseCAMP Testnet',
    network: 'basecamp',
    nativeCurrency: {
        decimals: 18,
        name: 'CAMP',
        symbol: 'CAMP',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.basecamp.t.raas.gelato.cloud'],
        },
        public: {
            http: ['https://rpc.basecamp.t.raas.gelato.cloud', 'https://rpc-campnetwork.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://basecamp.cloud.blockscout.com',
        },
    },
    testnet: true,
});

/**
 * Contract Addresses (to be filled after deployment)
 */
export const CONTRACT_ADDRESSES = {
    ESCROW: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '',
    RATING: process.env.NEXT_PUBLIC_RATING_CONTRACT_ADDRESS || '',
    PRODUCT_LISTING: process.env.NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS || '',
} as const;

/**
 * CAMP Network Configuration
 */
export const CAMP_NETWORK_CONFIG = {
    chainId: 123420001114,
    name: 'BaseCAMP Testnet',
    currency: 'CAMP',
    explorerUrl: 'https://basecamp.cloud.blockscout.com',
    rpcUrl: process.env.NEXT_PUBLIC_CAMP_RPC_URL || 'https://rpc.basecamp.t.raas.gelato.cloud',
} as const;
