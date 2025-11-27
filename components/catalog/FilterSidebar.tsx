'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
    "Engine", "Brakes", "Suspension", "Electrical", "Body", "Interior", "Wheels & Tires", "Fluids"
];

const BRANDS = [
    "Bosch", "Brembo", "Michelin", "Castrol", "Denso", "NGK", "Bilstein"
];

export function FilterSidebar() {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    return (
        <div className="w-full space-y-6">
            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Categories</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-input bg-background flex items-center justify-center cursor-pointer hover:border-primary">
                                {/* Checkbox logic would go here */}
                            </div>
                            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                {category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Price Range</h3>
                <div className="flex items-center space-x-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        className="h-9"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        className="h-9"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    />
                </div>
                <Button variant="outline" className="w-full h-9">Apply</Button>
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Brands</h3>
                <div className="space-y-2">
                    {BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <div className="h-4 w-4 rounded border border-input bg-background flex items-center justify-center cursor-pointer hover:border-primary">
                            </div>
                            <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
                                {brand}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
