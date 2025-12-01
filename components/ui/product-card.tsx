import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/providers/CartProvider';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    priceETH?: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
    inStock?: boolean;
}

export function ProductCard({
    id, name, price, priceETH = 0, image, rating, reviews, category, inStock = true
}: ProductCardProps) {
    const { addItem } = useCart();
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
            <Link href={`/product/${id}`} className="relative aspect-square overflow-hidden bg-secondary/50 block">
                <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur z-10">
                    {category}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-lg bg-white/90 hover:bg-white hover:text-red-500"
                        onClick={(e) => { e.preventDefault(); /* TODO: Wishlist */ }}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-lg bg-white/90 hover:bg-white hover:text-primary"
                        onClick={(e) => { e.preventDefault(); /* TODO: Quick View */ }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{rating}</span>
                        <span className="text-xs text-muted-foreground">({reviews})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <div className={cn(
                            "h-2 w-2 rounded-full",
                            inStock ? "bg-green-500" : "bg-red-500"
                        )} />
                        <span className="text-muted-foreground">
                            {inStock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>
                </div>

                <Link href={`/product/${id}`} className="mb-2">
                    <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">
                            {formatCurrency(price)}
                        </span>
                        {priceETH > 0 && (
                            <span className="text-xs text-muted-foreground">
                                ≈ {priceETH} ETH
                            </span>
                        )}
                    </div>
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-colors"
                        disabled={!inStock}
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({ id, name, price, image });
                        }}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
