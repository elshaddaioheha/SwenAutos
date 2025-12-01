"use client";

import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { formatEther } from "viem";
import { Select } from "@/components/ui/select";
import { useState } from "react";

// import { useAllProducts } from "@/hooks/useProductListing";
// ...

export default function CatalogPage() {
    // const { products, isLoading, isError } = useAllProducts();
    const isLoading = false;
    const isError = false;
    const products = [
        { productId: "1", name: "Engine Oil Filter - Toyota Camry", price: BigInt(12000000000000000), category: "Engine", ipfsHash: "/placeholder-part.png" },
        { productId: "2", name: "Brake Pads Set - Honda Accord", price: BigInt(28000000000000000), category: "Brakes", ipfsHash: "/placeholder-part.png" },
    ];
    const [sortBy, setSortBy] = useState("recent");

    // Helper to format blockchain product to UI product
    const formatProduct = (p: any) => {
        return {
            id: p.productId.toString(),
            name: p.name,
            price: parseFloat(formatEther(p.price)),
            rating: 0, // Not yet implemented on chain
            reviews: 0,
            category: p.category,
            image: p.ipfsHash || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=500", // Fallback image
        };
    };

    return (
        <div className="container px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <Button variant="outline" className="w-full flex items-center justify-between">
                        <span className="flex items-center">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </span>
                    </Button>
                </div>

                {/* Sidebar (Desktop) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
                            <span className="text-sm text-muted-foreground">
                                {products ? products.length : 0} results
                            </span>
                        </div>

                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-48"
                        >
                            <option value="recent">Most Recent</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 py-10">
                            Failed to load products. Please try again later.
                        </div>
                    ) : !products || products.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            No products found. Be the first to list one!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product: any) => (
                                <ProductCard key={product.productId.toString()} {...formatProduct(product)} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
