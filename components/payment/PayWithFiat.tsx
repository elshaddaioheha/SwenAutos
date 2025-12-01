"use client";

import { usePaystackPayment } from 'react-paystack';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface PayWithFiatProps {
    email: string;
    amount: number; // Amount in NGN
    onSuccess?: (reference: any) => void;
    onClose?: () => void;
}

export function PayWithFiat({ email, amount, onSuccess, onClose }: PayWithFiatProps) {
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
        console.error("Paystack public key not found");
        return null;
    }

    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        publicKey,
    };

    const initializePayment = usePaystackPayment(config);

    const handlePayment = () => {
        initializePayment({
            onSuccess: (reference: any) => {
                console.log("Payment complete", reference);
                if (onSuccess) onSuccess(reference);
                // toast.success("Payment successful!");
                alert("Payment successful! Reference: " + reference.reference);
            },
            onClose: () => {
                console.log("Payment closed");
                if (onClose) onClose();
            },
        });
    };

    return (
        <Button
            onClick={handlePayment}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold text-base"
        >
            <CreditCard className="h-5 w-5 mr-2" /> Pay with Card (Fiat)
        </Button>
    );
}
