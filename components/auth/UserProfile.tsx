"use client";

import { useAuth as useOriginAuth, useAuthState } from "@campnetwork/origin/react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, LayoutDashboard, Package, PlusCircle, Store } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { supabase } from "@/lib/supabase";
import { baseCampTestnet, CONTRACT_ADDRESSES } from "@/lib/campNetwork";
import ProductListingArtifact from "@/lib/abis/ProductListing.json";

export function UserProfile() {
    // Web3 Auth
    const { authenticated: web3Authenticated, loading: web3Loading } = useAuthState();
    const originAuth = useOriginAuth();
    const web3User = (originAuth as any)?.user || (originAuth as any);

    // Local Supabase Auth
    const { isAuthenticated: localAuthenticated, user: localUser, logout: localLogout } = useAuth();
    const router = useRouter();

    const isLoading = web3Loading;
    const isAuthenticated = web3Authenticated || localAuthenticated;

    // Determine display data
    let displayUser = {
        name: "Anonymous User",
        image: null as string | null | undefined,
        subtitle: "Guest"
    };

    if (web3Authenticated) {
        displayUser = {
            name: web3User?.metadata?.name || "Wallet User",
            image: web3User?.metadata?.image,
            subtitle: web3User?.address ? `${web3User.address.slice(0, 6)}...${web3User.address.slice(-4)}` : "Connected via Wallet"
        };
    } else if (localAuthenticated && localUser) {
        displayUser = {
            name: localUser.name || localUser.email.split('@')[0],
            image: null, // Supabase user avatar if available
            subtitle: localUser.email
        };
    }

    const { address } = useAccount();
    const [userRole, setUserRole] = useState<"buyer" | "seller">("buyer");

    useEffect(() => {
        const checkRole = async () => {
            if (localUser?.role) {
                setUserRole(localUser.role);
                return;
            }

            if (address) {
                // 1. Check Supabase
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('role')
                        .ilike('wallet_address', address)
                        .single();

                    if (data?.role === 'seller') {
                        setUserRole('seller');
                        return;
                    }
                } catch (e) {
                    console.error("Supabase role check failed", e);
                }

                // 2. Check On-Chain
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
                        setUserRole('seller');
                    }
                } catch (e) {
                    console.error("On-chain role check failed", e);
                }
            }
        };

        checkRole();
    }, [localUser, address]);

    if (isLoading) {
        return <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />;
    }

    if (!isAuthenticated) {
        return (
            <Link href="/login">
                <Button variant="default" className="font-bold">
                    Sign In
                </Button>
            </Link>
        );
    }

    const handleLogout = async () => {
        if (web3Authenticated) {
            // CAMP Network handles wallet disconnect via its own UI usually, 
            // but we can redirect or clear local state if needed.
            // For now, we just reload to clear Web3 state if the SDK doesn't expose a disconnect method directly here.
            window.location.href = "/";
        } else {
            await localLogout();
            router.push('/login');
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {displayUser.image ? (
                        <NextImage
                            src={displayUser.image}
                            alt={displayUser.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-5 w-5" />
                        </div>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {displayUser.subtitle}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {userRole === 'seller' && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="cursor-pointer">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/listings" className="cursor-pointer">
                                <Store className="mr-2 h-4 w-4" />
                                <span>My Listings</span>
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/create-listing" className="cursor-pointer">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Create Listing</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{web3Authenticated ? "Disconnect Wallet" : "Sign Out"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
