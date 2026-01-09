"use client";
import React from 'react';
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [sortBy, setSortBy] = useState("recent");

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                let query = supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true);

                // Apply sorting
                if (sortBy === 'recent') {
                    query = query.order('created_at', { ascending: false });
                } else if (sortBy === 'price-low') {
                    query = query.order('price_camp', { ascending: true });
                } else if (sortBy === 'price-high') {
                    query = query.order('price_camp', { ascending: false });
                }

                const { data, error } = await query;

                if (error) throw error;

                const formattedProducts = data.map((p: any) => ({
                    id: p.id.toString(),
                    name: p.name,
                    price: (p.price_camp || 0) * 1600, // NGN approximation
                    priceCamp: p.price_camp,
                    rating: 4.5, // Placeholder until rating joined
                    reviews: 10,
                    category: p.category || "General",
                    image: p.image_url || "/placeholder-part.png"
                }));

                setProducts(formattedProducts);
            } catch (err) {
                console.error("Error fetching products:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [sortBy]);

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
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
