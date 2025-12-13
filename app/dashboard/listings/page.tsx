"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, TrendingUp, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useSellerProducts, useProduct, useProductListing } from "@/hooks/useProductListing";
import { useToast } from "@/components/ToastProvider";
import { useState } from "react";
import { formatEther } from "viem";

function ListingCard({ productId }: { productId: bigint }) {
    const { product, isLoading } = useProduct(Number(productId));
    const { deactivateListing, isPending } = useProductListing();
    const { push } = useToast();
    const [isDeactivating, setIsDeactivating] = useState(false);

    if (isLoading) return <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />;
    if (!product) return null;

    // Helper to safe format
    const formatPrice = (p: bigint) => {
        try {
            return formatEther(p);
        } catch {
            return "0";
        }
    };

    const handleDeactivate = async () => {
        if (!confirm("Are you sure you want to deactivate this listing?")) return;
        setIsDeactivating(true);
        try {
            await deactivateListing(Number(productId));
            push({ message: "Listing deactivated successfully", type: "success" });
        } catch (error) {
            console.error(error);
            push({ message: "Failed to deactivate listing", type: "error" });
        } finally {
            setIsDeactivating(false);
        }
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                            <span className="font-semibold text-gray-900">{formatPrice(product.price)} CAMP</span>
                            <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                <span>{product.inventory.toString()} in stock</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{product.sold.toString()} sold</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Edit functionality to be implemented */}
                        <Button variant="outline" size="sm" disabled>
                            <Edit className="h-4 w-4" />
                        </Button>
                        {/* Deactivate functionality */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={handleDeactivate}
                            disabled={!product.isActive || isDeactivating || isPending}
                        >
                            {isDeactivating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function MyListings() {
    const { address } = useAccount();
    const { productIds, isLoading } = useSellerProducts(address || "");

    return (
        <ProtectedRoute requireSeller={true}>
            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
                            <p className="text-gray-500 mt-1">Manage your product listings</p>
                        </div>
                        <Link href="/dashboard/create-listing">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                New Listing
                            </Button>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : !productIds || productIds.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">You haven't listed any products yet.</p>
                        <Link href="/dashboard/create-listing">
                            <Button variant="link" className="text-blue-600 mt-2">Create your first listing</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {[...productIds].reverse().map((id) => (
                            <ListingCard key={id.toString()} productId={id} />
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
