import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useViem } from '@campnetwork/origin/react';
import { useState } from 'react';
import RatingArtifact from '@/contracts/artifacts/contracts/RatingContract.sol/RatingContract.json';
import { CONTRACT_ADDRESSES } from '@/lib/campNetwork';

const ABI = RatingArtifact.abi;
const ADDRESS = CONTRACT_ADDRESSES.RATING as `0x${string}`;

export function useRating() {
    const { client } = useViem();
    const [isPending, setIsPending] = useState(false);
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const submitRating = async (
        orderId: number,
        seller: string,
        score: number,
        reviewHash: string
    ) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'submitRating',
                args: [BigInt(orderId), seller, score, reviewHash],
            });
            setHash(txHash);
            return txHash;
        } catch (err: any) {
            console.error("Transaction failed:", err);
            setError(err);
            throw err;
        } finally {
            setIsPending(false);
        }
    };

    return {
        submitRating,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error
    };
}

export function useSellerAggregateRating(sellerAddress: string) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getSellerAggregateRating',
        args: [sellerAddress],
    });

    return {
        rating: data as any,
        isError,
        isLoading
    };
}

export function useSellerRatings(sellerAddress: string, offset: number = 0, limit: number = 10) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getSellerRatings',
        args: [sellerAddress, BigInt(offset), BigInt(limit)],
    });

    return {
        ratings: data as any[],
        isError,
        isLoading
    };
}
