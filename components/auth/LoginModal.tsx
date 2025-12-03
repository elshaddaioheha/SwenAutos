"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoginButton } from "@/components/auth/LoginButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user?: any) => void;
  returnUrl?: string;
}

export function LoginModal({ isOpen, onClose, onSuccess, returnUrl }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLocalLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Mock a successful login
      const user = { id: `u-${Date.now()}`, name: email.split("@")[0], email, role: "buyer" as const };
      login(user);
      setLoading(false);
      onSuccess?.(user);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg p-6 shadow-xl relative">
        <button onClick={onClose} aria-label="close" className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
          <X />
        </button>
        <h3 className="text-lg font-bold mb-2">Sign in to continue</h3>

        <form onSubmit={handleLocalLogin} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="my-3 text-center text-sm text-gray-400">or connect with your wallet</div>

        <LoginButton redirectUrl={returnUrl || '/dashboard'} />
      </div>
    </div>
  );
}

export default LoginModal;
