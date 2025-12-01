# SwenAutos - Implementation Guide

**Quick Start:** How to implement the UX/UI improvements

---

## 📊 Current Status

**Current Score:** 7.5/10  
**Target Score:** 9.0/10  
**Time to Target:** 10 weeks

---

## 🚀 Quick Wins (This Week)

These improvements can be done in **1-2 days** with immediate impact:

### Day 1: Essential UI Fixes

#### 1. Add Cart Badge (15 minutes)
**File:** `components/layout/Navbar.tsx`

```tsx
// Around line 50, update cart link
<Link href="/cart" className="hidden md:flex items-center text-gray-600 hover:text-primary transition-colors relative">
  <ShoppingCart className="h-5 w-5" />
  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
      {cartItems.length}
    </span>
  )}
</Link>
```

#### 2. Show Dual Pricing (30 minutes)
**File:** `components/ui/product-card.tsx`

Update the price section to show both NGN and ETH:

```tsx
<div className="mt-auto flex items-end justify-between">
  <div>
    <span className="text-lg font-bold text-primary">
      ₦{formatCurrency(price)}
    </span>
    <div className="text-xs text-muted-foreground">
      ≈ {priceETH} ETH
    </div>
  </div>
  <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full hover:bg-primary hover:text-white">
    <ShoppingCart className="h-4w-4" />
  </Button>
</div>
```

#### 3. Add Stock Status (30 minutes)
**File:** `components/ui/product-card.tsx`

Add after rating display:

```tsx
<div className="flex items-center gap-2 text-xs">
  <div className={cn(
    "h-2 w-2 rounded-full",
    inStock ? "bg-green-500" : "bg-red-500"
  )} />
  <span className="text-muted-foreground">
    {inStock ? "In Stock" : "Out of Stock"}
  </span>
</div>
```

#### 4. Add Sort to Catalog (1 hour)
**File:** `app/catalog/page.tsx`

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const [sortBy, setSortBy] = useState("recent");

// Add before grid
<div className="flex items-center justify-between mb-6">
  <div>
    <h1 className="text-2xl font-bold">All Products</h1>
    <p className="text-sm text-muted-foreground mt-1">
      {products?.length || 0} results
    </p>
  </div>
  
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger className="w-48">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="recent">Most Recent</SelectItem>
      <SelectItem value="price-low">Price: Low to High</SelectItem>
      <SelectItem value="price-high">Price: High to Low</SelectItem>
      <SelectItem value="rating">Highest Rated</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Day 2: Core Features

#### 5. Add Skeleton Loaders (1 hour)
**Create:** `components/ui/product-card-skeleton.tsx`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
```

Use in catalog:

```tsx
import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton";

{isLoading ? (
  Array.from({ length: 24 }).map((_, i) => (
    <ProductCardSkeleton key={i} />
  ))
) : (
  products.map(product => <ProductCard key={product.id} {...product} />)
)}
```

#### 6. Add Search to Homepage (1 hour)
**File:** `app/page.tsx`

Replace the existing hero CTAs with:

```tsx
import { useRouter } from 'next/navigation';

const [searchQuery, setSearchQuery] = useState("");
const router = useRouter();

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (searchQuery.trim()) {
    router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`);
  }
};

// In hero section
<SlideUp delay={0.2} className="space-y-4 max-w-2xl">
  <form onSubmit={handleSearch} className="relative">
    <Input 
      placeholder="Search by part name, number, or vehicle..." 
      className="h-14 pr-14 text-base"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Button 
      type="submit"
      size="icon" 
      className="absolute right-1 top-1 h-12 w-12"
    >
      <Search className="h-5 w-5" />
    </Button>
  </form>
  
  {/* Existing CTAs below */}
</SlideUp>
```

---

## 📅 10-Week Roadmap

### Week 1: Foundation ✅
- [x] Quick wins implementation
- [ ] Add pagination (24 items/page)
- [ ] Create global search component
- [ ] Fix primary color consistency
- [ ] Update typography to use design tokens

**Deliverable:** Functional product discovery

### Week 2-3: Filtering & Sorting
- [ ] Make FilterSidebar stateful
- [ ] Add active filter chips
- [ ] Connect filters to URL params
- [ ] Add price range slider
- [ ] Implement condition filters

**Deliverable:** Advanced product filtering

### Week 4-5: Core Features
- [ ] Build YMM selector
- [ ] Create "My Garage" feature
- [ ] Add wishlist functionality
- [ ] Implement product zoom
- [ ] Add reviews UI (not connected yet)

**Deliverable:** Essential marketplace features

### Week 6-7: Trust & Social Proof
- [ ] Add testimonials section
- [ ] Implement verification badges
- [ ] Create trust indicators
- [ ] Add seller ratings
- [ ] Display security certifications

**Deliverable:** Trust-building elements

### Week 8: Mobile Optimization
- [ ] Mobile filter drawer
- [ ] Swipeable image galleries
- [ ] Mobile-optimized checkout
- [ ] Touch-friendly interactions
- [ ] Performance optimization

**Deliverable:** Mobile-first experience

### Week 9-10: Polish & Advanced
- [ ] Part comparison tool
- [ ] VIN decoder (optional)
- [ ] Q&A system
- [ ] Order tracking
- [ ] Final testing & fixes

**Deliverable:** Production-ready

---

## 🔧 Setup Instructions

### 1. Update Dependencies

```bash
# Install any missing UI components
npx shadcn-ui@latest add select accordion sheet dialog
```

### 2. Fix Primary Color

**File:** `app/globals.css`

Update the color definitions:

```css
:root {
  /* Change from oklch to hex for consistency */
  --primary: #2563EB;
  --primary-foreground: #FFFFFF;
}

.dark {
  --primary: #60A5FA;
  --primary-foreground: #1E293B;
}
```

### 3. Create Helper Files

#### Design Tokens
**Create:** `lib/design-tokens.ts`

```typescript
export const COLORS = {
  primary: {
    light: '#2563EB',
    dark: '#60A5FA',
  },
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

export const BORDER_RADIUS = {
  sm: 'rounded-lg',      // 8px - Buttons
  md: 'rounded-xl',      // 12px - Cards
  lg: 'rounded-2xl',     // 16px - Modals
  xl: 'rounded-3xl',     // 24px - Hero
  full: 'rounded-full',  // Pills
};
```

---

## 📋 Component Updates

### ProductCard Enhancement

**File:** `components/ui/product-card.tsx`

Complete enhanced version with all improvements:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

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
  isOEM?: boolean;
  onSale?: boolean;
}

export function ProductCard({ 
  id, name, price, priceETH = 0, image, rating, reviews, category,
  inStock = true, isOEM = false, onSale = false 
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
      {/* Quick Actions (on hover) */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 rounded-full shadow-lg"
          onClick={(e) => { e.preventDefault(); /* Add to wishlist */ }}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="secondary" 
          className="h-8 w-8 rounded-full shadow-lg"
          onClick={(e) => { e.preventDefault(); /* Quick view */ }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isOEM && (
          <Badge className="bg-green-500 text-white">OEM</Badge>
        )}
        {onSale && (
          <Badge className="bg-red-500 text-white">Sale</Badge>
        )}
      </div>

      {/* Image */}
      <Link href={`/product/${id}`} className="relative aspect-square overflow-hidden bg-secondary/50">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-medium backdrop-blur">
          {category}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Rating & Stock */}
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

        {/* Name */}
        <Link href={`/product/${id}`} className="mb-2">
          <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Price & Cart */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            <span className="text-lg font-bold text-primary">
              ₦{formatCurrency(price)}
            </span>
            {priceETH > 0 && (
              <div className="text-xs text-muted-foreground">
                ≈ {priceETH} ETH
              </div>
            )}
          </div>
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 rounded-full hover:bg-primary hover:text-white transition-colors"
            disabled={!inStock}
            onClick={(e) => { e.preventDefault(); /* Add to cart */ }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Checklist

Before deploying any changes:

### Visual Testing
- [ ] Check on Desktop Chrome
- [ ] Check on Mobile Safari
- [ ] Toggle dark mode - verify all pages
- [ ] Test responsive breakpoints (375px, 768px, 1024px, 1440px)
- [ ] Verify all hover states
- [ ] Check focus states

### Functional Testing
- [ ] Search works and redirects correctly
- [ ] Filters apply and show results
- [ ] Sort changes product order
- [ ] Cart badge updates
- [ ] Links navigate correctly
- [ ] Buttons trigger expected actions

### Performance
- [ ] Run Lighthouse audit (target: >90)
- [ ] Check bundle size (should not increase >10%)
- [ ] Verify skeleton loaders show
- [ ] Test on slow 3G connection

### Accessibility
- [ ] Tab through entire page
- [ ] Test with screen reader
- [ ] Verify color contrast (WebAIM)
- [ ] Check ARIA labels
- [ ] Ensure all images have alt text

---

## 🎯 Success Metrics

Track these after implementation:

### Week 1 Targets
- Search usage: >30% of sessions
- Filter usage: >20% of sessions
- Cart additions: +10% vs baseline
- Bounce rate: <50%

### Week 5 Targets
- Average products viewed: >5 per session
- Wishlist usage: >15%
- Review engagement: Users viewing reviews >60%
- Mobile conversion: >2%

### Week 10 Targets
- Overall conversion: >3.5%
- My Garage adoption: >30%
- Review submission: >3% of buyers
- Performance score: >90

---

## 🐛 Troubleshooting

### Common Issues

#### Dark mode not working
**Solution:** Ensure parent has dark class
```tsx
<html lang="en" className={theme === 'dark' ? 'dark' : ''}>
```

#### Filters not persisting
**Solution:** Use URL search params
```tsx
const searchParams = useSearchParams();
const filters = searchParams.get('filters');
```

#### Images causing layout shift
**Solution:** Always use aspect ratio
```tsx
<div className="relative aspect-square">
  <Image src={img} fill />
</div>
```

#### Slow catalog page
**Solution:** Add pagination
```tsx
const ITEMS_PER_PAGE = 24;
const start = (page - 1) * ITEMS_PER_PAGE;
const end = start + ITEMS_PER_PAGE;
const paginatedProducts = products.slice(start, end);
```

---

## 📚 Resources

### Documentation
- [UX/UI Analysis](./UX_UI_ANALYSIS.md) - Full analysis
- [Design System](./DESIGN_SYSTEM.md) - Component guidelines
- [Quick Reference](./QUICK_REFERENCE.md) - Project overview

### External
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)

---

## ✅ Weekly Checkpoints

### End of Week 1
- [ ] All quick wins implemented
- [ ] Search functional on homepage
- [ ] Catalog has sort and filters
- [ ] Product cards show dual pricing
- [ ] Skeleton loaders in place

### End of Week 3
- [ ] Filters fully functional
- [ ] Active filter chips display
- [ ] Pagination working
- [ ] Performance >80 on Lighthouse

### End of Week 5
- [ ] YMM selector built
- [ ] My Garage feature live
- [ ] Wishlist functional
- [ ] Product zoom working
- [ ] Reviews UI complete

### End of Week 8
- [ ] Mobile experience optimized
- [ ] All trust elements in place
- [ ] Performance >90
- [ ] Accessibility score >90

### End of Week 10
- [ ] All features complete
- [ ] User testing done
- [ ] Final bugs fixed
- [ ] **Ready for production** 🚀

---

**Start here:** Implement Quick Wins (Day 1-2)  
**Questions?** See DESIGN_SYSTEM.md or UX_UI_ANALYSIS.md
