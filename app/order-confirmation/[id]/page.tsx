"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, Package, Truck, Calendar, CreditCard, MapPin, ArrowRight, Copy, DownloadCloud } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import DeliveryTracker from "@/components/delivery/DeliveryTracker";
import { getOrder, canBuyerConfirmDelivery, confirmDeliveryOnChain, releaseFundsToSellerOnChain } from "../../../lib/escrowHooks";
import { logEvent } from "../../../lib/analytics";
import { useToast } from "@/components/ToastProvider";

export default function OrderConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [copied, setCopied] = useState(false);
    const [showTracker, setShowTracker] = useState(false);
    const [chainOrder, setChainOrder] = useState<any | null>(null);
    const [canConfirm, setCanConfirm] = useState(false);
    const printableRef = useRef<HTMLDivElement | null>(null);
    const toast = useToast();

    // Mock Data - replace with real fetch
    const order = {
        id: id || "SWA-2025-001234",
        date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
        status: "Payment Confirmed",
        total: 38700,
        paymentMethod: "Cryptocurrency (ETH)",
        transactionRef: "0x71C...9A23",
        items: [
            { name: "Toyota Camry Brake Pad Set - Front", price: 12500, qty: 1, image: "/placeholder-part.png" },
            { name: "Honda Accord Engine Air Filter", price: 8900, qty: 1, image: "/placeholder-part.png" },
            { name: "Shock Absorber", price: 14800, qty: 2, image: "/placeholder-part.png" },
        ],
        delivery: {
            method: "Home Delivery",
            address: "123 Main Street, Ikeja, Lagos",
            eta: "Jan 18-20, 2025"
        }
    };

    useEffect(() => {
        if (copied) {
            const t = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(t);
        }
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(order.id);
            setCopied(true);
        } catch (e) {
            console.error("copy failed", e);
        }
    };

    const handleDownloadReceipt = () => {
        // Simple printable window approach
        const content = printableRef.current?.innerHTML || "";
        const win = window.open("", "_blank", "width=700,height=900");
        if (!win) return;
        win.document.write(`<!doctype html><html><head><title>Receipt - ${order.id}</title>`);
        win.document.write('<style>body{font-family:Inter, system-ui, Arial; padding:20px;} .h{font-weight:700}</style>');
        win.document.write("</head><body>");
        win.document.write(content);
        win.document.write("</body></html>");
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); }, 300);
    };

    const handleTrack = async () => {
        logEvent("track_clicked", { orderId: id });
        const numericId = Number(id) || 1;
        try {
            const o = await getOrder(numericId);
            setChainOrder(o);
            const ok = await canBuyerConfirmDelivery(numericId);
            setCanConfirm(Boolean(ok));
            setShowTracker(true);
        } catch (e) {
            console.error(e);
            toast.push({ message: "Could not fetch on-chain order data. Make sure wallet is connected and network is correct.", type: "error" });
        }
    };

    const handleConfirmReceipt = async () => {
        logEvent("confirm_receipt_clicked", { orderId: id });
        const numericId = Number(id) || 1;
        try {
            const tx1 = await confirmDeliveryOnChain(numericId);
            console.info("confirm tx", tx1);
            // If contract requires, immediately release funds to seller
            const amount = chainOrder?.amount ?? (order.total * 1000000000000000000);
            const tx2 = await releaseFundsToSellerOnChain(numericId, amount.toString());
            console.info("release tx", tx2);
            toast.push({ message: "Delivery confirmed and funds released (txs submitted). You may view transaction on your wallet.", type: "success" });
        } catch (e) {
            console.error(e);
            toast.push({ message: "Confirm failed: " + ((e as any)?.message ?? ""), type: "error" });
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F8F5] py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b bg-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex items-center justify-center">
                                    <Check className="text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
                                    <p className="text-sm text-gray-500">Thank you for your purchase</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Order Number</div>
                                <div className="flex items-center gap-2 font-bold text-blue-700">{order.id}
                                    <button onClick={handleCopy} aria-label="Copy order number" className="ml-2 text-gray-500 hover:text-gray-700">
                                        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6" ref={printableRef}>
                        <div>
                            <div className="bg-[#F8F8F5] p-4 rounded-md mb-4">
                                <div className="text-sm text-gray-500">Amount Paid</div>
                                <div className="font-bold text-lg">₦{order.total.toLocaleString()}</div>
                            </div>

                            <div className="bg-[#F8F8F5] p-4 rounded-md mb-4">
                                <div className="text-sm text-gray-500">Payment Method</div>
                                <div className="font-bold">{order.paymentMethod}</div>
                            </div>

                            <div className="bg-[#F8F8F5] p-4 rounded-md">
                                <div className="text-sm text-gray-500">Status</div>
                                <div className="font-bold text-green-600">{order.status}</div>
                            </div>

                            <div className="mt-6 bg-white rounded-md p-4 border">
                                <h4 className="font-bold mb-2">Funds Held in Escrow</h4>
                                <p className="text-sm text-gray-700">Your payment is safely held in our secure escrow system until you confirm receipt of the parts. This protects both you and the seller during the transaction.</p>
                                <div className="mt-3 font-semibold text-blue-700">₦{order.total.toLocaleString()}</div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold mb-3 flex items-center gap-2"><Package className="text-blue-600" /> Items Ordered</h4>
                            <div className="space-y-3 mb-4">
                                {order.items.map((it, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-md border">
                                        <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center">
                                            <Image src={it.image} alt={it.name} width={48} height={48} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm">{it.name}</div>
                                            <div className="text-xs text-gray-500">Qty: {it.qty} • ₦{it.price.toLocaleString()}</div>
                                        </div>
                                        <div className="font-bold">₦{(it.price * it.qty).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#F8F8F5] p-4 rounded-md mb-4">
                                <div className="text-sm text-gray-500">Delivery Address</div>
                                <div className="font-bold">{order.delivery.address}</div>
                                <div className="text-sm text-gray-500">{order.delivery.eta}</div>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <Button variant="outline" className="flex-1" onClick={handleTrack}>
                                    <Truck className="mr-2" /> Track Your Order
                                </Button>
                                <Button variant="ghost" className="flex-1 text-blue-700 border border-blue-200" onClick={handleDownloadReceipt}>
                                    <DownloadCloud className="mr-2" /> Download Receipt
                                </Button>
                            </div>

                            <div className="flex gap-3 mt-3 items-center">
                                <Link href="/dispute-resolution">
                                    <a className="text-blue-600 underline">View Escrow Policy</a>
                                </Link>
                                <Link href="/shop">
                                    <a className="ml-auto text-blue-600 underline">Continue Shopping</a>
                                </Link>
                            </div>
                            {canConfirm && (
                                <div className="mt-4">
                                    <Button className="w-full bg-green-600 text-white" onClick={handleConfirmReceipt}><Check className="mr-2" /> Confirm Receipt</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Next steps / timeline */}
                    <div className="p-6 bg-white border-t">
                        <h3 className="font-bold mb-3">What Happens Next</h3>
                        <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                            <li>Seller prepares your order.</li>
                            <li>Seller ships the parts and provides a tracking number.</li>
                            <li>You confirm receipt to release escrow funds to the seller.</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Delivery tracker modal-ish */}
            {showTracker && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold">Delivery Tracker</h4>
                            <button onClick={() => setShowTracker(false)} className="text-sm text-gray-500">Close</button>
                        </div>
                        <DeliveryTracker status={2} />
                    </div>
                </div>
            )}
        </div>
    );
}
