"use client";

import { useAuthState } from "@campnetwork/origin/react";
import { useAccount, useConnect } from "wagmi";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    redirectUrl?: string;
}

export function LoginButton({ redirectUrl = "/dashboard" }: LoginButtonProps) {
    const { connectors, connect } = useConnect();
    const { authenticated, loading } = useAuthState();
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { login } = useAuth();
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        // Use isConnected from wagmi as the primary signal for wallet connection
        if (isConnected && address) {
            // Only redirect if we are not already redirected (simple check)
            // In a real app, we might want to check if the user is already "logged in" in our local state matching this address

            // Sync with local AuthProvider
            login({
                id: address,
                name: `User ${address.slice(0, 6)}`,
                email: "", // Wallet users might not have email yet
                role: "buyer" // Default to buyer for wallet login
            });

            // User is authenticated, redirect
            router.push(redirectUrl);
        }
    }, [isConnected, address, router, redirectUrl]); // Removed login from dependency array to avoid potential loops if login changes identity

    const handleLogin = async () => {
        setIsConnecting(true);
        try {
            // Check if window.ethereum exists
            if (typeof window !== 'undefined' && !(window as any).ethereum) {
                alert("No crypto wallet found. Please install MetaMask or another wallet.");
                setIsConnecting(false);
                return;
            }

            // Explicitly use the first available connector (usually injected/MetaMask)
            const connector = connectors[0];
            if (!connector) {
                alert("No wallet connector found.");
                setIsConnecting(false);
                return;
            }

            connect({ connector });
        } catch (error) {
            console.error("Login failed:", error);
            alert("Failed to connect wallet. Please try again.");
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
