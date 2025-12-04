"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useAuthState } from "@campnetwork/origin/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireSeller?: boolean;
}

export function ProtectedRoute({ children, requireSeller = false }: ProtectedRouteProps) {
    const { isAuthenticated: localAuth, user, isLoading: localLoading } = useAuth();
    const { authenticated: web3Auth, loading: web3Loading } = useAuthState();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Optimization: Short-circuit if we are already authenticated
        // This prevents waiting for slow providers if one is already ready
        if (localAuth) {
            // If we need seller role, ensure we have it
            if (requireSeller && user?.role !== "seller") {
                router.push("/dashboard/settings"); // Or unauthorized page
            } else {
                setIsChecking(false);
            }
            return;
        }

        if (web3Auth) {
            // Web3 users are currently treated as buyers by default in this check
            // If requireSeller is true, we might block them or need to fetch role from contract/backend
            if (requireSeller) {
                // If they are web3 auth'd but we don't have a local user profile with 'seller' role yet...
                // We might need to wait for localLoading to be sure, OR redirect them to create a profile.
                // For now, if they are web3Auth only, we assume they might not be a seller yet unless synced.
                if (!user || user.role !== "seller") {
                    // Don't redirect immediately if local is still loading, as it might sync up
                    if (localLoading) return;
                    router.push("/dashboard/settings");
                } else {
                    setIsChecking(false);
                }
            } else {
                setIsChecking(false);
            }
            return;
        }

        // If not authenticated yet, wait for both to finish loading
        if (web3Loading || localLoading) return;

        // Both loaded, and neither is authenticated
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);

    }, [localAuth, web3Auth, web3Loading, localLoading, router, pathname, requireSeller, user]);

    if (web3Loading || localLoading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // If requireSeller is true, double check before rendering children
    // This prevents "flash of content"
    if (requireSeller && user?.role !== "seller") {
        return null; // Or a custom "Access Denied" component
    }

    return <>{children}</>;
}
