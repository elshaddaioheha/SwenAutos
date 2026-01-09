"use client";

import { useAuthState } from "@campnetwork/origin/react";
import { useAccount, useConnect } from "wagmi";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPublicClient, http } from "viem";

import { useToast } from "@/components/ToastProvider";
import { supabase } from "@/lib/supabase";
import { baseCampTestnet, CONTRACT_ADDRESSES } from "@/lib/campNetwork";
import ProductListingArtifact from "@/lib/abis/ProductListing.json";

interface LoginButtonProps {
    redirectUrl?: string;
    onSuccess?: () => void;
}

export function LoginButton({ redirectUrl = "/dashboard", onSuccess }: LoginButtonProps) {
    const { connectors, connect } = useConnect();
    const { authenticated, loading } = useAuthState();
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { login } = useAuth();
    const { push } = useToast();
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const checkUserRoleAndLogin = async () => {
            if (isConnected && address) {
                // Check Supabase for existing user with this wallet
                let userRole = "buyer"; // Default
                let userName = `User ${address.slice(0, 6)}`;
                let userEmail = "";

                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .ilike('wallet_address', address) // Case-insensitive check
                        .single();

                    if (data) {
                        userRole = data.role || "buyer";
                        userName = data.full_name || userName;
                        userEmail = data.email || "";
                    }

                    // If role is currently 'buyer', verify against the blockchain
                    // A user might be a seller on-chain but not yet updated in Supabase
                    if (userRole === "buyer") {
                        try {
                            const publicClient = createPublicClient({
                                chain: baseCampTestnet,
                                transport: http()
                            });

                            const sellerProducts = await publicClient.readContract({
                                address: CONTRACT_ADDRESSES.PRODUCT_LISTING as `0x${string}`,
                                abi: ProductListingArtifact.abi,
                                functionName: 'getSellerProducts',
                                args: [address]
                            }) as bigint[];

                            if (sellerProducts && sellerProducts.length > 0) {
                                console.log("User identified as seller via blockchain.");
                                userRole = "seller";

                                // Optional: You could update Supabase here to persist this role
                            }
                        } catch (chainError) {
                            console.error("Error verifying seller status on-chain:", chainError);
                        }
                    }

                } catch (err) {
                    console.error("Error checking user role:", err);
                }

                // Sync with local AuthProvider
                login({
                    id: address,
                    name: userName,
                    email: userEmail,
                    role: userRole as "buyer" | "seller"
                });

                push({ type: "success", message: `Wallet connected as ${userRole}!` });

                if (onSuccess) {
                    onSuccess();
                } else {
                    // Dynamic Redirect
                    if (userRole === "seller") {
                        router.push("/dashboard");
                    } else {
                        // Use provided redirectUrl if it's not the default dashboard, otherwise go to shop
                        if (redirectUrl && redirectUrl !== "/dashboard") {
                            router.push(redirectUrl);
                        } else {
                            router.push("/shop");
                        }
                    }
                }
            }
        };

        checkUserRoleAndLogin();
    }, [isConnected, address, router, redirectUrl, push, onSuccess, login]);

    const handleLogin = async () => {
        setIsConnecting(true);
        try {
            // Check if window.ethereum exists
            if (typeof window !== 'undefined' && !(window as any).ethereum) {
                push({ type: "error", message: "No crypto wallet found. Please install MetaMask." });
                setIsConnecting(false);
                return;
            }

            // Explicitly use the first available connector (usually injected/MetaMask)
            const connector = connectors[0];
            if (!connector) {
                push({ type: "error", message: "No wallet connector found." });
                setIsConnecting(false);
                return;
            }

            connect({ connector });
        } catch (error) {
            console.error("Login failed:", error);
            push({ type: "error", message: "Failed to connect wallet. Please try again." });
            setIsConnecting(false);
        }
    };

    return (
        <Button
            onClick={handleLogin}
            disabled={loading || isConnected || isConnecting}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20"
        >
            {loading || isConnecting ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : isConnected ? (
                "Redirecting..."
            ) : (
                <>
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Wallet to Sign In
                </>
            )}
        </Button>
    );
}
