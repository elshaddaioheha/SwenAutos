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
 * Contract Addresses (Deployed on local Hardhat)
 */
export const CONTRACT_ADDRESSES = {
    ESCROW: process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
    RATING: process.env.NEXT_PUBLIC_RATING_CONTRACT_ADDRESS || '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    PRODUCT_LISTING: process.env.NEXT_PUBLIC_PRODUCT_LISTING_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MOCK_ERC20: process.env.NEXT_PUBLIC_MOCK_ERC20_ADDRESS || '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
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
