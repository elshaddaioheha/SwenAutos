'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
    "Engine", "Brakes", "Suspension", "Electrical", "Body", "Interior", "Wheels & Tires", "Fluids"
];

const BRANDS = [
    "Bosch", "Brembo", "Michelin", "Castrol", "Denso", "NGK", "Bilstein"
];

interface FilterSidebarProps {
    onFilterChange?: (filters: any) => void;
}

export function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const [filters, setFilters] = useState({
        categories: [] as string[],
        brands: [] as string[],
        priceRange: { min: 0, max: 100000 },
        condition: [] as string[],
        inStock: false,
        freeShipping: false,
    });

    const handleFilterChange = (key: string, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearAllFilters = () => {
        const emptyFilters = {
            categories: [],
            brands: [],
            priceRange: { min: 0, max: 100000 },
            condition: [],
            inStock: false,
            freeShipping: false,
        };
        setFilters(emptyFilters);
        onFilterChange?.(emptyFilters);
    };

    const activeFilterCount =
        filters.categories.length +
        filters.brands.length +
        filters.condition.length +
        (filters.inStock ? 1 : 0) +
        (filters.freeShipping ? 1 : 0);

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </h3>
                {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground">
                        Clear all
                    </Button>
                )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${category}`}
                                checked={filters.categories.includes(category)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const newCategories = checked
                                        ? [...filters.categories, category]
                                        : filters.categories.filter(c => c !== category);
                                    handleFilterChange('categories', newCategories);
                                }}
                            />
                            <label
                                htmlFor={`cat-${category}`}
                                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Price Range (₦)</h3>
                <div className="flex items-center space-x-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        className="h-9 text-sm"
                        value={filters.priceRange.min || ''}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            min: Number(e.target.value)
                        })}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        className="h-9 text-sm"
                        value={filters.priceRange.max || ''}
                        onChange={(e) => handleFilterChange('priceRange', {
                            ...filters.priceRange,
                            max: Number(e.target.value)
                        })}
                    />
                </div>
                <Button variant="outline" className="w-full h-9 text-sm">Apply Price</Button>
            </div>

            {/* Condition */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Condition</h3>
                <div className="space-y-2">
                    {['New', 'Used', 'Refurbished'].map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cond-${condition}`}
                                checked={filters.condition.includes(condition)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const newCondition = checked
                                        ? [...filters.condition, condition]
                                        : filters.condition.filter(c => c !== condition);
                                    handleFilterChange('condition', newCondition);
                                }}
                            />
                            <label
                                htmlFor={`cond-${condition}`}
                                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
                            >
                                {condition}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <h3 className="font-semibold text-sm text-foreground">Brands</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <Checkbox
                                id={`brand-${brand}`}
                                checked={filters.brands.includes(brand)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    const newBrands = checked
                                        ? [...filters.brands, brand]
                                        : filters.brands.filter(b => b !== brand);
                                    handleFilterChange('brands', newBrands);
                                }}
                            />
                            <label
                                htmlFor={`brand-${brand}`}
                                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="in-stock"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    />
                    <label
                        htmlFor="in-stock"
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
                    >
                        In Stock Only
                    </label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="free-shipping"
                        checked={filters.freeShipping}
                        onChange={(e) => handleFilterChange('freeShipping', e.target.checked)}
                    />
                    <label
                        htmlFor="free-shipping"
                        className="text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none"
                    >
                        Free Shipping
                    </label>
                </div>
            </div>
        </div>
    );
}
