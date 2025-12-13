"use client";

import { useAccount } from "wagmi";
import { useBuyerOrders, useOrder, useEscrow, OrderStatus } from "@/hooks/useEscrow";
import { Loader2, Package, CheckCircle, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEther } from "viem";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastProvider";

const STATUS_LABELS = [
    "Created", "Pending Fund", "Funded", "Shipped", "Delivered", "Disputed", "Completed", "Cancelled", "Refunded"
];

const STATUS_COLORS = [
    "bg-gray-100 text-gray-800", // Created
    "bg-yellow-100 text-yellow-800", // Pending Fund
    "bg-blue-100 text-blue-800", // Funded
    "bg-purple-100 text-purple-800", // Shipped
    "bg-green-100 text-green-800", // Delivered
    "bg-red-100 text-red-800", // Disputed
    "bg-green-100 text-green-800", // Completed
    "bg-gray-100 text-gray-800", // Cancelled
    "bg-red-100 text-red-800", // Refunded
];

function OrderRow({ orderId }: { orderId: bigint }) {
    const { order, isLoading } = useOrder(Number(orderId));
    const { confirmDelivery, isConfirming, isConfirmed } = useEscrow();
    const { push } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        if (!order) return;
        setIsProcessing(true);
        try {
            await confirmDelivery(Number(orderId));
            push({ message: "Delivery confirmed successfully!", type: "success" });
        } catch (error) {
            console.error(error);
            push({ message: "Failed to confirm delivery", type: "error" });
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div className="p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>;
    if (!order) return null;

    const statusIndex = order.status;
    const statusLabel = STATUS_LABELS[statusIndex] || "Unknown";
    const statusColor = STATUS_COLORS[statusIndex] || "bg-gray-100";

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">Order #{orderId.toString()}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{formatEther(order.amount)} {order.paymentToken === "0x0000000000000000000000000000000000000000" ? "ETH" : "CAMP"}</span>
                        <span>•</span>
                        <span>{new Date(Number(order.createdAt) * 1000).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                    {statusLabel}
                </span>

                {statusIndex === 3 && ( // SHIPPED
                    <Button
                        size="sm"
                        onClick={handleConfirm}
                        disabled={isProcessing || isConfirming}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isProcessing || isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Receipt"}
                    </Button>
                )}

                {statusIndex === 4 && ( // DELIVERED
                    <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Delivered
                    </span>
                )}
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const { address, isConnected } = useAccount();
    const { orderIds, isLoading, isError } = useBuyerOrders(address || "");

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-2">Connect Wallet</h2>
                    <p className="text-gray-500 mb-4">Please connect your wallet to view your orders.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F8F5] py-8">
            <div className="container px-4 md:px-6">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        Failed to load orders.
                    </div>
                ) : !orderIds || orderIds.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No orders found.</p>
                        <Link href="/shop">
                            <Button variant="link" className="text-blue-600 mt-2">Start Shopping</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[...orderIds].reverse().map((id) => (
                            <OrderRow key={id.toString()} orderId={id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
