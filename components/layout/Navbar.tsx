'use client';

import Link from 'next/link';
import { Search, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
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

                {/* Centered Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Home
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
                    <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary/5 font-semibold px-6">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-white font-semibold px-6 shadow-md shadow-blue-200">
                            Get Started
                        </Button>
                    </Link>

                    {/* Mobile Menu Toggle (Placeholder) */}
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-600">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
