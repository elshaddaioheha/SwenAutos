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
        // Wait for both auth providers to load
        if (web3Loading || localLoading) return;

        const isAuthenticated = localAuth || web3Auth;

        if (!isAuthenticated) {
            // Redirect to login with return URL
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else if (requireSeller && user?.role !== "seller") {
            // If seller role is required but user is not a seller
            // We don't redirect to login, but maybe to a "Forbidden" or "Upgrade" page
            // For now, we'll handle this in the render or redirect to dashboard settings
            router.push("/dashboard/settings");
        } else {
            setIsChecking(false);
        }
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
