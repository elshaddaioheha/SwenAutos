"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Package, Truck, Calendar, CreditCard, MapPin, ArrowRight, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    // Mock Data - In a real app, fetch this using the ID
    const order = {
        id: id || "ORD-7782-XJ92",
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: "Processing",
        total: 61300,
        paymentMethod: id.includes("crypto") ? "Crypto (CAMP)" : "Debit Card",
        transactionRef: id.includes("crypto") ? "0x71C...9A23" : "REF-88293022",
        items: [
            { name: "Toyota Camry Brake Pad Set", price: 12500, qty: 1, image: "/placeholder-part.png" },
            { name: "Honda Accord Air Filter", price: 17800, qty: 2, image: "/placeholder-part.png" },
            { name: "Mercedes Shock Absorber", price: 28500, qty: 1, image: "/placeholder-part.png" },
        ],
        delivery: {
            method: "Home Delivery",
            address: "123 Admiralty Way, Lekki Phase 1, Lagos",
            eta: "3 - 5 Business Days"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">

                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500">Thank you for your purchase. Your order has been received.</p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="text-sm text-gray-500 mb-1">Order ID</div>
                            <div className="font-bold text-gray-900 flex items-center gap-2">
                                #{order.id}
                                <button className="text-gray-400 hover:text-primary transition-colors">
                                    <Copy className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="text-sm text-gray-500 mb-1">Date</div>
                            <div className="font-bold text-gray-900">{order.date}</div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Items */}
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Items Ordered
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Image src={item.image} width={40} height={40} alt={item.name} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                                        </div>
                                        <div className="font-bold text-gray-900">₦{item.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Delivery Info */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-primary" />
                                    Delivery Information
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex gap-3">
                                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-gray-900">Delivery Address</div>
                                            <div className="text-gray-500">{order.delivery.address}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-bold text-gray-900">Estimated Delivery</div>
                                            <div className="text-gray-500">{order.delivery.eta}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Info */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    Payment Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-bold text-gray-900">{order.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Transaction Ref</span>
                                        <span className="font-mono text-gray-900">{order.transactionRef}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                                        <span className="font-bold text-gray-900">Total Amount</span>
                                        <span className="font-bold text-primary text-lg">₦{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-gray-200">
                            Return to Dashboard
                        </Button>
                    </Link>
                    <Link href="/dashboard/orders">
                        <Button className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-blue-600/20">
                            Track Order <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
