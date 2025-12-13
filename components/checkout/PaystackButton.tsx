"use client";

import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaystackButtonProps {
    email: string;
    amount: number; // In Naira
    onSuccess: (reference: any) => void;
    onClose: () => void;
    label?: string;
    className?: string;
    disabled?: boolean;
}

// Use a public test key. In production, this should be in env vars.
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

export const PaystackButton = ({
    email,
    amount,
    onSuccess,
    onClose,
    label = "Pay Now",
    className,
    disabled = false
}: PaystackButtonProps) => {

    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        publicKey: PAYSTACK_PUBLIC_KEY,
    };

    const initializePayment = usePaystackPayment(config);

    return (
        <Button
            onClick={() => {
                // @ts-ignore: Library types might be mismatched
                initializePayment(onSuccess, onClose)
            }}
            disabled={disabled}
            className={className}
        >
            {disabled ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {label}
        </Button>
    );
};
