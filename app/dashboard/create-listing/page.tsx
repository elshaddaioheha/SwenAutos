"use client";

import { useRef, useEffect, useState } from "react";
import { useProductListing, useIsSeller } from "@/hooks/useProductListing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, CheckCircle, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthState } from "@campnetwork/origin/react";
import { LoginButton } from "@/components/auth/LoginButton";
import { supabase } from "@/lib/supabase";
import { decodeEventLog } from "viem";
import ProductListingArtifact from "@/lib/abis/ProductListing.json";
import { useAccount } from "wagmi";

function WalletRequiredCard() {
    return (
        <div className="container max-w-lg mx-auto py-20 px-4">
            <Card className="text-center border-blue-200 bg-blue-50">
                <CardHeader>
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                        <Wallet className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-800">Wallet Connection Required</CardTitle>
                    <CardDescription className="text-blue-700">
                        To create a listing on the blockchain, you must connect your crypto wallet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Connecting your wallet allows you to sign transactions and prove ownership of your listings.
                    </p>
                    <div className="flex justify-center">
                        <div className="w-full max-w-xs">
                            <LoginButton />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function CreateListingContent() {
    const { createListing, registerAsSeller, isPending, isConfirming, isConfirmed, hash, receipt, error } = useProductListing();
    const router = useRouter();
    const { authenticated } = useAuthState();
    const { address } = useAccount();
    const { isSeller, isLoading: isCheckingSeller, refetch: refetchSeller } = useIsSeller(address || "");

    if (!authenticated) {
        return <WalletRequiredCard />;
    }

    if (isCheckingSeller) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-500">Checking seller status...</p>
            </div>
        );
    }

    if (!isSeller) {
        return (
            <div className="container max-w-lg mx-auto py-20 px-4">
                <Card className="text-center border-yellow-200 bg-yellow-50">
                    <CardHeader>
                        <div className="mx-auto bg-yellow-100 p-3 rounded-full w-fit mb-4">
                            <Wallet className="h-8 w-8 text-yellow-600" />
                        </div>
                        <CardTitle className="text-yellow-800">On-Chain Registration Required</CardTitle>
                        <CardDescription className="text-yellow-700">
                            You are a seller in our system, but you need to register your wallet on-chain to create listings.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            This is a one-time transaction to verify your wallet on the CAMP network.
                        </p>
                        <Button
                            onClick={async () => {
                                try {
                                    await registerAsSeller();
                                    // The useEffect will handle reload or we can refetch
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                            disabled={isPending || isConfirming}
                            className="w-full"
                        >
                            {isPending || isConfirming ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registering...
                                </>
                            ) : (
                                "Register as Seller On-Chain"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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

    const [isIndexing, setIsIndexing] = useState(false);
    const hasIndexed = useRef(false);

    useEffect(() => {
        if (isConfirmed && hash && !isSeller) {
            refetchSeller();
        }

        const indexProduct = async () => {
            if (isConfirmed && receipt && hash && !hasIndexed.current && address) {
                hasIndexed.current = true;
                setIsIndexing(true);
                try {
                    // Find the ListingCreated log
                    let productId = null;

                    for (const log of receipt.logs) {
                        try {
                            const event = decodeEventLog({
                                abi: ProductListingArtifact.abi,
                                data: log.data,
                                topics: log.topics,
                            });

                            if (event.eventName === 'ListingCreated') {
                                // @ts-ignore
                                productId = event.args.productId.toString();
                                break;
                            }
                        } catch (e) {
                            // Not our event, skip
                        }
                    }

                    if (productId) {
                        console.log("Found Product ID:", productId);

                        const { error: dbError } = await supabase
                            .from('products')
                            .insert({
                                id: BigInt(productId),
                                seller_address: address,
                                name: formData.name,
                                description: formData.description,
                                category: formData.category,
                                price_wei: parseFloat(formData.price) * 1e18, // Approximate logging, ideally store exact string
                                price_camp: parseFloat(formData.price),
                                inventory: parseInt(formData.inventory),
                                image_url: formData.ipfsHash ? `https://ipfs.io/ipfs/${formData.ipfsHash}` : null,
                                is_active: true
                            });

                        if (dbError) {
                            console.error("Supabase insert error:", dbError);
                        } else {
                            console.log("Product indexed to Supabase!");
                        }
                    } else {
                        console.error("Could not find ListingCreated event in receipt");
                    }

                } catch (err) {
                    console.error("Indexing failed:", err);
                } finally {
                    setIsIndexing(false);
                }
            }
        }

        indexProduct();
    }, [isConfirmed, hash, receipt, address, formData]);

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
                            Your product has been added to the blockchain {isIndexing ? "and is being indexed..." : "and indexed!"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600 break-all">Transaction Hash: {hash}</p>
                        <p className="text-sm text-gray-500">
                            {isIndexing ? "Syncing with database..." : "Database sync complete."}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => router.push('/shop')} variant="default">
                                View Shop
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
        <ProtectedRoute requireSeller={true}>
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
                                    <Label htmlFor="price">Price (CAMP Tokens)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        placeholder="0.001"
                                        type="number"
                                        step="0.0001"
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="inventory">Inventory</Label>
                                    <Input
                                        id="inventory"
                                        name="inventory"
                                        placeholder="100"
                                        type="number"
                                        value={formData.inventory}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ipfsHash">IPFS Hash (Optional)</Label>
                                <Input
                                    id="ipfsHash"
                                    name="ipfsHash"
                                    placeholder="QmXxx..."
                                    value={formData.ipfsHash}
                                    onChange={handleChange}
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">{error.message}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isPending || isConfirming}
                                className="w-full"
                            >
                                {isPending || isConfirming ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isPending ? "Submitting..." : "Confirming..."}
                                    </>
                                ) : (
                                    "Create Listing"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}

export default function CreateListingPage() {
    return (
        <ProtectedRoute requireSeller={true}>
            <CreateListingContent />
        </ProtectedRoute>
    );
}
