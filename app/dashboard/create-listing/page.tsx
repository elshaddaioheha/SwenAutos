"use client";

import { useState } from "react";
import { useProductListing } from "@/hooks/useProductListing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function CreateListingContent() {
    const { createListing, isPending, isConfirming, isConfirmed, hash, error } = useProductListing();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        inventory: "",
        ipfsHash: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createListing(
                formData.name,
                formData.description,
                formData.category,
                formData.price,
                parseInt(formData.inventory),
                formData.ipfsHash
            );
        } catch (err) {
            console.error("Failed to create listing", err);
        }
    };

    if (isConfirmed) {
        return (
            <div className="container max-w-lg mx-auto py-20 px-4">
                <Card className="text-center border-green-200 bg-green-50">
                    <CardHeader>
                        <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-green-800">Listing Created Successfully!</CardTitle>
                        <CardDescription className="text-green-700">
                            Your product has been added to the blockchain.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 break-all">Transaction Hash: {hash}</p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => router.push('/catalog')} variant="default">
                                View Catalog
                            </Button>
                            <Button onClick={() => window.location.reload()} variant="outline">
                                Create Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Listing</CardTitle>
                    <CardDescription>List your spare part on the SwenAutos marketplace.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Toyota Camry Brake Pads"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="e.g. Brakes, Engine, Suspension"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe the condition and compatibility..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (CAMP/ETH)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.000001"
                                    placeholder="0.05"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="inventory">Inventory Quantity</Label>
                                <Input
                                    id="inventory"
                                    name="inventory"
                                    type="number"
                                    placeholder="10"
                                    value={formData.inventory}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ipfsHash">Image URL (Optional)</Label>
                            <Input
                                id="ipfsHash"
                                name="ipfsHash"
                                placeholder="https://..."
                                value={formData.ipfsHash}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500">Enter a direct image URL for now.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                                Error: {error.message}
                            </div>
                        )}

                        <Button type="submit" className="w-full font-bold" disabled={isPending || isConfirming}>
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {isConfirming ? "Confirming..." : "Waiting for Wallet..."}
                                </>
                            ) : (
                                "Create Listing"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CreateListingPage() {
    return (
        <ProtectedRoute requireSeller={true}>
            <CreateListingContent />
        </ProtectedRoute>
    );
}
