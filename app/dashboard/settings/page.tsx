"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/AuthProvider";
import { User, Lock, Mail, Store, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { supabase } from "@/lib/supabase";
import { Wallet } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState<"profile" | "security" | "role">("profile");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    // Profile State
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    // Password State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Wallet Linking State
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { signMessageAsync } = useSignMessage();
    const [isLinkingWallet, setIsLinkingWallet] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: name, email })
                .eq('id', user.id);

            if (error) throw error;

            updateUser({ name, email });
            setMessage({ type: "success", text: "Profile updated successfully!" });
        } catch (error: any) {
            console.error("Profile update error:", error);
            setMessage({ type: "error", text: error.message || "Failed to update profile." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match." });
            return;
        }
        setIsLoading(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setMessage({ type: "success", text: "Password updated successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, 1000);
    };

    const handleSwitchRole = async () => {
        if (!user) return;
        setIsLoading(true);
        setMessage(null);

        try {
            const newRole = user?.role === "buyer" ? "seller" : "buyer";
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', user.id);

            if (error) throw error;

            updateUser({ role: newRole });
            setMessage({ type: "success", text: `Switched to ${newRole} mode successfully!` });
        } catch (error: any) {
            console.error("Role switch error:", error);
            setMessage({ type: "error", text: error.message || "Failed to switch role." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLinkWallet = async () => {
        if (!user) return;
        setIsLinkingWallet(true);
        setMessage(null);

        try {
            if (!isConnected || !address) {
                // Connect Logic
                const connector = connectors[0];
                if (connector) {
                    connect({ connector });
                    // Connection is async, we rely on checking checking isConnected in a useEffect or similar,
                    // but wagmi's connect might not resolve strictly after connection is "ready" for signing immediately in all cases
                    // simplified for this flow: assume user has to click again or we wait?
                    // actually if we call connect, we likely can't immediately sign in the same handler if it prompts user.
                    // Better UX: Button changes to "Verify & Link" if connected but not linked.
                    // For now, let's assume if not connected, we connect.
                    setMessage({ type: "success", text: "Wallet connected! Click again to verify and link." });
                    setIsLinkingWallet(false);
                    return;
                } else {
                    throw new Error("No wallet connector found");
                }
            }

            // Sign Message
            const messageToSign = `Link wallet ${address} to user ${user.id}`;
            await signMessageAsync({ message: messageToSign });

            // Update Supabase
            const { error } = await supabase
                .from('profiles')
                .update({ wallet_address: address })
                .eq('id', user.id); // Assuming user.id matches auth.uid() and primary key

            if (error) throw error;

            // Update local user context if needed (maybe adding wallet_address field to user object? or just rely on DB)
            // updateUser({ wallet_address: address }); // If updateUser supports it

            setMessage({ type: "success", text: "Wallet linked successfully!" });

        } catch (err: any) {
            console.error("Linking error:", err);
            setMessage({ type: "error", text: err.message || "Failed to link wallet." });
        } finally {
            setIsLinkingWallet(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to view settings.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background py-8 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        <ArrowLeft className="h-6 w-6 text-gray-900 dark:text-white" />
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-manrope">Settings</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                activeTab === "profile"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <User className="h-4 w-4" />
                            Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                activeTab === "security"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <Lock className="h-4 w-4" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab("role")}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                activeTab === "role"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <Store className="h-4 w-4" />
                            Account Role
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">

                            {message && (
                                <div className={cn(
                                    "mb-6 p-4 rounded-xl text-sm font-medium",
                                    message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {message.text}
                                </div>
                            )}

                            {activeTab === "profile" && (
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Full Name</label>
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Email Address</label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 rounded-xl"
                                        />
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            )}

                            {activeTab === "security" && (
                                <>
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h2>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">Current Password</label>
                                            <Input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">New Password</label>
                                            <Input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">Confirm New Password</label>
                                            <Input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>

                                        <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold">
                                            {isLoading ? "Updating..." : "Update Password"}
                                        </Button>
                                    </form>

                                    <div className="pt-8 mt-8 border-t border-gray-100 dark:border-gray-800">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Linked Accounts</h2>
                                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Crypto Wallet</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        {address ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}` : "Link your wallet for easier payments and login."}
                                                    </p>
                                                </div>
                                                <div className="h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                    <Wallet className="h-6 w-6" />
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                onClick={handleLinkWallet}
                                                disabled={isLinkingWallet}
                                                variant="outline"
                                                className="w-full h-12 font-bold border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                            >
                                                {isLinkingWallet ? "Processing..." : isConnected ? "Verify & Link Wallet" : "Connect Wallet"}
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === "role" && (
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Role</h2>

                                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white capitalize">
                                                    Current Role: {user.role}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {user.role === "buyer"
                                                        ? "Switch to Seller to start listing your own auto parts."
                                                        : "Switch to Buyer to focus on purchasing parts."}
                                                </p>
                                            </div>
                                            <div className={cn(
                                                "h-12 w-12 rounded-full flex items-center justify-center",
                                                user.role === "buyer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                                            )}>
                                                {user.role === "buyer" ? <User className="h-6 w-6" /> : <Store className="h-6 w-6" />}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <Button
                                                onClick={handleSwitchRole}
                                                disabled={isLoading}
                                                variant="outline"
                                                className="h-12 w-full font-bold border-primary text-primary hover:bg-primary/5"
                                            >
                                                {isLoading ? "Switching..." : `Switch to ${user.role === "buyer" ? "Seller" : "Buyer"} Mode`}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
