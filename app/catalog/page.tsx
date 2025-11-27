import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

// Mock Data (Expanded)
const PRODUCTS = [
    {
        id: "1",
        name: "High Performance Brake Kit (Ceramic)",
        price: 249.99,
        rating: 4.8,
        reviews: 124,
        category: "Brakes",
        image: "https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&q=80&w=500",
    },
    {
        id: "2",
        name: "Synthetic Motor Oil 5W-30 (5L)",
        price: 45.00,
        rating: 4.9,
        reviews: 850,
        category: "Engine",
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=500",
    },
    {
        id: "3",
        name: "LED Headlight Bulbs H4 (Pair)",
        price: 89.95,
        rating: 4.6,
        reviews: 320,
        category: "Electrical",
        image: "https://images.unsplash.com/photo-1459603677915-a62079ffd030?auto=format&fit=crop&q=80&w=500",
    },
    {
        id: "4",
        name: "Sport Suspension Springs",
        price: 189.00,
        rating: 4.7,
        reviews: 56,
        category: "Suspension",
        image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=500",
    },
    {
        id: "5",
        name: "Air Filter (High Flow)",
        price: 35.50,
        rating: 4.5,
        reviews: 210,
        category: "Engine",
        image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=500",
    },
    {
        id: "6",
        name: "Spark Plugs Iridium (Set of 4)",
        price: 42.00,
        rating: 4.8,
        reviews: 430,
        category: "Engine",
        image: "https://images.unsplash.com/photo-1626125345510-4703ee92383e?auto=format&fit=crop&q=80&w=500",
    },
];

export default function CatalogPage() {
    return (
        <div className="container px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <Button variant="outline" className="w-full flex items-center justify-between">
                        <span className="flex items-center">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </span>
                    </Button>
                </div>

                {/* Sidebar (Desktop) */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <FilterSidebar />
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">All Products</h1>
                        <span className="text-sm text-muted-foreground">{PRODUCTS.length} results</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
