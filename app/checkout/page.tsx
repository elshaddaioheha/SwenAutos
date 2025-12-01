"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Lock, Check, Truck, CreditCard, ChevronLeft, ShieldCheck, Building2, Smartphone
} from "lucide-react";

export default function CheckoutPage() {
    const [deliveryMethod, setDeliveryMethod] = useState("home");
    const [paymentType, setPaymentType] = useState("naira");
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

        if (!isLoggedIn) {
            // Redirect to login if not authenticated
            router.push("/login?redirect=/checkout");
        } else {
            setIsCheckingAuth(false);
        }
    }, [router]);

    const handlePayment = () => {
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);

            // Redirect after showing splash screen
            setTimeout(() => {
                const orderId = paymentType === "crypto"
                    ? `ORD-${Date.now()}-CRYPTO`
                    : `ORD-${Date.now()}-FIAT`;
                router.push(`/order-confirmation/${orderId}`);
            }, 3000); // Show splash for 3 seconds
        }, 2000); // Process for 2 seconds
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Splash Screen Overlay
    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-150">
                    <Check className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-in slide-in-from-bottom-4 duration-500 delay-300">Payment Successful!</h1>
                <p className="text-gray-500 mb-8 animate-in slide-in-from-bottom-4 duration-500 delay-400">Redirecting to your order details...</p>
                <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 transition-colors duration-300">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center sticky top-0 z-50 transition-colors duration-300">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-primary font-bold text-xl">SwenAutos</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-gray-900 font-bold text-lg">
                            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-green-500" />
                            </div>
                            Secure Checkout
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            CU
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">

                {/* Progress Bar */}
                <div className="max-w-3xl mx-auto mb-12">
                    <div className="flex items-center justify-between relative">
                        {/* Progress Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 transition-colors"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-green-500 -z-10"></div>

                        {/* Steps */}
                        {[
                            { id: 1, name: "Cart", status: "completed" },
                            { id: 2, name: "Delivery", status: "current" },
                            { id: 3, name: "Payment", status: "pending" },
                            { id: 4, name: "Confirm", status: "pending" },
                        ].map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-gray-50 px-2 transition-colors">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step.status === "completed" ? "bg-green-500 text-white" :
                                    step.status === "current" ? "bg-primary text-white" :
                                        "bg-gray-200 text-gray-500"
                                    }`}>
                                    {step.status === "completed" ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`text-sm font-bold ${step.status === "current" ? "text-primary" :
                                    step.status === "completed" ? "text-gray-900" : "text-gray-500"
                                    }`}>
                                    {step.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

                    {/* Left Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Delivery Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Delivery Method</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDeliveryMethod("home")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${deliveryMethod === "home" ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "home" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        {deliveryMethod === "home" && (
                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">Home Delivery</h3>
                                    <p className="text-sm text-gray-500 mb-2">Get parts delivered to your address</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500">3-5 business days</span>
                                        <span className="font-bold text-gray-900">From ₦2,500</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setDeliveryMethod("pickup")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${deliveryMethod === "pickup" ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "pickup" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        {deliveryMethod === "pickup" && (
                                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">Pickup from Seller</h3>
                                    <p className="text-sm text-gray-500 mb-2">Collect parts directly</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500">Available immediately</span>
                                        <span className="font-bold text-green-500">Free</span>
                                    </div>
                                </button>
                            </div>

                            {/* Address Form */}
                            {deliveryMethod === "home" && (
                                <div className="mt-8 space-y-4 pt-8 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-900">State</label>
                                            <select className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white text-sm outline-none focus:border-primary text-gray-900 transition-colors">
                                                <option>Lagos</option>
                                                <option>Abuja</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-gray-900">City</label>
                                            <select className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white text-sm outline-none focus:border-primary text-gray-900 transition-colors">
                                                <option>Ikeja</option>
                                                <option>Lekki</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-900">Street Address</label>
                                        <Input placeholder="e.g. 123 Admiralty Way" className="h-11 bg-white border-gray-200" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-900">Phone Number</label>
                                        <Input placeholder="+234..." className="h-11 bg-white border-gray-200" />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Checkbox id="save-address" />
                                        <label htmlFor="save-address" className="text-sm text-gray-900">Save this address for future orders</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                            {/* Currency Toggle */}
                            <div className="flex p-1 bg-gray-50 rounded-xl mb-8 w-fit transition-colors">
                                <button
                                    onClick={() => setPaymentType("naira")}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentType === "naira" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Pay with Naira (₦)
                                </button>
                                <button
                                    onClick={() => setPaymentType("crypto")}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentType === "crypto" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Pay with Crypto
                                </button>
                            </div>

                            {paymentType === "crypto" && (
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <span className="font-bold text-primary">C</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Pay with CAMP Token</h3>
                                                <p className="text-sm text-gray-600">Fast, secure blockchain payment</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Exchange Rate</span>
                                                <span className="font-medium">1 CAMP ≈ ₦150.00</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Network Fee</span>
                                                <span className="font-medium text-green-600">~0.0001 ETH</span>
                                            </div>
                                            <div className="pt-3 border-t border-blue-100 flex justify-between items-center">
                                                <span className="font-bold text-gray-900">Total to Pay</span>
                                                <span className="font-bold text-xl text-primary">408.66 CAMP</span>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handlePayment}
                                            disabled={isProcessing}
                                            className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl"
                                        >
                                            {isProcessing ? "Processing..." : "Connect Wallet & Pay"}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-center text-gray-500">
                                        By paying with crypto, you agree to the network gas fees.
                                    </p>
                                </div>
                            )}

                            {paymentType === "naira" && (
                                <div className="space-y-4">
                                    {/* Card Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "card" ? "border-primary bg-blue-50" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "card" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Debit/Credit Card</div>
                                                <div className="text-sm text-gray-500">Visa, Mastercard, Verve accepted</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-primary" : "border-gray-300"}`}>
                                                {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                        </button>

                                        {paymentMethod === "card" && (
                                            <div className="px-4 pb-6 pt-2 space-y-4 border-t border-primary/10 mx-4 mt-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-900 uppercase">Card Number</label>
                                                    <Input placeholder="0000 0000 0000 0000" className="bg-white border-gray-200" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-900 uppercase">Expiry Date</label>
                                                        <Input placeholder="MM/YY" className="bg-white border-gray-200" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-gray-900 uppercase">CVV</label>
                                                        <Input placeholder="123" className="bg-white border-gray-200" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-900 uppercase">Cardholder Name</label>
                                                    <Input placeholder="Enter name on card" className="bg-white border-gray-200" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bank Transfer Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "bank" ? "border-primary bg-blue-50" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "bank" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Bank Transfer</div>
                                                <div className="text-sm text-gray-500">Transfer to provided account details</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bank" ? "border-primary" : "border-gray-300"}`}>
                                                {paymentMethod === "bank" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                        </button>
                                    </div>

                                    {/* USSD Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "ussd" ? "border-primary bg-blue-50" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("ussd")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "ussd" ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">USSD Payment</div>
                                                <div className="text-sm text-gray-500">Dial code on your phone</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ussd" ? "border-primary" : "border-gray-300"}`}>
                                                {paymentMethod === "ussd" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Escrow Banner */}
                            <div className="mt-8 bg-blue-50 rounded-xl p-4 flex gap-4 items-start transition-colors">
                                <div className="w-10 h-10 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Payment Protected by Escrow</h4>
                                    <p className="text-sm text-gray-600 mt-1">Your payment is held safely until you confirm receipt of the parts. <Link href="#" className="text-primary font-bold hover:underline">Learn more</Link></p>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mt-6 flex items-start gap-3">
                                <Checkbox id="terms" className="mt-1" />
                                <label htmlFor="terms" className="text-sm text-gray-900">
                                    I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Escrow Policy</Link>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
                                <Button variant="outline" className="w-full md:w-auto h-12 gap-2 font-bold text-gray-900 border-gray-200">
                                    <ChevronLeft className="w-4 h-4" /> Back to Cart
                                </Button>
                                {paymentType === "naira" && (
                                    <Button
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                        className="w-full md:w-auto h-12 bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-600/20"
                                    >
                                        {isProcessing ? "Processing..." : "Complete Payment"}
                                    </Button>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24 transition-colors duration-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {[
                                    { name: "Toyota Camry Brake Pad Set", price: 12500, qty: 1, img: "/placeholder-part.png" },
                                    { name: "Honda Accord Air Filter", price: 17800, qty: 2, img: "/placeholder-part.png" },
                                    { name: "Mercedes Shock Absorber", price: 28500, qty: 1, img: "/placeholder-part.png" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors">
                                            <Image src={item.img} width={40} height={40} alt={item.name} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                                <span className="font-bold text-gray-900 text-sm">₦{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 mb-6 transition-colors">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">₦58,800</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="font-bold text-gray-900">₦2,500</span>
                                </div>
                                <div className="flex justify-between text-lg pt-2 border-t border-gray-100 transition-colors">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-bold text-primary">₦61,300</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="flex gap-2 mb-8">
                                <Input placeholder="Promo code" className="bg-white border-gray-200" />
                                <Button className="bg-primary hover:bg-primary/90 text-white font-bold">Apply</Button>
                            </div>

                            {/* Security Badges */}
                            <div className="flex justify-center gap-4 py-4 border-t border-gray-100 transition-colors">
                                <div className="flex items-center gap-1.5">
                                    <Lock className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-gray-500">SSL Secure</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-gray-500">Verified</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3 h-3 text-green-500" />
                                    <span className="text-xs text-gray-500">Escrow</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
