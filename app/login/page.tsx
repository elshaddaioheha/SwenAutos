"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Mock successful login
            localStorage.setItem("isLoggedIn", "true");
            setLoading(false);
            router.push(redirectUrl);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#F8F8F5] flex flex-col items-center py-8 px-4 font-manrope">

            {/* Header */}
            <div className="w-full max-w-xl flex items-center justify-between mb-12 relative">
                <Link href="/" className="absolute left-0 p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-[#111827]" />
                </Link>
                <h1 className="text-[#111827] font-bold text-2xl md:text-[28px] mx-auto">Sign In</h1>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-xl space-y-8">

                {/* Form Container */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

                    {/* Form Intro */}
                    <div className="text-center mb-8">
                        <h2 className="text-[#111827] font-bold text-2xl mb-2">Welcome Back</h2>
                        <p className="text-[#6B7280] text-[15px]">
                            Sign in to continue to SwenAutos
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email Address */}
                        <div className="space-y-1.5">
                            <label className="text-[#111827] font-bold text-sm flex">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="h-12 rounded-xl border-[#E5E7EB] focus-visible:ring-[#1D4ED8] bg-white"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-[#111827] font-bold text-sm flex">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs text-[#1D4ED8] font-bold hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    className="h-12 rounded-xl border-[#E5E7EB] focus-visible:ring-[#1D4ED8] bg-white pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold text-base rounded-xl mt-4 shadow-lg shadow-blue-600/20"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>

                    </form>
                </div>

                {/* Footer Link */}
                <div className="text-center">
                    <p className="text-[#6B7280] text-sm">
                        Don't have an account? <Link href="/register" className="text-[#1D4ED8] font-bold hover:underline">Create Account</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8F8F5] flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
