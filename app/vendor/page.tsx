import { Button } from "@/components/ui/button";
import { ShieldCheck, Globe, CreditCard, Headset, UserPlus, Upload, Banknote } from "lucide-react";
import Link from "next/link";

export default function VendorPage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#F8F8F5] to-[#E5E7EB] py-20 md:py-32 overflow-hidden">
                <div className="container px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <h1 className="text-4xl md:text-6xl font-bold text-[#111827] leading-tight">
                            Start Selling on SwenAutos
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of verified sellers earning income through our secure, blockchain-powered marketplace
                        </p>
                        <div className="pt-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold px-8 h-14 text-lg rounded-lg shadow-xl shadow-blue-200">
                                    Register as Seller
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* How to Become a Seller */}
            <section className="py-20 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">How to Become a Seller</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                                <span className="text-[#1D4ED8] text-3xl font-bold">1</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-[#111827]">Register & Verify</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                                    Create your seller account and complete identity verification with valid documents
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                                <span className="text-[#1D4ED8] text-3xl font-bold">2</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-[#111827]">List Your Parts</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                                    Upload spare parts with photos, descriptions, and pricing in Naira or crypto
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                                <span className="text-[#1D4ED8] text-3xl font-bold">3</span>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-[#111827]">Start Earning</h3>
                                <p className="text-gray-500 leading-relaxed max-w-xs mx-auto">
                                    Receive orders, fulfill deliveries, and get paid securely through escrow
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seller Benefits */}
            <section className="py-20 bg-[#F8F8F5]">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#111827]">Seller Benefits</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Benefit 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="h-6 w-6 text-[#1D4ED8]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[#111827]">Secure Escrow Protection</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Your earnings are protected by smart contracts. Get paid immediately after successful delivery confirmation.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Globe className="h-6 w-6 text-[#10B981]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[#111827]">Reach More Customers</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Access buyers across Nigeria and beyond. Expand your market without geographical limits.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
                            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="h-6 w-6 text-[#F59E0B]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[#111827]">Multiple Payment Options</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Accept payments in Naira and cryptocurrency. Withdraw to your bank or crypto wallet.
                                </p>
                            </div>
                        </div>

                        {/* Benefit 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-6">
                            <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Headset className="h-6 w-6 text-[#EF4444]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-[#111827]">24/7 Support</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Get help anytime with our dedicated seller support team. We're here for you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#1D4ED8] text-center">
                <div className="container px-4 md:px-6">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-white">Ready to Start Selling?</h2>
                        <p className="text-xl text-white/90">
                            Join our community of successful auto parts sellers today
                        </p>
                        <div className="pt-4">
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="bg-white text-[#1D4ED8] hover:bg-gray-100 font-bold px-10 h-14 text-lg rounded-lg border-2 border-white">
                                    Create Seller Account
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
