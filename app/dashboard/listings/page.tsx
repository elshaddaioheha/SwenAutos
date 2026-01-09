"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, TrendingUp, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useSellerProducts, useProduct, useProductListing } from "@/hooks/useProductListing";
import { useToast } from "@/components/ToastProvider";
"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuthState } from "@campnetwork/origin/react";
import { useSellerProducts, useProduct } from "@/hooks/useProductListing";
import { Loader2 } from "lucide-react";

function SellerProductCard({ productId }: { productId: number }) {
    const { product, isLoading, isError } = useProduct(productId);

    if (isLoading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (isError || !product) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-gray-500">Failed to load product {productId}</div>
                </CardContent>
            </Card>
        );
    }

    const listing = {
        id: product.productId?.toString() ?? String(productId),
        name: product.name || "Unnamed",
        price: product.price ? Number(product.price) : 0,
        sold: product.sold ? Number(product.sold) : 0,
        active: product.isActive ?? false
    };

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{listing.name}</h3>
                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                            <span className="font-semibold text-gray-900">₦{(listing.price / 1e18 * 1600).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                            <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{Math.max(0, Math.floor(Math.random() * 300))} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{listing.sold} sold</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {listing.active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-gray-600">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-gray-600">
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function MyListings() {
    const { authenticated, loading } = useAuthState();

    // If still loading auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!authenticated) {
        return (
            <ProtectedRoute requireSeller={true}>
                <div className="container mx-auto px-4 md:px-6 py-10">
                    <div className="text-center text-gray-500">Please connect your wallet to view your listings.</div>
                </div>
            </ProtectedRoute>
        );
    }

    const userAddress = (authenticated as any) ? ( (authenticated as any).address ?? undefined ) : undefined;
    // Note: useSellerProducts expects string address
    const { productIds, isLoading, isError } = useSellerProducts(userAddress || "0x0000000000000000000000000000000000000000");

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

                <div className="grid grid-cols-1 gap-6">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : isError ? (
                        <div className="text-center text-red-500 py-10">Failed to load your listings.</div>
                    ) : !productIds || productIds.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">You have no listings yet.</div>
                    ) : (
                        productIds.map((id: bigint) => (
                            <SellerProductCard key={id.toString()} productId={Number(id)} />
                        ))
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
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
