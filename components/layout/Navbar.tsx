'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Car, Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check auth state on mount
        const checkAuth = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
        };

        checkAuth();

        // Listen for storage events to update state across tabs/windows
        window.addEventListener('storage', checkAuth);

        // Custom event for immediate updates within the same window
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
    };

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
                    <Link href="/catalog" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Catalog
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
                    {isLoggedIn && (
                        <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                            Profile
                        </Link>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart Icon (Desktop) */}
                    <Link href="/cart" className="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                    </Link>

                    {isLoggedIn ? (
                        <div className="hidden md:flex items-center space-x-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                                <User className="h-5 w-5 text-gray-600" />
                            </Button>
                            <Button variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/login">
                                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 font-semibold px-6">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-md shadow-blue-200">
                                    Get Started
                                </Button>
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
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                    <Link
                        href="/"
                        className="text-base font-medium text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        href="/catalog"
                        className="text-base font-medium text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Catalog
                    </Link>
                    <Link
                        href="/cart"
                        className="text-base font-medium text-gray-600 hover:text-primary py-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Cart
                    </Link>
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

                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/profile"
                                className="text-base font-medium text-gray-600 hover:text-primary py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </Link>
                            <div className="pt-4 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    className="w-full justify-center border-red-200 text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-center border-primary text-primary hover:bg-primary/5">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white shadow-md shadow-blue-200">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
