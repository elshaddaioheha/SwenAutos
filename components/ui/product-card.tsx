import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
    category: string;
}

export function ProductCard({ id, name, price, image, rating, reviews, category }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
            <Link href={`/product/${id}`} className="relative aspect-square overflow-hidden bg-secondary/50">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur">
                    {category}
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-center space-x-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{rating}</span>
                    <span className="text-xs text-muted-foreground">({reviews})</span>
                </div>

                <Link href={`/product/${id}`} className="mb-2">
                    <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary">
                        {name}
                    </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        {formatCurrency(price)}
                    </span>
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white">
                        <ShoppingCart className="h-4 w-4" />
                        <span className="sr-only">Add to cart</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
