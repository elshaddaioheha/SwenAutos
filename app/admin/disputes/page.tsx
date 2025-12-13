"use client";

import { useAdmin, Dispute } from "@/hooks/useAdmin";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { formatEther } from "viem";
import { DisputeReason } from "@/hooks/useAdmin";
import { Loader2, AlertTriangle, CheckCircle, Scale } from "lucide-react";

export default function DisputesPage() {
    const { disputes, arbitrator, isLoading, resolveDispute, isPending } = useAdmin();
    const { address } = useAccount();
    const [selectedDispute, setSelectedDispute] = useState<bigint | null>(null);
    const [buyerSplit, setBuyerSplit] = useState("");
    const [sellerSplit, setSellerSplit] = useState("");

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!address || (arbitrator && address.toLowerCase() !== arbitrator.toLowerCase())) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-4">
                <Scale className="w-16 h-16 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
                <p className="text-gray-500 max-w-md">
                    This page is restricted to the platform arbitrator.
                    Current Arbitrator: {arbitrator ? `${arbitrator.slice(0, 6)}...${arbitrator.slice(-4)}` : "Loading..."}
                </p>
                <div className="text-sm bg-gray-100 p-2 rounded">
                    Your Address: {address || "Not Connected"}
                </div>
            </div>
        );
    }

    const handleResolve = async (disputeId: bigint) => {
        if (!buyerSplit || !sellerSplit) return;
        try {
            await resolveDispute(Number(disputeId), buyerSplit, sellerSplit);
            setSelectedDispute(null);
            setBuyerSplit("");
            setSellerSplit("");
        } catch (e) {
            console.error(e);
        }
    };

    const getReasonString = (reason: number) => {
        return DisputeReason[reason] || "Unknown";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dispute Resolution</h1>
                        <p className="text-gray-500 mt-1">Review and resolve active disputes</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {disputes.length === 0 ? (
                        <Card className="p-12 text-center text-gray-500">
                            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                            <p className="text-lg">No disputes found. Everything is running smoothly!</p>
                        </Card>
                    ) : (
                        disputes.map((dispute) => (
                            <Card key={dispute.disputeId.toString()} className="overflow-hidden">
                                <CardHeader className="bg-gray-50 border-b border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                            Dispute #{dispute.disputeId.toString()}
                                        </CardTitle>
                                        <div className="text-sm text-gray-500">
                                            Order #{dispute.orderId.toString()}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid md:grid-cols-2 gap-8 mb-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                                                <div className="font-medium text-gray-900">{getReasonString(dispute.reason)}</div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                                                    {dispute.description}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase">Initiator</label>
                                                <div className="font-mono text-sm break-all">{dispute.initiator}</div>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <Scale className="w-4 h-4" /> Resolution Panel
                                            </h3>

                                            {dispute.resolvedAt > 0n ? (
                                                <div className="text-center py-4">
                                                    <div className="inline-flex items-center gap-2 text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-bold mb-2">
                                                        <CheckCircle className="w-4 h-4" /> Resolved
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        Buyer: {formatEther(dispute.buyerRelease)} | Seller: {formatEther(dispute.sellerRelease)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Release to Buyer (CAMP)</label>
                                                        <input
                                                            type="number"
                                                            value={buyerSplit}
                                                            onChange={e => setBuyerSplit(e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg"
                                                            placeholder="0.0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 mb-1 block">Release to Seller (CAMP)</label>
                                                        <input
                                                            type="number"
                                                            value={sellerSplit}
                                                            onChange={e => setSellerSplit(e.target.value)}
                                                            className="w-full px-3 py-2 border rounded-lg"
                                                            placeholder="0.0"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() => handleResolve(dispute.disputeId)}
                                                        disabled={isPending || !buyerSplit || !sellerSplit}
                                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold"
                                                    >
                                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                        {isPending ? "Confirming..." : "Finalize Resolution"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
