'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Car, Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from '@campnetwork/origin/react';
import { UserProfile } from '@/components/auth/UserProfile';
import { useCart } from '@/components/providers/CartProvider';
import { useAuth } from '@/components/providers/AuthProvider';

export function Navbar() {
    const { authenticated: web3Authenticated, loading: web3Loading } = useAuthState();
    const { isAuthenticated: localAuthenticated, user, isLoading: localLoading } = useAuth();
    const authenticated = web3Authenticated || localAuthenticated;
    const isLoading = web3Loading || localLoading;
    const { totalItems } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl tracking-tight text-primary">
                        SwenAutos
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Home
                    </Link>
                    <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Shop
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        About Us
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        How It Works
                    </Link>
                    <Link href="/vendor" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Become a Vendor
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:flex relative w-64 xl:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search parts..."
                            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none"
                        />
                    </div>

                    {/* Cart Icon (Desktop) - Only show for non-authenticated users and buyers */}
                    {!authenticated && (
                        <Link href="/cart" className="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors relative p-2 rounded-full hover:bg-gray-100">
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border-2 border-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {isLoading ? (
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse" />
                            <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse" />
                        </div>
                    ) : authenticated ? (
                        <UserProfile />
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary/5 font-semibold h-10 px-6"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-10 px-6 shadow-md shadow-blue-200"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </motion.div>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg overflow-hidden"
                    >
                        <div className="flex flex-col space-y-4 p-4">
                            <Link
                                href="/"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/shop"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Shop
                            </Link>
                            {!authenticated && (
                                <Link
                                    href="/cart"
                                    className="text-base font-medium text-gray-600 hover:text-primary py-2 flex items-center justify-between"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Cart
                                    {totalItems > 0 && (
                                        <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 font-bold">
                                            {totalItems} Items
                                        </span>
                                    )}
                                </Link>
                            )}
                            <Link
                                href="/about"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About Us
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/vendor"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Become a Vendor
                            </Link>

                            {authenticated ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="pt-4 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                // Wallet disconnect is handled by CAMP Network
                                                router.push('/');
                                            }}
                                        >
                                            Sign Out
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary text-primary hover:bg-primary/5 w-full h-10"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full h-10 shadow-md shadow-blue-200"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
