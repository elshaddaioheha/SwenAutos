import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useViem } from '@campnetwork/origin/react';
import { useState } from 'react';
// import ProductListingArtifact from '@/contracts/artifacts/contracts/ProductListingContract.sol/ProductListingContract.json';
import { CONTRACT_ADDRESSES } from '@/lib/campNetwork';

// TODO: Replace with actual ABI once contracts are deployed
const ABI = [] as any;
const ADDRESS = CONTRACT_ADDRESSES.PRODUCT_LISTING as `0x${string}`;

export function useProductListing() {
    const { client } = useViem();
    const [isPending, setIsPending] = useState(false);
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const createListing = async (
        name: string,
        description: string,
        category: string,
        price: string, // in ETH/CAMP
        inventory: number,
        ipfsHash: string = ""
    ) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'createListing',
                args: [
                    name,
                    description,
                    category,
                    parseEther(price),
                    "0x0000000000000000000000000000000000000000", // Native token
                    BigInt(inventory),
                    ipfsHash
                ],
            });
            setHash(txHash);
        } catch (err: any) {
            console.error("Transaction failed:", err);
            setError(err);
        } finally {
            setIsPending(false);
        }
    };

    return {
        createListing,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error
    };
}

export function useAllProducts(offset: number = 0, limit: number = 10) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getAllActiveProducts',
        args: [BigInt(offset), BigInt(limit)],
    });

    return {
        products: data as any[],
        isError,
        isLoading
    };
}
