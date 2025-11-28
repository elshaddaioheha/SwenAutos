import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MessageCircle, Send, ChevronDown, ChevronUp } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen">

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#111827]">Frequently Asked Questions</h1>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* FAQ Item 1 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2 flex items-center justify-between">
                                How does the escrow system work?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                When you make a purchase, your payment is held securely in our smart contract escrow. The seller only receives payment after you confirm successful delivery of the parts. This protects both buyers and sellers.
                            </p>
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2">
                                Can I pay with cryptocurrency?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Yes! SwenAutos accepts both Naira and major cryptocurrencies including Ethereum (ETH), USDT, and USDC. You can choose your preferred payment method at checkout.
                            </p>
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2">
                                How do I become a verified seller?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Register as a seller, provide valid identification documents (NIN, BVN, or CAC), and submit proof of business. Our team reviews applications within 24-48 hours.
                            </p>
                        </div>

                        {/* FAQ Item 4 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2">
                                What if I receive the wrong part?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                You can open a dispute before confirming delivery. Upload evidence (photos, descriptions), and our arbitration team will review the case. Your money remains in escrow until the issue is resolved.
                            </p>
                        </div>

                        {/* FAQ Item 5 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2">
                                How long does delivery take?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Delivery times vary by location and seller. Most orders within Lagos are delivered within 2-3 days. You can also choose local pickup to get parts immediately from nearby sellers.
                            </p>
                        </div>

                        {/* FAQ Item 6 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                            <h3 className="text-lg font-bold text-[#111827] mb-2">
                                Are all parts genuine/OEM?
                            </h3>
                            <p className="text-gray-500 leading-relaxed">
                                Sellers clearly label parts as OEM (Original Equipment Manufacturer) or Aftermarket. Verified sellers undergo quality checks, and buyers can leave reviews to maintain transparency.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="py-20 bg-[#F8F8F5]">
                <div className="container px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Contact Support</h2>
                        <p className="text-lg text-gray-500">
                            Can't find what you're looking for? Get in touch with our support team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8 lg:col-span-1">
                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-6 w-6 text-[#1D4ED8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111827] mb-1">Phone</h3>
                                    <p className="text-gray-500">+234 803 XXX XXXX</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-6 w-6 text-[#1D4ED8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111827] mb-1">Email</h3>
                                    <p className="text-gray-500">support@swenautos.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <MessageCircle className="h-6 w-6 text-[#1D4ED8]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#111827] mb-1">WhatsApp</h3>
                                    <p className="text-gray-500">+234 803 XXX XXXX</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="text-xl font-bold text-[#111827] mb-6">Send us a message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111827]">Full Name</label>
                                        <Input placeholder="Enter your full name" className="bg-white border-gray-200" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#111827]">Email Address</label>
                                        <Input type="email" placeholder="Enter your email" className="bg-white border-gray-200" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#111827]">Subject</label>
                                    <Input placeholder="How can we help you?" className="bg-white border-gray-200" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#111827]">Message</label>
                                    <textarea
                                        className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Type your message here..."
                                    ></textarea>
                                </div>

                                <Button className="w-full md:w-auto bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-12 px-8">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
