# SwenAutos Design Implementation

This document outlines the implementation of the SwenAutos marketplace design system and core pages.

## Design System

### Typography
- **Font**: Manrope (Google Fonts)
- **Weights**: Regular (400), Medium (500), Semi-bold (600)
- **Implementation**: Configured in `app/layout.tsx` and `app/globals.css`.

### Color Palette
The color palette is defined in `app/globals.css` using CSS variables and mapped to Tailwind CSS semantic classes.

**Primary Blue Palette:**
- 100: `#1D4ED8` (Primary)
- 80: `#2563EB`
- 60: `#3B82F6`
- 40: `#60A5FA`
- 20: `#DBEAFE`
- 10: `#D0D5DF`

**Neutral Palette:**
- 100: `#111827` (Foreground)
- 90: `#1F2937`
- 80: `#374151`
- 70: `#4B5563`
- 60: `#6B7280`
- 50: `#9CA3AF`
- 40: `#D1D5DB`
- 30: `#E5E7EB`
- 20: `#F3F4F6` (Background/Secondary)

## Components

### UI Primitives (`components/ui`)
- **Button**: Variants for default, outline, ghost, etc.
- **Input**: Styled text inputs.
- **ProductCard**: Reusable card for displaying product info, price, and rating.

### Layout (`components/layout`)
- **Navbar**: Responsive top navigation with logo, search, and user actions.
- **BottomNav**: Mobile-only bottom navigation bar.

### Catalog (`components/catalog`)
- **FilterSidebar**: Sidebar for filtering products by category, price, and brand.

## Pages

### Homepage (`app/page.tsx`)
- Hero section with search.
- "Shop by Category" grid.
- "Featured Products" grid.
- Trust indicators (Escrow, Instant Payments, Verified Sellers).

### Catalog (`app/catalog/page.tsx`)
- Sidebar with filters.
- Grid of all products.
- Responsive layout.

### Product Detail (`app/product/[id]/page.tsx`)
- Large product image.
- Detailed product information (rating, price, description).
- "Buy Now" and "Add to Cart" actions.
- Seller information and product specifications.

## Configuration
- **Tailwind CSS v4**: Configured in `app/globals.css` using the `@theme` directive.
- **Lucide React**: Icons used throughout the application.
- **Next.js Config**: Updated to transpile `lucide-react` for compatibility.
