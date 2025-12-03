"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Download } from "lucide-react";

export default function Earnings() {
    return (
        <ProtectedRoute requireSeller={true}>
            <div className="container mx-auto px-4 md:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Earnings & Payouts</h1>
                    <p className="text-gray-500 mt-1">Track your revenue and manage payouts</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">₦450,000</div>
                            <p className="text-sm text-gray-500 mt-2">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">₦85,500</div>
                            <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-gray-600">Pending Payout</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">₦25,000</div>
                            <p className="text-sm text-gray-500 mt-2">Available to withdraw</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Payout Section */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Request Payout</CardTitle>
                        <CardDescription>Withdraw your available earnings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                                <strong>Available Balance:</strong> ₦25,000
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Payout Amount</label>
                            <input type="number" placeholder="Enter amount" className="w-full h-10 px-3 border border-gray-300 rounded-lg mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Payout Method</label>
                            <select className="w-full h-10 px-3 border border-gray-300 rounded-lg mt-1">
                                <option>Bank Transfer</option>
                                <option>Crypto Wallet</option>
                                <option>Mobile Money</option>
                            </select>
                        </div>
                        <Button className="w-full">
                            <DollarSign className="mr-2 h-4 w-4" />
                            Request Payout
                        </Button>
                    </CardContent>
                </Card>

                {/* Earnings History */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Earnings History</CardTitle>
                                <CardDescription>Recent transaction records</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { date: "Dec 1, 2024", product: "Engine Oil Filter", amount: 12500, status: "Completed" },
                                { date: "Nov 28, 2024", product: "Brake Pads Set", amount: 28000, status: "Completed" },
                                { date: "Nov 25, 2024", product: "Air Filter", amount: 8500, status: "Completed" },
                                { date: "Nov 20, 2024", product: "Car Battery", amount: 45000, status: "Pending" },
                            ].map((transaction, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{transaction.product}</p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">₦{transaction.amount.toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
