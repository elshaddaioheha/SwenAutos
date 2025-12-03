"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function MyOrders() {
    const orders = [
        {
            id: "ORD-001",
            product: "Engine Oil Filter - Toyota Camry",
            buyer: "John Doe",
            amount: "₦12,500",
            date: "Dec 1, 2024",
            status: "pending",
            statusColor: "bg-yellow-100 text-yellow-800",
            icon: Clock
        },
        {
            id: "ORD-002",
            product: "Brake Pads Set - Honda Accord",
            buyer: "Jane Smith",
            amount: "₦28,000",
            date: "Nov 28, 2024",
            status: "shipped",
            statusColor: "bg-blue-100 text-blue-800",
            icon: Package
        },
        {
            id: "ORD-003",
            product: "Air Filter Universal",
            buyer: "Mike Johnson",
            amount: "₦8,500",
            date: "Nov 25, 2024",
            status: "delivered",
            statusColor: "bg-green-100 text-green-800",
            icon: CheckCircle
        },
        {
            id: "ORD-004",
            product: "Car Battery 12V",
            buyer: "Sarah Williams",
            amount: "₦45,000",
            date: "Nov 20, 2024",
            status: "disputed",
            statusColor: "bg-red-100 text-red-800",
            icon: AlertCircle
        },
    ];

    return (
        <ProtectedRoute requireSeller={true}>
            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                    <p className="text-gray-500 mt-1">Track and manage customer orders</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => {
                        const StatusIcon = order.icon;
                        return (
                            <Card key={order.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`p-3 rounded-lg ${order.statusColor}`}>
                                                <StatusIcon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-semibold text-gray-900">{order.product}</h3>
                                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${order.statusColor}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">From: {order.buyer}</p>
                                                <p className="text-sm text-gray-500">{order.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-lg text-gray-900">{order.amount}</p>
                                            <p className="text-sm text-gray-500 mt-1">Order {order.id}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1">
                                            View Details
                                        </Button>
                                        {order.status === "pending" && (
                                            <Button size="sm" className="flex-1">
                                                Mark as Shipped
                                            </Button>
                                        )}
                                        {order.status === "shipped" && (
                                            <Button size="sm" className="flex-1" disabled>
                                                Awaiting Delivery Confirmation
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </ProtectedRoute>
    );
}
