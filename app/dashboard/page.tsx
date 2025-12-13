"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart3, Package, TrendingUp, DollarSign, Clock, CheckCircle,
    AlertCircle, ChevronRight, Eye, Edit, Trash2, Plus, ShoppingBag, Truck
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute>
            {user?.role === 'seller' ? (
                // SELLER DASHBOARD
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-8 pb-6">
                        <div className="container mx-auto px-4 md:px-6">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">Seller Dashboard</h1>
                            <p className="text-blue-100">Manage your listings, orders, and earnings</p>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 py-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">Total Listings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-gray-900">12</div>
                                        <Package className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">3 active, 9 sold</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-gray-900">28</div>
                                        <BarChart3 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">5 pending delivery</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-gray-900">₦450K</div>
                                        <TrendingUp className="h-5 w-5 text-purple-500" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">This month</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium text-gray-600">Seller Rating</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline justify-between">
                                        <div className="text-3xl font-bold text-gray-900">4.8</div>
                                        <DollarSign className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Based on 156 reviews</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="md:col-span-3">
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col sm:flex-row gap-3">
                                    <Link href="/dashboard/create-listing" className="flex-1">
                                        <Button className="w-full" size="sm">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create New Listing
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/orders" className="flex-1">
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Package className="mr-2 h-4 w-4" />
                                            View Orders
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/earnings" className="flex-1">
                                        <Button variant="outline" className="w-full" size="sm">
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Withdraw Earnings
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex-1">
                                        <Button variant="outline" className="w-full" size="sm">
                                            <AlertCircle className="mr-2 h-4 w-4" />
                                            Account Settings
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            ) : (
                // BUYER DASHBOARD
                <div className="min-h-screen bg-gray-50">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white pt-12 pb-10">
                        <div className="container mx-auto px-4 md:px-6">
                            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome, {user?.name || 'Buyer'}</h1>
                            <p className="text-green-50 text-lg">What would you like to do today?</p>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 md:px-6 -mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                <Link href="/shop">
                                    <CardHeader>
                                        <ShoppingBag className="w-12 h-12 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <CardTitle className="text-2xl">Browse Products</CardTitle>
                                        <CardDescription>Explore our marketplace for the best auto parts.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-green-600 font-medium">
                                            Go to Shop <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>

                            <Card className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                                <Link href="/orders">
                                    <CardHeader>
                                        <Truck className="w-12 h-12 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                                        <CardTitle className="text-2xl">My Orders</CardTitle>
                                        <CardDescription>Track your purchases and view order history.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-blue-600 font-medium">
                                            View History <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        </div>

                        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
                            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
                                If you have any questions about your orders or account, our support team is here to assist you.
                            </p>
                            <Link href="/dashboard/settings">
                                <Button variant="outline">Manage Account Settings</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </ProtectedRoute>
    );
}


