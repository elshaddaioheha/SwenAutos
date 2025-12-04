"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useAuthState } from "@campnetwork/origin/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Star, Truck, ShieldCheck, ShoppingCart, CreditCard, Heart,
    Check, Copy, ChevronRight, Minus, Plus, MessageCircle,
    MapPin, Award, Box, Zap, Layers, Circle, Armchair, Disc, Activity
} from "lucide-react";
import { PayWithFiatWrapper } from "@/components/payment/PayWithFiatWrapper";
import LoginModal from "@/components/auth/LoginModal";
import Image from "next/image";
import Link from "next/link";

// Mock Data
const PRODUCT = {
    id: "1",
    name: "OEM Toyota Camry Engine Oil Filter",
    partNumber: "90915-YZZF2",
    price: 45000,
    priceCamp: 28.12, // 45000 / 1600
    description: "This genuine OEM Toyota oil filter is designed specifically for Toyota Camry models from 2018-2024. Manufactured to Toyota's exact specifications, it provides superior filtration and engine protection compared to aftermarket alternatives.",
    rating: 4.8,
    reviews: 342,
    category: "Engine Parts",
    subCategory: "Oil Filters",
    stock: 12,
    condition: "New",
    images: [
        "/placeholder-part.png",
        "/placeholder-part.png",
        "/placeholder-part.png",
        "/placeholder-part.png",
        "/placeholder-part.png"
    ],
    seller: {
        name: "AutoParts Lagos",
        rating: 4.8,
        reviews: 342,
        location: "Lagos, Nigeria",
        responseTime: "2 hours",
        verified: true,
        online: true
    },
    features: [
        "Genuine OEM Toyota part - guaranteed authentic",
        "Premium filter media for superior oil filtration",
        "Designed for 10,000km/6-month oil change intervals",
        "High-quality construction for reliable performance",
        "Easy installation with standard wrench tools"
    ],
    specs: [
        { label: "Manufacturer", value: "Toyota" },
        { label: "Part Number", value: "90915-YZZF2" },
        { label: "Item Weight", value: "0.3 kg" },
        { label: "Dimensions", value: "3.5 x 3.5 x 4 inches" },
        { label: "Material", value: "Steel / Filter Paper" },
        { label: "Fitment Type", value: "Direct Replacement" },
        { label: "Warranty", value: "1 Year Manufacturer" },
        { label: "Country of Origin", value: "Japan" }
    ]
};

const RELATED_PRODUCTS = [
    { id: "2", name: "Air Filter - Toyota Camry", price: 8500, camp: 5.31, image: "/placeholder-part.png" },
    { id: "3", name: "Spark Plugs Set (4pcs)", price: 18000, camp: 11.25, image: "/placeholder-part.png" },
    { id: "4", name: "Engine Oil 5W-30 (4L)", price: 32000, camp: 20.00, image: "/placeholder-part.png" },
    { id: "5", name: "Fuel Filter - Camry", price: 15500, camp: 9.69, image: "/placeholder-part.png" },
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const router = useRouter();
    const { addItem } = useCart();
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [priceCurrency, setPriceCurrency] = useState<"NGN" | "CAMP">("NGN");
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginAction, setLoginAction] = useState<"add" | "buy" | null>(null);
    // use central auth provider
    const { isAuthenticated: localAuth, isLoading: localLoading } = useAuth() as any;
    const { authenticated: web3Auth, loading: web3Loading } = useAuthState();

    useEffect(() => {
        // Wait for both auth providers to finish loading
        if (web3Loading || localLoading) return;

        const loggedIn = localAuth || web3Auth;

        if (!loggedIn) {
            router.push(`/login?redirect=/product/${unwrappedParams.id}`);
        } else {
            setIsCheckingAuth(false);
        }
    }, [router, unwrappedParams.id, localAuth, web3Auth, web3Loading, localLoading]);

    // Product pages are public — we removed the redirect check so users can preview without logging in.

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background pb-20 transition-colors duration-300">

            {/* Breadcrumb */}
            <div className="container px-4 md:px-6 py-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2 overflow-x-auto whitespace-nowrap">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/shop" className="hover:text-primary transition-colors">{PRODUCT.category}</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/shop" className="hover:text-primary transition-colors">{PRODUCT.subCategory}</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-bold text-gray-900 dark:text-white">{PRODUCT.name}</span>
                </div>
            </div>

            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Left Column: Images */}
                    <div className="space-y-6">
                        <div className="relative aspect-square bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex items-center justify-center p-8 transition-colors duration-300">
                            <button className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10">
                                <Heart className="h-6 w-6" />
                            </button>
                            <div className="relative w-full h-full">
                                <Image
                                    src={PRODUCT.images[activeImage]}
                                    alt={PRODUCT.name}
                                    fill
                                    className="object-contain dark:invert"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-5 gap-4">
                            {PRODUCT.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative aspect-square bg-white dark:bg-gray-900 rounded-lg border overflow-hidden transition-all ${activeImage === idx ? "border-primary ring-2 ring-primary/20" : "border-gray-200 dark:border-gray-800 hover:border-primary"
                                        }`}
                                >
                                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-contain p-2 dark:invert" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="space-y-8">

                        {/* Header */}
                        <div>
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight max-w-xl">
                                    {PRODUCT.name}
                                </h1>
                            </div>

                            <div className="flex items-center space-x-4 mt-3">
                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span>Part #: {PRODUCT.partNumber}</span>
                                    <button className="text-primary hover:text-primary/80 flex items-center gap-1">
                                        <Copy className="h-3 w-3" /> <span className="text-xs">Copy</span>
                                    </button>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="flex items-center space-x-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    <span>OEM Authentic</span>
                                </div>
                                <div className="flex items-center space-x-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                                    <Box className="h-3.5 w-3.5" />
                                    <span>In Stock</span>
                                </div>
                                <div className="flex items-center space-x-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                                    <Truck className="h-3.5 w-3.5" />
                                    <span>Fast Shipping</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl p-6 border border-blue-100 dark:border-blue-900/20 transition-colors duration-300">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {priceCurrency === "NGN" ? `₦${PRODUCT.price.toLocaleString()}` : `${PRODUCT.priceEth} ETH`}
                                    </div>
                                    <div className="text-primary mt-1 font-medium">
                                        ≈ {priceCurrency === "NGN" ? `${PRODUCT.priceEth} ETH` : `₦${PRODUCT.price.toLocaleString()}`}
                                    </div>
                                </div>

                                {/* Currency Toggle */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-1 flex border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setPriceCurrency("NGN")}
                                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${priceCurrency === "NGN" ? "bg-primary text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                    >
                                        ₦ NGN
                                    </button>
                                    <button
                                        onClick={() => setPriceCurrency("ETH")}
                                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${priceCurrency === "ETH" ? "bg-primary text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                    >
                                        ETH
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4 text-green-600 dark:text-green-400 font-bold text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span>{PRODUCT.stock} units available</span>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded text-xs">Condition: {PRODUCT.condition}</span>
                            </div>
                        </div>

                        {/* Compatibility Checker */}
                        <div className="border border-dashed border-primary/30 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="bg-primary rounded-full p-1.5">
                                    <Zap className="h-4 w-4 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Check Compatibility</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-4">
                                <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white transition-colors">
                                    <option>Year</option>
                                    <option>2023</option>
                                    <option>2022</option>
                                </select>
                                <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white transition-colors">
                                    <option>Make</option>
                                    <option>Toyota</option>
                                    <option>Honda</option>
                                </select>
                                <select className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white transition-colors">
                                    <option>Model</option>
                                    <option>Camry</option>
                                    <option>Corolla</option>
                                </select>
                            </div>

                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10">
                                <Check className="h-4 w-4 mr-2" /> Check Fitment
                            </Button>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="font-bold text-gray-900 dark:text-white">Quantity</span>
                                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 transition-colors">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary transition-colors"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-primary transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 h-12 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 font-bold text-base" onClick={(e) => {
                                    const loggedIn = localAuth || web3Auth;
                                    if (!loggedIn) {
                                        setLoginAction('add');
                                        setShowLoginModal(true);
                                        return;
                                    }
                                    // Add to cart via provider
                                    addItem({ id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, image: PRODUCT.images[0] });
                                }}>
                                    <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                                </Button>
                                <Button className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base" onClick={() => {
                                    const loggedIn = localAuth || web3Auth;
                                    if (!loggedIn) {
                                        setLoginAction('buy');
                                        setShowLoginModal(true);
                                        return;
                                    }
                                    router.push(`/checkout?product=${PRODUCT.id}&qty=${quantity}`);
                                }}>
                                    Buy with Crypto
                                </Button>
                            </div>
                            <div className="mt-4">
                                <PayWithFiatWrapper
                                    email="customer@example.com"
                                    amount={PRODUCT.price}
                                />
                            </div>
                        </div>
                        {showLoginModal && (
                            <React.Suspense>
                                {/* Lazy load modal in place */}
                                {/* @ts-ignore */}
                                <LoginModal
                                    isOpen={showLoginModal}
                                    onClose={() => setShowLoginModal(false)}
                                    returnUrl={`/product/${unwrappedParams.id}`}
                                    onSuccess={() => {
                                        setShowLoginModal(false);
                                        if (loginAction === 'add') {
                                            addItem({ id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, image: PRODUCT.images[0] });
                                        } else if (loginAction === 'buy') {
                                            router.push(`/checkout?product=${PRODUCT.id}&qty=${quantity}`);
                                        }
                                        setLoginAction(null);
                                    }}
                                />
                            </React.Suspense>
                        )}

                        {/* Seller Card */}
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between transition-colors duration-300">
                            <div className="flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-primary font-bold text-lg">
                                    AP
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{PRODUCT.seller.name}</h4>
                                        {PRODUCT.seller.verified && (
                                            <ShieldCheck className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="h-3.5 w-3.5 fill-current" />
                                            <span className="ml-1 font-medium text-gray-900 dark:text-white">{PRODUCT.seller.rating}</span>
                                        </div>
                                        <span>({PRODUCT.seller.reviews} reviews)</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {PRODUCT.seller.location} • Replies in {PRODUCT.seller.responseTime}
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10">
                                <MessageCircle className="h-4 w-4 mr-2" /> Message
                            </Button>
                        </div>

                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-20">
                    <div className="border-b border-gray-200 dark:border-gray-800">
                        <nav className="flex space-x-8">
                            {["Description", "Specifications", "Reviews", "Shipping", "Warranty"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors ${activeTab === tab.toLowerCase()
                                        ? "border-primary text-primary"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="py-8">
                        {activeTab === "description" && (
                            <div className="max-w-4xl">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 text-lg">
                                    {PRODUCT.description}
                                </p>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Key Features:</h3>
                                <ul className="space-y-3">
                                    {PRODUCT.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start space-x-3">
                                            <div className="mt-1 bg-green-100 dark:bg-green-900/30 rounded-full p-1">
                                                <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                            </div>
                                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Installation Notes:</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Replace during regular oil changes. Hand-tighten filter then add 3/4 turn with filter wrench. Do not over-tighten. Always use new filter gasket and check for leaks after installation.
                                </p>
                            </div>
                        )}

                        {activeTab === "specifications" && (
                            <div className="max-w-3xl">
                                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                            {PRODUCT.specs.map((spec, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-1/3">
                                                        {spec.label}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                        {spec.value}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="max-w-3xl space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl text-center border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                                    <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12 mb-20">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {RELATED_PRODUCTS.map((product) => (
                            <div key={product.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                                <div className="relative h-48 bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center transition-colors">
                                    <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                        <Image src={product.image} width={128} height={128} alt={product.name} className="object-contain dark:invert" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-2 group-hover:text-primary line-clamp-2 transition-colors">{product.name}</h3>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <div className="text-lg font-bold text-primary">₦{product.price.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">≈ {product.eth} ETH</div>
                                        </div>
                                        <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
                                            <ShoppingCart className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
