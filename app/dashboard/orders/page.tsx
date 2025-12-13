"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Clock, CheckCircle, AlertCircle, Truck, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { useSellerOrders, useOrder, useEscrow, OrderStatus } from "@/hooks/useEscrow";
import { formatEther } from "viem";
import { useState } from "react";
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

function SellerOrderRow({ orderId }: { orderId: bigint }) {
    const { order, isLoading } = useOrder(Number(orderId));
    const { markShipped, isConfirming } = useEscrow();
    const { push } = useToast();

    const [isShipping, setIsShipping] = useState(false);
    const [trackingNumber, setTrackingNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) return <div className="p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>;
    if (!order) return null;

    const statusIndex = order.status;
    const statusLabel = STATUS_LABELS[statusIndex] || "Unknown";
    const statusColor = STATUS_COLORS[statusIndex] || "bg-gray-100";

    const handleMarkShipped = async () => {
        if (!trackingNumber.trim()) {
            push({ message: "Please enter a tracking number", type: "error" });
            return;
        }
        setIsSubmitting(true);
        try {
            await markShipped(Number(orderId), trackingNumber);
            push({ message: "Order marked as shipped!", type: "success" });
            setIsShipping(false);
        } catch (error) {
            console.error(error);
            push({ message: "Failed to mark as shipped", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${statusColor}`}>
                            <Package className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900">Order #{orderId.toString()}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
                                    {statusLabel}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">Buyer: {order.buyer.slice(0, 6)}...{order.buyer.slice(-4)}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(Number(order.createdAt) * 1000).toLocaleDateString()}
                            </p>
                            {order.trackingNumber && (
                                <p className="text-xs text-blue-600 mt-1">Tracking: {order.trackingNumber}</p>
                            )}
                        </div>
                    </div>
                    <div className="text-right w-full md:w-auto">
                        <p className="font-semibold text-lg text-gray-900">
                            {formatEther(order.amount)} {order.paymentToken === "0x0000000000000000000000000000000000000000" ? "ETH" : "CAMP"}
                        </p>

                        {/* Action Buttons */}
                        <div className="mt-4 flex flex-col items-end gap-2">
                            {statusIndex === 2 && !isShipping && ( // FUNDED
                                <Button size="sm" onClick={() => setIsShipping(true)}>
                                    Mark as Shipped
                                </Button>
                            )}

                            {isShipping && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                    <Input
                                        placeholder="Tracking Number"
                                        className="w-40 h-8 text-xs"
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        onClick={handleMarkShipped}
                                        disabled={isSubmitting || isConfirming}
                                    >
                                        {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setIsShipping(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            )}

                            {statusIndex === 3 && ( // SHIPPED
                                <span className="text-xs text-gray-500 italic">Awaiting delivery confirmation</span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function MyOrders() {
    const { address } = useAccount();
    const { orderIds, isLoading } = useSellerOrders(address || "");

    return (
        <ProtectedRoute requireSeller={true}>
            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Orders Received</h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : !orderIds || orderIds.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">No orders received yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {[...orderIds].reverse().map((id) => (
                            <SellerOrderRow key={id.toString()} orderId={id} />
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
