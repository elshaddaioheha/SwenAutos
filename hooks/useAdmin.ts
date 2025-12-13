import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import EscrowArtifact from "@/lib/abis/Escrow.json";
import { CONTRACT_ADDRESSES } from "@/lib/campNetwork";
import { useEffect, useState, useMemo } from "react";

const ABI = EscrowArtifact.abi;
const ADDRESS = CONTRACT_ADDRESSES.ESCROW as `0x${string}`;

export enum DisputeReason {
    PRODUCT_NOT_RECEIVED = 0,
    QUALITY_ISSUE = 1,
    WRONG_ITEM = 2,
    UNAUTHORIZED_TRANSACTION = 3,
    DAMAGED_IN_TRANSIT = 4,
    OTHER = 5
}

export interface Dispute {
    disputeId: bigint;
    orderId: bigint;
    initiator: string;
    reason: DisputeReason;
    description: string;
    createdAt: bigint;
    resolvedAt: bigint;
    arbitratorAddress: string;
    buyerRelease: bigint;
    sellerRelease: bigint;
}

export function useAdmin() {
    // Write Contract
    const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    // 0. Get Arbitrator
    const { data: arbitratorAddress, isLoading: isLoadingArbitrator } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: "arbitrator",
    });

    // 1. Get Total Disputes
    const { data: totalDisputesCount, isLoading: isLoadingCount } = useReadContract({
        address: ADDRESS,
        abi: ABI,
        functionName: "getTotalDisputes",
    });

    const total = Number(totalDisputesCount || 0);

    // 2. Prepare calls for all disputes
    const disputeCalls = useMemo(() => {
        if (!total) return [];
        return Array.from({ length: total }, (_, i) => ({
            address: ADDRESS,
            abi: ABI,
            functionName: "getDispute",
            args: [BigInt(i + 1)],
        }));
    }, [total]);

    // 3. Fetch all disputes
    const { data: disputesData, isLoading: isLoadingDisputes } = useReadContracts({
        contracts: disputeCalls as any,
    });

    // 4. Transform data
    // disputesData is array of results { result, status }
    const disputes: Dispute[] = useMemo(() => {
        if (!disputesData) return [];
        return disputesData
            .filter(d => d.status === "success" && d.result)
            .map(d => d.result as unknown as Dispute);
    }, [disputesData]);


    const resolveDispute = async (disputeId: number, buyerAmount: string, sellerAmount: string) => {
        try {
            writeContract({
                address: ADDRESS,
                abi: ABI,
                functionName: "resolveDispute",
                args: [BigInt(disputeId), parseEther(buyerAmount), parseEther(sellerAmount)],
            });
        } catch (error) {
            console.error("Error evaluating dispute:", error);
            throw error;
        }
    };

    return {
        disputes,
        arbitrator: arbitratorAddress as string,
        isLoading: isLoadingCount || isLoadingDisputes || isLoadingArbitrator,
        resolveDispute,
        isPending,
        isConfirming,
        isConfirmed,
        hash,
        writeError
    };
}
