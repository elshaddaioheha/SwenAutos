"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Eye, EyeOff, Check, X, ChevronDown, ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");

    // Basic password strength checks for visual feedback
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Calculate strength bar fill (0-4)
    const strengthScore = [hasLength, hasUppercase, hasNumber, password.length > 10].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background flex flex-col items-center py-8 px-4 transition-colors duration-300">

            {/* Header */}
            <div className="w-full max-w-xl flex items-center justify-between mb-8 relative">
                <Link href="/" className="absolute left-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                </Link>
                <h1 className="text-gray-900 dark:text-white font-bold text-2xl md:text-[28px] mx-auto font-manrope">Create Account</h1>
            </div>

            {/* Main Content Container */}
            <div className="w-full max-w-xl space-y-8">

                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mr-4 transition-colors">
                            <div className="h-full bg-gradient-to-r from-primary to-blue-400 w-1/2 rounded-full" />
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-manrope">Step 1 of 2</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-300">

                    {/* Form Intro */}
                    <div className="text-center mb-8">
                        <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-2 font-manrope">Join SwenAutos</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-[15px] font-manrope">
                            Create your account to start buying or selling auto parts
                        </p>
                    </div>

                    <form className="space-y-5">

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-gray-900 dark:text-white font-bold text-sm font-manrope flex">
                                Full Name <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Input
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
                                placeholder="Enter your email address"
                                className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
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
                                    placeholder="80 123 45678"
                                    className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus-visible:ring-primary bg-white dark:bg-gray-800 flex-1 text-gray-900 dark:text-white"
                                />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-[13px] font-manrope">
                                We'll send a verification code to this number
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
                            <p className="text-gray-500 dark:text-gray-400 text-[13px] font-manrope">Enter a password</p>

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
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-3 pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-white dark:bg-gray-800"
                                />
                            </div>
                            <label htmlFor="terms" className="text-sm text-gray-900 dark:text-white font-manrope leading-tight">
                                I agree to the <Link href="#" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        {/* Continue Button */}
                        <Button className="w-full h-12 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 font-bold text-base rounded-xl mt-4 shadow-none transition-colors">
                            Continue <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                    </form>
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
