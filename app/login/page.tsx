"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoginButton } from "@/components/auth/LoginButton";
import { supabase } from "@/lib/supabase";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"buyer" | "seller">("buyer");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(true);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert(error.message);
                setLoading(false);
                return;
            }

            // Redirect
            if (searchParams.get("redirect")) {
                router.push(searchParams.get("redirect")!);
            } else {
                if (role === "seller") {
                    router.push("/dashboard");
                } else {
                    router.push("/shop");
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            setLoading(false);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col items-center py-8 px-4 font-manrope transition-colors duration-300">

            {/* Header */}
            <div className="w-full max-w-xl flex items-center justify-between mb-12 relative">
                <Link href="/" className="absolute left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                </Link>
                <h1 className="text-gray-900 dark:text-white font-bold text-2xl md:text-[28px] mx-auto">Sign In</h1>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-xl space-y-8">

                {/* Form Container */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">

                    {/* Form Intro */}
                    <div className="text-center mb-8">
                        <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-2">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-[15px]">
                            Sign in to continue to SwenAutos
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Email/Password Form */}
                        <form onSubmit={handleLogin} className="space-y-4">

                            {/* Role Toggle */}
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
                                <button
                                    type="button"
                                    onClick={() => setRole("buyer")}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "buyer"
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                                        }`}
                                >
                                    Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("seller")}
                                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === "seller"
                                        ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900"
                                        }`}
                                >
                                    Seller
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 rounded-xl pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
                                    Remember me
                                </label>
                                <Link href="/forgot-password" className="text-primary font-bold hover:underline">Forgot password?</Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-600/20"
                            >
                                {loading ? "Signing In..." : `Sign In as ${role === 'buyer' ? 'Buyer' : 'Seller'}`}
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                                    Or connect with wallet
                                </span>
                            </div>
                        </div>

                        <LoginButton redirectUrl={redirectUrl} />
                    </div>
                </div>

                {/* Footer Link */}
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center text-gray-900 dark:text-white">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
