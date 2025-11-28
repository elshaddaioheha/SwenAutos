"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ShieldCheck, Truck, CreditCard, UserPlus, Upload, DollarSign, MessageSquare, CheckCircle } from "lucide-react";
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background transition-colors duration-300">
            {/* Hero Section */}
            <section className="bg-gray-900 dark:bg-gray-950 text-white py-20 transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <SlideUp>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">How SwenAutos Works</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Whether you're buying genuine parts or selling to millions, we make the process simple, secure, and fast.
                        </p>
                    </SlideUp>
                </div>
            </section>

            {/* For Buyers Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <SlideUp className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">For Buyers</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Buying Auto Parts Made Easy</h2>
                    </SlideUp>

                    <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Step 1 */}
                        <StaggerItem className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary transition-colors">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Search & Find</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Browse our extensive catalog of OEM and aftermarket parts. Filter by car make, model, and year to find the perfect fit.
                            </p>
                        </StaggerItem>

                        {/* Step 2 */}
                        <StaggerItem className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-500 transition-colors">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Verify & Order</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Check seller ratings and reviews. Add items to your cart and proceed to our secure checkout.
                            </p>
                        </StaggerItem>

                        {/* Step 3 */}
                        <StaggerItem className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 dark:text-purple-500 transition-colors">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. Secure Payment</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Pay with Naira or Crypto. Your funds are held in Escrow and only released when you confirm delivery.
                            </p>
                        </StaggerItem>

                        {/* Step 4 */}
                        <StaggerItem className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 dark:text-orange-500 transition-colors">
                                <Truck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Fast Delivery</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                Track your order in real-time. Receive your parts at your doorstep or pick them up from the seller.
                            </p>
                        </StaggerItem>
                    </StaggerContainer>

                    <div className="text-center mt-12">
                        <Link href="/">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12 rounded-xl">
                                Start Shopping Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* For Sellers Section */}
            <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <SlideUp className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm">For Sellers</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Grow Your Business with SwenAutos</h2>
                    </SlideUp>

                    <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                        <SlideUp className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">1. Create a Vendor Account</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Register as a seller in minutes. Complete our verification process to build trust with buyers.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">2. List Your Products</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Upload clear photos, add detailed descriptions, and set competitive prices for your spare parts.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">3. Connect with Buyers</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Respond to inquiries and manage orders directly from your dashboard.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-primary transition-colors">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">4. Get Paid Instantly</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Once the buyer confirms delivery, funds are released immediately to your wallet.</p>
                                </div>
                            </div>
                        </SlideUp>

                        <FadeIn delay={0.3} className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Sell on SwenAutos?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Access to thousands of active buyers</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Secure payments via Escrow</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Low commission fees</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Dedicated seller support</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span>Accept Crypto & Fiat payments</span>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/vendor">
                                    <Button className="w-full bg-gray-900 dark:bg-black hover:bg-black dark:hover:bg-gray-900 text-white font-bold h-12 rounded-xl transition-colors">
                                        Become a Seller
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Safety Banner */}
            <section className="bg-primary py-16 transition-colors duration-300">
                <div className="container mx-auto px-4 text-center">
                    <SlideUp>
                        <ShieldCheck className="w-16 h-16 text-white mx-auto mb-6 opacity-90" />
                        <h2 className="text-3xl font-bold text-white mb-4">Your Safety is Our Priority</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
                            We use advanced encryption and a secure Escrow system to ensure every transaction is safe, transparent, and fraud-free.
                        </p>
                        <Link href="/contact">
                            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-bold px-8 h-12 rounded-xl transition-colors">
                                Contact Support
                            </Button>
                        </Link>
                    </SlideUp>
                </div>
            </section>
        </div>
    );
}
