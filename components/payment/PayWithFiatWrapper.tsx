"use client";

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/components/providers/AuthProvider';
import { useAuthState } from '@campnetwork/origin/react';
import { Loader2 } from 'lucide-react';

// Dynamically import PayWithFiat to avoid SSR issues
const PayWithFiat = dynamic(
    () => import('@/components/payment/PayWithFiat').then(mod => ({ default: mod.PayWithFiat })),
    {
        ssr: false,
        loading: () => (
            <div className="flex items-center justify-center h-12">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
        ),
    }
);

interface PayWithFiatWrapperProps {
    email: string;
    amount: number;
}

export function PayWithFiatWrapper({ email, amount }: PayWithFiatWrapperProps) {
    const { isAuthenticated: localAuth, isLoading: localLoading } = useAuth() as any;
    const { authenticated: web3Auth, loading: web3Loading } = useAuthState();
    const [authorized, setAuthorized] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        setAuthorized(Boolean(localAuth || web3Auth));
    }, [localAuth, web3Auth]);

    if (!authorized) {
        return (
            <>
                <div className="p-4 rounded-xl border border-gray-200 bg-white dark:bg-gray-900">
                    <p className="text-sm text-gray-600 mb-3">You must be signed in to pay with fiat.</p>
                    <button onClick={() => setShowLogin(true)} className="w-full bg-primary text-white rounded-lg h-10">Sign in to pay</button>
                </div>
                <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSuccess={() => setShowLogin(false)} />
            </>
        );
    }

    return (
        <PayWithFiat
            email={email}
            amount={amount}
        />
    );
}
