'use client';

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingCart, User, Grid } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/catalog', label: 'Catalog', icon: Grid },
        { href: '/cart', label: 'Cart', icon: ShoppingCart },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-border bg-background/95 backdrop-blur md:hidden pb-safe">
            <div className="grid h-16 grid-cols-4">
                {links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-6 w-6 mb-1", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium truncate">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
