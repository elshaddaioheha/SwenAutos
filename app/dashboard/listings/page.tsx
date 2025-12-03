"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function MyListings() {
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
                    {[
                        { id: 1, name: "Engine Oil Filter - Toyota Camry", price: "₦12,500", views: 245, sold: 3, active: true },
                        { id: 2, name: "Brake Pads Set - Honda Accord", price: "₦28,000", views: 189, sold: 8, active: true },
                        { id: 3, name: "Air Filter Universal", price: "₦8,500", views: 156, sold: 2, active: false },
                    ].map((listing) => (
                        <Card key={listing.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-gray-900">{listing.name}</h3>
                                        <div className="flex items-center gap-6 mt-2 text-sm text-gray-500">
                                            <span className="font-semibold text-gray-900">{listing.price}</span>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{listing.views} views</span>
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
                                    <div className="flex items-center gap-2">
                                        <Link href={`/dashboard/listings/${listing.id}`}>
                                            <Button variant="outline" size="sm">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ProtectedRoute>
    );
}
