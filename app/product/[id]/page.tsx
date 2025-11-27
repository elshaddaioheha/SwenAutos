import { Button } from "@/components/ui/button";
import { Star, Truck, ShieldCheck, ShoppingCart, CreditCard } from "lucide-react";
import Image from "next/image";
import { formatCurrency, truncateAddress } from "@/lib/utils";

// Mock Data for a single product
const PRODUCT = {
    id: "1",
    name: "High Performance Brake Kit (Ceramic)",
    price: 249.99,
    description: "Upgrade your vehicle's stopping power with our premium ceramic brake kit. Designed for high-performance driving, these pads offer superior fade resistance and low dust operation. Includes rotors and pads for front axle.",
    rating: 4.8,
    reviews: 124,
    category: "Brakes",
    image: "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&q=80&w=800",
    seller: {
        address: "0x1234...5678",
        rating: 4.9,
        sales: 1500
    },
    specs: [
        { label: "Material", value: "Ceramic Compound" },
        { label: "Position", value: "Front Axle" },
        { label: "Warranty", value: "2 Years / 24,000 Miles" },
        { label: "Compatibility", value: "BMW 3 Series (2019+), Audi A4 (2020+)" }
    ]
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    return (
        <div className="container px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/50 border">
                    <Image
                        src={PRODUCT.image}
                        alt={PRODUCT.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                {PRODUCT.category}
                            </span>
                            <div className="flex items-center text-yellow-500">
                                <Star className="h-4 w-4 fill-current" />
                                <span className="ml-1 text-sm font-medium text-foreground">{PRODUCT.rating}</span>
                                <span className="ml-1 text-sm text-muted-foreground">({PRODUCT.reviews} reviews)</span>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                            {PRODUCT.name}
                        </h1>
                    </div>

                    <div className="flex items-baseline space-x-4">
                        <span className="text-3xl font-bold text-primary">
                            {formatCurrency(PRODUCT.price)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            + Shipping calculated at checkout
                        </span>
                    </div>

                    <div className="prose prose-sm text-muted-foreground">
                        <p>{PRODUCT.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Buy Now
                        </Button>
                        <Button size="lg" variant="outline" className="flex-1">
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                    </div>

                    {/* Trust & Seller Info */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                        <div className="flex items-start space-x-3">
                            <Truck className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium">Fast Delivery</h4>
                                <p className="text-xs text-muted-foreground">Ships within 24 hours</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <ShieldCheck className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium">Secure Escrow</h4>
                                <p className="text-xs text-muted-foreground">Funds held until delivery</p>
                            </div>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="pt-6 border-t">
                        <h3 className="font-semibold mb-4">Specifications</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PRODUCT.specs.map((spec) => (
                                <div key={spec.label} className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                                    <span className="text-sm font-medium">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
