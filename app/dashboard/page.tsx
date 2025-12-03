"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BarChart3, Package, TrendingUp, DollarSign, Clock, CheckCircle,
    AlertCircle, ChevronRight, Eye, Edit, Trash2, Plus
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

/**
 * Seller Dashboard
 * Overview of seller's business: recent orders, earnings, listings, and quick actions
 */

export default function SellerDashboard() {
    return (
        <ProtectedRoute requireSeller={true}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-8 pb-6">
                    <div className="container mx-auto px-4 md:px-6">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Seller Dashboard</h1>
                        <p className="text-blue-100">Manage your listings, orders, and earnings</p>
                    </div>
                </div>

                {/* Main Content */}
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

                    {/* Recent Orders */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Orders</CardTitle>
                                        <CardDescription>Orders waiting for action</CardDescription>
                                    </div>
                                    <Link href="/dashboard/orders">
                                        <Button variant="ghost" size="sm">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Order Item */}
                                    {[
                                        { id: 1, product: "Engine Oil Filter", buyer: "John Doe", amount: "₦12,500", status: "pending", statusColor: "bg-yellow-100 text-yellow-800" },
                                        { id: 2, product: "Brake Pads Set", buyer: "Jane Smith", amount: "₦28,000", status: "shipped", statusColor: "bg-blue-100 text-blue-800" },
                                        { id: 3, product: "Air Filter", buyer: "Mike Johnson", amount: "₦8,500", status: "delivered", statusColor: "bg-green-100 text-green-800" },
                                    ].map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-900">{order.product}</p>
                                                <p className="text-sm text-gray-500">from {order.buyer}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">{order.amount}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${order.statusColor} capitalize`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <ChevronRight className="h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Listings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Listings</CardTitle>
                                <CardDescription>Your current products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        { id: 1, name: "Engine Oil Filter", views: 245, sold: 3 },
                                        { id: 2, name: "Brake Pads Set", views: 189, sold: 8 },
                                        { id: 3, name: "Air Filter", views: 156, sold: 2 },
                                    ].map((listing) => (
                                        <Link key={listing.id} href={`/dashboard/listings/${listing.id}`}>
                                            <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                                                <p className="font-medium text-gray-900 text-sm">{listing.name}</p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{listing.views} views</span>
                                                    <CheckCircle className="h-3 w-3 ml-2" />
                                                    <span>{listing.sold} sold</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href="/dashboard/listings">
                                        <Button variant="outline" className="w-full" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            View All Listings
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Performance Overview</CardTitle>
                            <CardDescription>Your seller metrics for the last 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">94%</div>
                                    <p className="text-sm text-gray-600">Positive Feedback</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">1.2h</div>
                                    <p className="text-sm text-gray-600">Avg. Response Time</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">100%</div>
                                    <p className="text-sm text-gray-600">On-Time Delivery</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">₦450K</div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}


