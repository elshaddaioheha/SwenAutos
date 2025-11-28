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

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center sticky top-0 z-50">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#1D4ED8] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-[#1D4ED8] font-bold text-xl">SwenAutos</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-[#111827] font-bold text-lg">
                            <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                                <Lock className="w-3.5 h-3.5 text-[#10B981]" />
                            </div>
                            Secure Checkout
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white font-bold">
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
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-[#10B981] -z-10"></div>

                        {/* Steps */}
                        {[
                            { id: 1, name: "Cart", status: "completed" },
                            { id: 2, name: "Delivery", status: "current" },
                            { id: 3, name: "Payment", status: "pending" },
                            { id: 4, name: "Confirm", status: "pending" },
                        ].map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-[#F8F8F5] px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step.status === "completed" ? "bg-[#10B981] text-white" :
                                    step.status === "current" ? "bg-[#1D4ED8] text-white" :
                                        "bg-gray-200 text-gray-500"
                                    }`}>
                                    {step.status === "completed" ? <Check className="w-4 h-4" /> : step.id}
                                </div>
                                <span className={`text-sm font-bold ${step.status === "current" ? "text-[#1D4ED8]" :
                                    step.status === "completed" ? "text-[#111827]" : "text-gray-500"
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
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#111827] mb-6">Choose Delivery Method</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setDeliveryMethod("home")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${deliveryMethod === "home" ? "border-[#1D4ED8] bg-[#F0F7FF]" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "home" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        {deliveryMethod === "home" && (
                                            <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[#111827] mb-1">Home Delivery</h3>
                                    <p className="text-sm text-gray-500 mb-2">Get parts delivered to your address</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500">3-5 business days</span>
                                        <span className="font-bold text-[#111827]">From ₦2,500</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setDeliveryMethod("pickup")}
                                    className={`p-4 rounded-xl border-2 text-left transition-all relative ${deliveryMethod === "pickup" ? "border-[#1D4ED8] bg-[#F0F7FF]" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${deliveryMethod === "pickup" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-500"
                                            }`}>
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        {deliveryMethod === "pickup" && (
                                            <div className="w-5 h-5 rounded-full bg-[#1D4ED8] flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[#111827] mb-1">Pickup from Seller</h3>
                                    <p className="text-sm text-gray-500 mb-2">Collect parts directly</p>
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs text-gray-500">Available immediately</span>
                                        <span className="font-bold text-[#10B981]">Free</span>
                                    </div>
                                </button>
                            </div>

                            {/* Address Form */}
                            {deliveryMethod === "home" && (
                                <div className="mt-8 space-y-4 pt-8 border-t border-gray-100">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-[#111827]">State</label>
                                            <select className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white text-sm outline-none focus:border-[#1D4ED8]">
                                                <option>Lagos</option>
                                                <option>Abuja</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-bold text-[#111827]">City</label>
                                            <select className="w-full h-11 rounded-lg border border-gray-200 px-3 bg-white text-sm outline-none focus:border-[#1D4ED8]">
                                                <option>Ikeja</option>
                                                <option>Lekki</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#111827]">Street Address</label>
                                        <Input placeholder="e.g. 123 Admiralty Way" className="h-11 bg-white" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-[#111827]">Phone Number</label>
                                        <Input placeholder="+234..." className="h-11 bg-white" />
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Checkbox id="save-address" />
                                        <label htmlFor="save-address" className="text-sm text-[#111827]">Save this address for future orders</label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-[#111827] mb-6">Payment Method</h2>

                            {/* Currency Toggle */}
                            <div className="flex p-1 bg-[#F8F8F5] rounded-xl mb-8 w-fit">
                                <button
                                    onClick={() => setPaymentType("naira")}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentType === "naira" ? "bg-[#1D4ED8] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Pay with Naira (₦)
                                </button>
                                <button
                                    onClick={() => setPaymentType("crypto")}
                                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${paymentType === "crypto" ? "bg-[#1D4ED8] text-white shadow-sm" : "text-gray-500 hover:text-gray-900"
                                        }`}
                                >
                                    Pay with Crypto
                                </button>
                            </div>

                            {paymentType === "naira" && (
                                <div className="space-y-4">
                                    {/* Card Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "card" ? "border-[#1D4ED8] bg-[#F0F7FF]" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("card")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "card" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <CreditCard className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#111827]">Debit/Credit Card</div>
                                                <div className="text-sm text-gray-500">Visa, Mastercard, Verve accepted</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-[#1D4ED8]" : "border-gray-300"}`}>
                                                {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />}
                                            </div>
                                        </button>

                                        {paymentMethod === "card" && (
                                            <div className="px-4 pb-6 pt-2 space-y-4 border-t border-[#1D4ED8]/10 mx-4 mt-2">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#111827] uppercase">Card Number</label>
                                                    <Input placeholder="0000 0000 0000 0000" className="bg-white" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-[#111827] uppercase">Expiry Date</label>
                                                        <Input placeholder="MM/YY" className="bg-white" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-xs font-bold text-[#111827] uppercase">CVV</label>
                                                        <Input placeholder="123" className="bg-white" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-[#111827] uppercase">Cardholder Name</label>
                                                    <Input placeholder="Enter name on card" className="bg-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bank Transfer Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "bank" ? "border-[#1D4ED8] bg-[#F0F7FF]" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("bank")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "bank" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#111827]">Bank Transfer</div>
                                                <div className="text-sm text-gray-500">Transfer to provided account details</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bank" ? "border-[#1D4ED8]" : "border-gray-300"}`}>
                                                {paymentMethod === "bank" && <div className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />}
                                            </div>
                                        </button>
                                    </div>

                                    {/* USSD Option */}
                                    <div className={`border rounded-xl overflow-hidden transition-all ${paymentMethod === "ussd" ? "border-[#1D4ED8] bg-[#F0F7FF]" : "border-gray-200"}`}>
                                        <button
                                            onClick={() => setPaymentMethod("ussd")}
                                            className="w-full flex items-center gap-4 p-4 text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "ussd" ? "bg-[#1D4ED8] text-white" : "bg-gray-100 text-gray-500"}`}>
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#111827]">USSD Payment</div>
                                                <div className="text-sm text-gray-500">Dial code on your phone</div>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ussd" ? "border-[#1D4ED8]" : "border-gray-300"}`}>
                                                {paymentMethod === "ussd" && <div className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Escrow Banner */}
                            <div className="mt-8 bg-[#F0F7FF] rounded-xl p-4 flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-[#1D4ED8] flex-shrink-0 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#111827]">Payment Protected by Escrow</h4>
                                    <p className="text-sm text-gray-600 mt-1">Your payment is held safely until you confirm receipt of the parts. <Link href="#" className="text-[#1D4ED8] font-bold hover:underline">Learn more</Link></p>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="mt-6 flex items-start gap-3">
                                <Checkbox id="terms" className="mt-1" />
                                <label htmlFor="terms" className="text-sm text-[#111827]">
                                    I agree to the <Link href="#" className="text-[#1D4ED8] font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-[#1D4ED8] font-bold hover:underline">Escrow Policy</Link>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex flex-col-reverse md:flex-row gap-4 items-center justify-between">
                                <Button variant="outline" className="w-full md:w-auto h-12 gap-2 font-bold text-[#111827] border-gray-200">
                                    <ChevronLeft className="w-4 h-4" /> Back to Cart
                                </Button>
                                <Button className="w-full md:w-auto h-12 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold px-8 rounded-xl shadow-lg shadow-blue-600/20">
                                    Complete Payment
                                </Button>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-[#111827] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {[
                                    { name: "Toyota Camry Brake Pad Set", price: 12500, qty: 1, img: "/placeholder-part.png" },
                                    { name: "Honda Accord Air Filter", price: 17800, qty: 2, img: "/placeholder-part.png" },
                                    { name: "Mercedes Shock Absorber", price: 28500, qty: 1, img: "/placeholder-part.png" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <Image src={item.img} width={40} height={40} alt={item.name} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-[#111827] text-sm line-clamp-2 leading-tight">{item.name}</h4>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-gray-500">Qty: {item.qty}</span>
                                                <span className="font-bold text-[#111827] text-sm">₦{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-[#111827]">₦58,800</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="font-bold text-[#111827]">₦2,500</span>
                                </div>
                                <div className="flex justify-between text-lg pt-2 border-t border-gray-100">
                                    <span className="font-bold text-[#111827]">Total</span>
                                    <span className="font-bold text-[#1D4ED8]">₦61,300</span>
                                </div>
                            </div>

                            {/* Promo Code */}
                            <div className="flex gap-2 mb-8">
                                <Input placeholder="Promo code" className="bg-white" />
                                <Button className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold">Apply</Button>
                            </div>

                            {/* Security Badges */}
                            <div className="flex justify-center gap-4 py-4 border-t border-gray-100">
                                <div className="flex items-center gap-1.5">
                                    <Lock className="w-3 h-3 text-[#10B981]" />
                                    <span className="text-xs text-gray-500">SSL Secure</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Check className="w-3 h-3 text-[#10B981]" />
                                    <span className="text-xs text-gray-500">Verified</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                                    <span className="text-xs text-gray-500">Escrow</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
}
