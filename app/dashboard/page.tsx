import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search, ShoppingCart, Star, Check, Car, MapPin,
    Grid, List, ChevronDown, Filter, ChevronRight, SlidersHorizontal,
    Disc, Activity, Zap, Layers, Armchair, Circle, Settings, Package
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#F8F8F5] pb-20">

            {/* Hero / Welcome Section */}
            <div className="bg-gradient-to-br from-[#1D4ED8] to-[#3B82F6] text-white pt-16 pb-24 px-4 md:px-6">
                <div className="container mx-auto flex flex-col items-center text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, Chukwuemeka!</h1>
                    <p className="text-white/90 text-lg mb-8">Find the perfect spare part for your vehicle</p>

                    {/* Search Bar */}
                    <div className="w-full max-w-2xl relative">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search by part name, number, or vehicle..."
                                className="w-full pl-12 pr-12 h-14 rounded-xl text-gray-900 bg-white border-0 shadow-lg focus-visible:ring-0 placeholder:text-gray-400"
                            />
                            <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#1D4ED8] transition-colors">
                                <SlidersHorizontal className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {["Engine Oil", "Brake Pads", "Air Filters", "Batteries"].map((item) => (
                                <button key={item} className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-colors">
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 mt-12">

                {/* Browse by Category */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-[#111827] mb-6">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Engine Parts", icon: Car },
                            { name: "Brake System", icon: Disc },
                            { name: "Suspension", icon: Activity },
                            { name: "Electrical", icon: Zap },
                            { name: "Body Parts", icon: Layers },
                            { name: "Interior", icon: Armchair },
                            { name: "Wheels & Tires", icon: Circle },
                            { name: "Accessories", icon: Settings },
                        ].map((cat) => (
                            <Link href="/shop" key={cat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1D4ED8] transition-all group flex flex-col items-center text-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center group-hover:bg-[#1D4ED8] transition-colors">
                                    <cat.icon className="h-6 w-6 text-[#1D4ED8] group-hover:text-white transition-colors" />
                                </div>
                                <span className="font-bold text-[#111827] group-hover:text-[#1D4ED8] transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Popular Spare Parts */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-[#111827]">Popular Spare Parts</h2>
                        <Link href="/shop" className="text-[#1D4ED8] font-bold hover:underline flex items-center gap-1">
                            View All <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 mb-8 overflow-x-auto pb-2">
                        <button className="bg-[#1D4ED8] text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm">
                            All Parts
                        </button>
                        {["OEM Only", "Aftermarket", "New", "Used"].map((filter) => (
                            <button key={filter} className="bg-white border border-gray-200 text-[#111827] hover:border-[#1D4ED8] hover:text-[#1D4ED8] px-5 py-2 rounded-full text-sm font-bold transition-colors">
                                {filter}
                            </button>
                        ))}
                        <div className="ml-auto flex gap-3">
                            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#1D4ED8]">
                                <option>Vehicle Type</option>
                            </select>
                            <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:border-[#1D4ED8]">
                                <option>Price Range</option>
                            </select>
                            <Button variant="outline" className="border-[#1D4ED8] text-[#1D4ED8] hover:bg-[#1D4ED8]/5 gap-2">
                                <SlidersHorizontal className="h-4 w-4" /> More Filters
                            </Button>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Engine Oil Filter - Toyota Camry", price: 12500, eth: 0.008, reviews: 48, rating: 5 },
                            { name: "Brake Pads Set - Honda Accord", price: 28000, eth: 0.018, reviews: 92, rating: 5 },
                            { name: "Car Battery 12V - Universal", price: 45000, eth: 0.029, reviews: 35, rating: 4 },
                            { name: "Headlight Assembly - Mercedes", price: 85000, eth: 0.055, reviews: 67, rating: 5 },
                        ].map((product, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                        <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">VERIFIED</span>
                                    </div>
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                        <Image src="/placeholder-part.png" width={128} height={128} alt={product.name} className="object-contain" />
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center space-x-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < product.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-gray-300"}`} />
                                            ))}
                                            <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                        </div>
                                    </div>

                                    <div className="flex items-end justify-between pt-1">
                                        <div>
                                            <div className="text-lg font-bold text-[#1D4ED8]">₦{product.price.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500">≈ {product.eth} ETH</div>
                                        </div>
                                    </div>

                                    <Button className="w-full bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-10">
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
