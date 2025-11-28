import { Button } from "@/components/ui/button";
import { ShieldCheck, BadgeCheck, Coins, User } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-16 lg:py-20 space-y-16 md:space-y-24">

            {/* About Section */}
            <section className="max-w-4xl mx-auto text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">About SwenAutos</h1>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                    <p>
                        SwenAutos is Nigeria's leading blockchain-powered marketplace connecting auto parts sellers with buyers.
                        Founded in 2024, we're revolutionizing how Igbo traders and buyers conduct business with transparency,
                        security, and trust.
                    </p>
                    <p>
                        Our platform combines traditional marketplace features with modern blockchain technology, offering escrow
                        protection, cryptocurrency payments, and verified seller ratings.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="max-w-4xl mx-auto text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-4">Our Mission</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                    To empower Nigerian auto parts traders with cutting-edge technology that builds trust, ensures fair
                    transactions, and expands market reach beyond geographical boundaries.
                </p>
            </section>

            {/* Why Choose Section */}
            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-10 text-center">Why Choose SwenAutos?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Feature 1 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <ShieldCheck className="h-16 w-16 text-primary fill-blue-100" />
                        <h3 className="text-xl font-bold text-[#111827]">Secure Escrow</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Smart contract-powered escrow protects both buyers and sellers
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <BadgeCheck className="h-16 w-16 text-primary fill-blue-100" />
                        <h3 className="text-xl font-bold text-[#111827]">Verified Sellers</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            All vendors undergo strict verification to ensure authenticity
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="flex flex-col items-center text-center space-y-4">
                        <Coins className="h-16 w-16 text-primary fill-blue-100" />
                        <h3 className="text-xl font-bold text-[#111827]">Flexible Payments</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">
                            Accept Naira and cryptocurrency for maximum convenience
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="max-w-6xl mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-10 text-center">Our Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Member 1 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                            <User className="h-16 w-16 text-primary fill-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#111827]">Chukwuemeka Okonkwo</h3>
                            <p className="text-sm text-gray-500">CEO & Founder</p>
                        </div>
                    </div>

                    {/* Member 2 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                            <User className="h-16 w-16 text-primary fill-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#111827]">Ngozi Adebayo</h3>
                            <p className="text-sm text-gray-500">COO</p>
                        </div>
                    </div>

                    {/* Member 3 */}
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                            <User className="h-16 w-16 text-primary fill-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#111827]">Ikenna Nwankwo</h3>
                            <p className="text-sm text-gray-500">CTO</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="text-center pb-8">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 h-12 rounded-lg shadow-lg">
                    Join SwenAutos Today
                </Button>
            </section>

        </div>
    );
}
