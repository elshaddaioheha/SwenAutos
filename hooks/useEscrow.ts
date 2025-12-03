import { useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { useViem } from '@campnetwork/origin/react';
import { useState } from 'react';
import EscrowArtifact from '@/contracts/artifacts/contracts/EscrowContract.sol/EscrowContract.json';
import { CONTRACT_ADDRESSES } from '@/lib/campNetwork';
import { parseEther } from 'viem';

const ABI = EscrowArtifact.abi;
const ADDRESS = CONTRACT_ADDRESSES.ESCROW as `0x${string}`;

export enum OrderStatus {
    CREATED,          // 0
    PENDING_FUND,     // 1
    FUNDED,           // 2
    SHIPPED,          // 3
    DELIVERED,        // 4
    DISPUTED,         // 5
    COMPLETED,        // 6
    CANCELLED,        // 7
    REFUNDED          // 8
}

export enum PaymentMethod {
    CAMP_TOKEN,       // 0
    PAYSTACK,         // 1
    FLUTTERWAVE       // 2
}

export enum DisputeReason {
    PRODUCT_NOT_RECEIVED,      // 0
    QUALITY_ISSUE,             // 1
    WRONG_ITEM,                // 2
    UNAUTHORIZED_TRANSACTION,  // 3
    DAMAGED_IN_TRANSIT,        // 4
    OTHER                      // 5
}

export function useEscrow() {
    const { client } = useViem();
    const [isPending, setIsPending] = useState(false);
    const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);
    const [error, setError] = useState<Error | null>(null);

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const createOrder = async (
        productId: number,
        seller: string,
        amount: string,
        paymentToken: string,
        paymentMethod: PaymentMethod,
        externalPaymentId: string
    ) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'createOrder',
                args: [
                    BigInt(productId),
                    seller,
                    parseEther(amount),
                    paymentToken,
                    paymentMethod,
                    externalPaymentId
                ],
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

    const fundEscrow = async (orderId: number, amount: string) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'fundEscrow',
                args: [BigInt(orderId), parseEther(amount)],
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

    const markShipped = async (orderId: number, trackingNumber: string) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'markShipped',
                args: [BigInt(orderId), trackingNumber],
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

    const confirmDelivery = async (orderId: number) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'confirmDelivery',
                args: [BigInt(orderId)],
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

    const openDispute = async (orderId: number, reason: DisputeReason, description: string) => {
        setIsPending(true);
        setError(null);
        try {
            if (!client) throw new Error("Wallet not connected");

            const txHash = await client.writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: 'openDispute',
                args: [BigInt(orderId), reason, description],
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
        createOrder,
        fundEscrow,
        markShipped,
        confirmDelivery,
        openDispute,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        error
    };
}

export function useOrder(orderId: number) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getOrder',
        args: [BigInt(orderId)],
    });

    return {
        order: data as any,
        isError,
        isLoading
    };
}

export function useBuyerOrders(buyerAddress: string) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getBuyerOrders',
        args: [buyerAddress],
    });

    return {
        orderIds: data as bigint[],
        isError,
        isLoading
    };
}

export function useSellerOrders(sellerAddress: string) {
    const { data, isError, isLoading } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: 'getSellerOrders',
        args: [sellerAddress],
    });

    return {
        orderIds: data as bigint[],
        isError,
        isLoading
    };
}
