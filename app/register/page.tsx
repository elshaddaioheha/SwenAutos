"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Eye, EyeOff, Check, X, ChevronDown, ArrowRight, User, Store
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [step, setStep] = useState(1); // 1: Info, 2: Verification
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [role, setRole] = useState<"buyer" | "seller">("buyer");
    const [businessName, setBusinessName] = useState("");
    const [verifyVia, setVerifyVia] = useState<"phone" | "email">("phone");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password Strength
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const strengthScore = [hasLength, hasUppercase, hasNumber, password.length > 10].filter(Boolean).length;

    // Validation
    const isPasswordValid = hasLength && hasUppercase && hasNumber;
    const doPasswordsMatch = password === confirmPassword && password !== "";
    const isFormValid =
        fullName.length > 2 &&
        email.includes("@") &&
        phone.length > 5 &&
        // For sellers we require a business name
        (role === "buyer" ? true : businessName.length > 2) &&
        isPasswordValid &&
        doPasswordsMatch &&
        agreedToTerms;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone: phone,
                        role: role,
                        business_name: businessName,
                    },
                },
            });

            if (error) {
                alert(error.message);
                setIsLoading(false);
                return;
            }

            // If successful, move to verification step (which we'll repurpose as "Check Email")
            setIsLoading(false);
            setStep(2);

        } catch (err) {
            console.error("Registration error:", err);
            alert("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    // handleVerify is no longer needed for email link verification, 
    // but we might keep it if we implement OTP later. 
    // For now, we'll just remove it or leave it empty/unused if the UI changes.
    // I will remove it and update the UI to not use it.

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col items-center py-8 px-4 transition-colors duration-300">

            {/* Header */}
            <div className="w-full max-w-xl flex items-center justify-between mb-8 relative">
                <Link href="/" className="absolute left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                </Link>
                <h1 className="text-gray-900 dark:text-white font-bold text-2xl md:text-[28px] mx-auto font-manrope">
                    {step === 1 ? "Create Account" : "Verify Account"}
                </h1>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-xl space-y-8">

                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4 transition-colors">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500 ease-out rounded-full"
                                style={{ width: step === 1 ? "50%" : "100%" }}
                            />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-manrope">Step {step} of 2</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">

                    {step === 1 ? (
                        <>
                            {/* Form Intro */}
                            <div className="text-center mb-8">
                                <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-2 font-manrope">Join SwenAutos</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-[15px] font-manrope">
                                    Create your account to start buying or selling auto parts
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-5">

                                {/* Role Selection */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setRole("buyer")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                            role === "buyer"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                                        )}
                                    >
                                        <User className="h-6 w-6 mb-2" />
                                        <span className="font-bold text-sm">I'm a Buyer</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("seller")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                                            role === "seller"
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300"
                                        )}
                                    >
                                        <Store className="h-6 w-6 mb-2" />
                                        <span className="font-bold text-sm">I'm a Seller</span>
                                    </button>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                        Full Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Email Address */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                        Email Address <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Verification method */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">Verify via</label>
                                    <div className="flex gap-3">
                                        <label className={`px-3 py-2 rounded-xl border ${verifyVia === 'phone' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                                            <input type="radio" name="verifyVia" value="phone" checked={verifyVia === 'phone'} onChange={() => setVerifyVia('phone')} className="mr-2" /> Phone
                                        </label>
                                        <label className={`px-3 py-2 rounded-xl border ${verifyVia === 'email' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                                            <input type="radio" name="verifyVia" value="email" checked={verifyVia === 'email'} onChange={() => setVerifyVia('email')} className="mr-2" /> Email
                                        </label>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                        Phone Number <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="w-24 flex-shrink-0 relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                                                <span className="text-sm font-medium">🇳🇬</span>
                                            </div>
                                            <select className="h-12 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-8 pr-2 text-sm appearance-none focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white transition-colors">
                                                <option>+234</option>
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                                        </div>
                                        <Input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="80 123 45678"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 flex-1 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-[13px] font-manrope">
                                        {verifyVia === 'phone' ? "We'll send a verification code to this number" : "We'll send a verification link/code to your email"}
                                    </p>
                                </div>

                                {/* Password */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                        Password <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 pr-10 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Strength */}
                                <div className="space-y-2">
                                    <div className="flex gap-1.5 h-1.5">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`flex-1 rounded-full transition-colors ${strengthScore >= level
                                                    ? (strengthScore <= 2 ? "bg-yellow-400" : "bg-green-500")
                                                    : "bg-gray-200 dark:bg-gray-700"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${hasLength ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "border-gray-300 dark:border-gray-600"}`}>
                                                {hasLength && <Check className="h-2.5 w-2.5 text-green-600 dark:text-green-500" />}
                                            </div>
                                            <span className={`text-[13px] ${hasLength ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>At least 8 characters</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${hasUppercase ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "border-gray-300 dark:border-gray-600"}`}>
                                                {hasUppercase && <Check className="h-2.5 w-2.5 text-green-600 dark:text-green-500" />}
                                            </div>
                                            <span className={`text-[13px] ${hasUppercase ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>One uppercase letter</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${hasNumber ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "border-gray-300 dark:border-gray-600"}`}>
                                                {hasNumber && <Check className="h-2.5 w-2.5 text-green-600 dark:text-green-500" />}
                                            </div>
                                            <span className={`text-[13px] ${hasNumber ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}>One number</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                        Confirm Password <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 pr-10 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {!doPasswordsMatch && confirmPassword && (
                                        <p className="text-red-500 text-xs">Passwords do not match</p>
                                    )}
                                </div>

                                {/* Seller-specific business information */}
                                {role === 'seller' && (
                                    <div className="space-y-1.5">
                                        <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">Business / Shop Name <span className="text-red-500 ml-1">*</span></label>
                                        <Input
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            placeholder="Your shop or business name"
                                            className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        />
                                        <p className="text-gray-500 text-xs">This helps buyers find you and sets up your storefront identity.</p>
                                    </div>
                                )}

                                {/* Terms Checkbox */}
                                <div className="flex items-start gap-3 pt-2">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            type="checkbox"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-white dark:bg-gray-800"
                                        />
                                    </div>
                                    <label htmlFor="terms" className="text-sm text-gray-900 dark:text-white font-manrope leading-tight">
                                        I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>
                                    </label>
                                </div>

                                {/* Continue Button */}
                                <Button
                                    type="submit"
                                    disabled={!isFormValid || isLoading}
                                    className={cn(
                                        "w-full h-12 font-bold text-base rounded-xl mt-4 shadow-none transition-all",
                                        isFormValid
                                            ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-blue-500/20"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? "Processing..." : "Continue"}
                                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>

                            </form>
                        </>
                    ) : (
                        <>
                            {/* Verification Step */}
                            <div className="text-center mb-8">
                                <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-2 font-manrope">Check Your Email</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-[15px] font-manrope">
                                    We sent a confirmation link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                                    Please click the link to verify your account.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <Button
                                    type="button"
                                    onClick={() => router.push('/login')}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    Go to Login
                                </Button>

                                <p className="text-center text-sm text-gray-500">
                                    Didn't receive the email? <button type="button" className="text-primary font-bold hover:underline" onClick={() => alert("Please check your spam folder.")}>Resend</button>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Link */}
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-manrope">
                        Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
