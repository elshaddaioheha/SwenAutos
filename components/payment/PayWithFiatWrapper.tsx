"use client";

import dynamic from 'next/dynamic';
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
    return (
        <PayWithFiat
            email={email}
            amount={amount}
        />
    );
}
