"use client";

import { useAuth as useOriginAuth, useAuthState } from "@campnetwork/origin/react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings, LayoutDashboard, Package, PlusCircle } from "lucide-react";
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

export function UserProfile() {
    // Web3 Auth
    const { authenticated: web3Authenticated, loading: web3Loading } = useAuthState();
    const originAuth = useOriginAuth();
    const web3User = (originAuth as any)?.user || (originAuth as any);

    // Web2 Auth
    const { user: localUser, isAuthenticated: localAuthenticated, logout } = useAuth();

    const isLoading = web3Loading;
    const isAuthenticated = web3Authenticated || localAuthenticated;

    // Determine which user data to display
    const displayUser = localAuthenticated ? {
        name: localUser?.name || "User",
        image: null, // Local user image support can be added later
        subtitle: localUser?.email || localUser?.role
    } : {
        name: web3User?.metadata?.name || "Anonymous User",
        image: web3User?.metadata?.image,
        subtitle: web3User?.address ? `${web3User.address.slice(0, 6)}...${web3User.address.slice(-4)}` : "Connected via Wallet"
    };

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
                        <p className="text-xs leading-none text-muted-foreground capitalize">
                            {displayUser.subtitle}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                    </Link>
                </DropdownMenuItem>
                {(localUser?.role === 'seller' || web3Authenticated) && (
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/create-listing" className="cursor-pointer">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>Create Listing</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/dashboard/orders" className="cursor-pointer">
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
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => {
                    logout();
                    window.location.href = "/";
                }}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
