"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check, Truck, ShieldCheck, ArrowLeft, Car } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/providers/CartProvider";
import { useRouter } from "next/navigation";

// Mock Data (same as dashboard for consistency) - In real app, pass as props
const PRODUCTS = [
    { id: "1", name: "Engine Oil Filter - Toyota Camry", price: 12500, eth: 0.008, reviews: 48, rating: 5, image: "/placeholder-part.png", description: "High-quality OEM engine oil filter for Toyota Camry 2018-2023 models. Ensures optimal engine performance and longevity." },
    { id: "2", name: "Brake Pads Set - Honda Accord", price: 28000, eth: 0.018, reviews: 92, rating: 5, image: "/placeholder-part.png", description: "Ceramic brake pads for Honda Accord. Low dust, low noise, and excellent stopping power." },
    { id: "3", name: "Car Battery 12V - Universal", price: 45000, eth: 0.029, reviews: 35, rating: 4, image: "/placeholder-part.png", description: "Maintenance-free 12V car battery. Universal fit for most sedans and SUVs. 2-year warranty." },
    { id: "4", name: "Headlight Assembly - Mercedes", price: 85000, eth: 0.055, reviews: 67, rating: 5, image: "/placeholder-part.png", description: "Full LED headlight assembly for Mercedes-Benz C-Class. Bright, durable, and easy to install." },
];

export default function ProductDetailsClient({ id }: { id: string }) {
    const router = useRouter();
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const product = PRODUCTS.find(p => p.id === id) || {
        id: id,
        name: "Product Not Found",
        price: 0,
        eth: 0,
        reviews: 0,
        rating: 0,
        image: "/placeholder-part.png",
        description: "This product does not exist or has been removed."
    };

    const handleAddToCart = () => {
        console.log("Adding to cart:", product);
        try {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            console.log("Item added to cart successfully");
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Image Section */}
                        <div className="bg-gray-100 rounded-xl flex items-center justify-center p-8 h-[400px] relative">
                            <Image src={product.image} fill alt={product.name} className="object-contain p-8" />
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < product.rating ? "fill-current" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{product.reviews} verified reviews</span>
                                </div>
                            </div>

                            <div className="border-t border-b border-gray-100 py-6 space-y-2">
                                <div className="text-4xl font-bold text-primary">₦{product.price.toLocaleString()}</div>
                                <div className="text-sm text-gray-500">≈ {product.eth} ETH</div>
                            </div>

                            <p className="text-gray-600 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Truck className="h-6 w-6 text-primary" />
                                    <div>
                                        <div className="font-bold text-sm">Free Delivery</div>
                                        <div className="text-xs text-gray-500">On orders over ₦50k</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                    <div>
                                        <div className="font-bold text-sm">Warranty</div>
                                        <div className="text-xs text-gray-500">1 Year Guarantee</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Car className="h-5 w-5 text-primary" />
                                    Check Fitment
                                </h3>
                                <div className="flex gap-2">
                                    <select className="flex-1 h-10 rounded-lg border border-gray-200 text-sm px-3 outline-none focus:border-primary">
                                        <option>Select Year</option>
                                        <option>2023</option>
                                        <option>2022</option>
                                    </select>
                                    <select className="flex-1 h-10 rounded-lg border border-gray-200 text-sm px-3 outline-none focus:border-primary">
                                        <option>Select Make</option>
                                        <option>Toyota</option>
                                        <option>Honda</option>
                                    </select>
                                    <select className="flex-1 h-10 rounded-lg border border-gray-200 text-sm px-3 outline-none focus:border-primary">
                                        <option>Select Model</option>
                                        <option>Camry</option>
                                        <option>Accord</option>
                                    </select>
                                    <Button className="bg-primary text-white hover:bg-primary/90">Check</Button>
                                </div>
                                <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Guaranteed fit for your vehicle
                                </p>
                            </div>

                            <div className="pt-6 space-y-3">
                                <div className="flex gap-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-12 text-base font-bold rounded-xl transition-all ${isAdded
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-gray-900 hover:bg-gray-800 text-white"
                                            }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check className="mr-2 h-4 w-4" />
                                                Added to Cart
                                            </>
                                        ) : (
                                            "Add to Cart"
                                        )}
                                    </Button>
                                    <Button variant="outline" className="h-12 w-12 rounded-xl border-2">
                                        <Star className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => {
                                            handleAddToCart();
                                            router.push('/checkout');
                                        }}
                                        className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20"
                                    >
                                        Pay with Card
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            handleAddToCart();
                                            router.push('/checkout');
                                        }}
                                        className="h-12 bg-[#F7931A] hover:bg-[#F7931A]/90 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20"
                                    >
                                        Pay with Crypto
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
