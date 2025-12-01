"use client";

import { useConnect, useAuthState } from "@campnetwork/origin/react";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    redirectUrl?: string;
}

export function LoginButton({ redirectUrl = "/dashboard" }: LoginButtonProps) {
    const { connect } = useConnect();
    const { authenticated, loading } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (authenticated) {
            // User is authenticated, redirect
            router.push(redirectUrl);
        }
    }, [authenticated, router, redirectUrl]);

    const handleLogin = async () => {
        try {
            // Check if window.ethereum exists (basic check for wallet presence)
            if (typeof window !== 'undefined' && !(window as any).ethereum) {
                alert("No crypto wallet found. Please install MetaMask or another wallet.");
                return;
            }
            await connect();
        } catch (error) {
            console.error("Login failed:", error);
            // The specific error "Cannot read properties of null (reading 'requestAddresses')"
            // often happens if the provider is not ready or if the user cancels too quickly/unexpectedly.
            // We can show a user-friendly alert.
            alert("Failed to connect wallet. Please try again or ensure your wallet is unlocked.");
        }
    };

    return (
        <Button
            onClick={handleLogin}
            disabled={loading || authenticated}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20"
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                </>
            ) : authenticated ? (
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
