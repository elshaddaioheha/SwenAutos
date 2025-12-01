# SwenAutos Design System

**Version:** 1.0  
**Last Updated:** December 1, 2024

A comprehensive design system to ensure consistency across the SwenAutos marketplace.

---

## 🎨 Design Principles

1. **Clarity First** - Auto parts shopping is complex; UI should be simple
2. **Trust & Safety** - Highlight escrow protection and verified sellers
3. **Dual Economy** - Seamlessly support both Naira and Crypto payments
4. **Mobile-First** - Majority of users are on mobile devices
5. **Accessibility** - WCAG 2.1 AA compliance minimum

---

## 🎯 Color System

### Primary Colors

```typescript
// Light Mode
--primary: #2563EB          // Main brand blue
--primary-hover: #1D4ED8    // Hover state
--primary-foreground: #FFFFFF

// Dark Mode
--primary: #60A5FA          // Lighter blue for dark backgrounds
--primary-hover: #3B82F6
--primary-foreground: #1E293B
```

### Semantic Colors

```typescript
// Success (OEM, In Stock, Verified)
--success: #10B981
--success-light: #D1FAE5
--success-dark: #065F46

// Warning (Low Stock, Attention)
--warning: #F59E0B
--warning-light: #FEF3C7
--warning-dark: #92400E

// Danger (Out of Stock, Error)
--danger: #EF4444
--danger-light: #FEE2E2
--danger-dark: #991B1B

// Info (Crypto, New Features)
--info: #3B82F6
--info-light: #DBEAFE
--info-dark: #1E40AF
```

### Neutral Scale

```typescript
// Light Mode
--neutral-50: #F9FAFB
--neutral-100: #F3F4F6
--neutral-200: #E5E7EB
--neutral-300: #D1D5DB
--neutral-400: #9CA3AF
--neutral-500: #6B7280
--neutral-600: #4B5563
--neutral-700: #374151
--neutral-800: #1F2937
--neutral-900: #111827

// Dark Mode - invert for backgrounds
```

### Usage Guidelines

| Use Case | Light Mode | Dark Mode | Notes |
|----------|------------|-----------|-------|
| Primary CTA | `bg-primary` | `bg-primary` | Main actions |
| Secondary CTA | `border-primary text-primary` | Same | Less emphasis |
| Success Badge | `bg-success text-white` | Same | OEM, Verified |
| Price Display | `text-primary` | Same | Consistent |
| Disabled State | `bg-neutral-200 text-neutral-400` | Adjust for dark | Reduced opacity |

---

## 📐 Spacing System

### Base Scale
Use Tailwind's default spacing scale (4px base unit).

```typescript
// Common patterns
--spacing-xs: 0.5rem    // 8px  - tight gaps
--spacing-sm: 0.75rem   // 12px - compact spacing
--spacing-md: 1rem      // 16px - default spacing
--spacing-lg: 1.5rem    // 24px - section spacing
--spacing-xl: 2rem      // 32px - large gaps
--spacing-2xl: 3rem     // 48px - section dividers
--spacing-3xl: 4rem     // 64px - page sections
```

### Layout Spacing

```typescript
// Semantic spacing classes
.container-spacing {
  @apply px-4 md:px-6 lg:px-8;
}

.section-spacing-y {
  @apply py-12 md:py-16 lg:py-24;
}

.card-padding {
  @apply p-6;
}

.card-gap {
  @apply gap-6;
}
```

### Component-Specific

| Component | Padding | Gap | Margin |
|-----------|---------|-----|--------|
| Button | `px-6 py-2.5` | - | - |
| Card | `p-6` | `gap-4` | `mb-6` |
| Input | `px-3 py-2` | - | `mb-4` |
| Section | `py-16` | - | - |
| Grid | - | `gap-6` | - |

---

## 🔤 Typography

### Font Family

```css
--font-primary: 'Manrope', ui-sans-serif, system-ui, sans-serif;
```

### Type Scale

| Element | Class | Size | Weight | Line Height | Use Case |
|---------|-------|------|--------|-------------|----------|
| H1 | `text-3xl md:text-4xl` | 30-36px / 36-48px | `font-bold` | `tight` | Page titles |
| H2 | `text-2xl md:text-3xl` | 24-30px / 30-36px | `font-bold` | `tight` | Section titles |
| H3 | `text-xl md:text-2xl` | 20-24px / 24-30px | `font-bold` | `snug` | Subsections |
| H4 | `text-lg md:text-xl` | 18-20px / 20-24px | `font-semibold` | `normal` | Card titles |
| Body | `text-base` | 16px | `font-normal` | `relaxed` | Body text |
| Small | `text-sm` | 14px | `font-normal` | `normal` | Helper text |
| Tiny | `text-xs` | 12px | `font-medium` | `normal` | Labels, badges |

### Semantic Components

```tsx
// lib/typography.tsx
import { cn } from "@/lib/utils";

export const H1 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tight", className)}>
    {children}
  </h1>
);

export const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("text-2xl md:text-3xl font-bold", className)}>
    {children}
  </h2>
);

export const H3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={cn("text-xl md:text-2xl font-bold", className)}>
    {children}
  </h3>
);

export const BodyText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("text-base leading-relaxed text-foreground", className)}>
    {children}
  </p>
);

export const SmallText = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </span>
);
```

---

## 📦 Border Radius

### Standard Scale

```typescript
const BORDER_RADIUS = {
  sm: 'rounded-lg',      // 8px  - Buttons, badges
  md: 'rounded-xl',      // 12px - Cards, inputs
  lg: 'rounded-2xl',     // 16px - Modals, large cards
  xl: 'rounded-3xl',     // 24px - Hero sections
  full: 'rounded-full',  // 9999px - Avatars, pills
};
```

### Component Mapping

| Component | Radius | Class | Notes |
|-----------|--------|-------|-------|
| Button | Small | `rounded-lg` | Consistent with inputs |
| Input | Small | `rounded-lg` | Match buttons |
| Card | Medium | `rounded-xl` | Standard cards |
| Modal | Large | `rounded-2xl` | Dialogs, sheets |
| Hero Card | XLarge | `rounded-3xl` | Homepage hero |
| Badge | Full | `rounded-full` | Pills, status |
| Avatar | Full | `rounded-full` | User images |

---

## 🎭 Shadows

### Shadow Scale

```css
/* Light subtle shadows for cards */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Default card shadow */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
             0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Elevated elements (modals, dropdowns) */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
             0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Primary button shadow */
--shadow-primary: 0 4px 14px 0 rgb(37 99 235 / 0.2);
```

### Usage

```tsx
// Card
<div className="rounded-xl shadow-sm hover:shadow-md transition-shadow">

// Primary button
<Button className="shadow-md shadow-blue-200 dark:shadow-blue-900/20">

// Modal
<Dialog>
  <DialogContent className="shadow-2xl">
</Dialog>
```

---

## 🔘 Components

### Buttons

#### Primary Button
```tsx
<Button className="bg-primary hover:bg-primary/90 text-white font-semibold h-11 px-6 rounded-lg shadow-md shadow-blue-200">
  {children}
</Button>
```

#### Secondary Button
```tsx
<Button 
  variant="outline" 
  className="border-primary text-primary hover:bg-primary/5 font-semibold h-11 px-6 rounded-lg"
>
  {children}
</Button>
```

#### Destructive Button
```tsx
<Button 
  variant="destructive" 
  className="bg-danger hover:bg-danger/90 text-white h-11 px-6 rounded-lg"
>
  {children}
</Button>
```

#### Icon Button
```tsx
<Button 
  size="icon" 
  variant="ghost"
  className="h-10 w-10 rounded-full"
  aria-label="Action description"
>
  <Icon className="h-5 w-5" />
</Button>
```

### Cards

#### Product Card
```tsx
<div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all">
  <div className="aspect-square bg-secondary/50 relative">
    {/* Image */}
  </div>
  <div className="p-4 space-y-3">
    {/* Content */}
  </div>
</div>
```

#### Info Card
```tsx
<div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
  {/* Content */}
</div>
```

### Badges

#### Status Badge
```tsx
// Success
<Badge className="bg-success text-white rounded-full px-3 py-1 text-xs font-medium">
  OEM Authentic
</Badge>

// Warning
<Badge className="bg-warning text-white rounded-full px-3 py-1 text-xs font-medium">
  Low Stock
</Badge>

// Info
<Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
  New
</Badge>
```

### Inputs

#### Text Input
```tsx
<div className="space-y-2">
  <label htmlFor="input-id" className="text-sm font-medium text-foreground">
    Label
  </label>
  <Input
    id="input-id"
    placeholder="Enter value..."
    className="h-11 rounded-lg border-border bg-background"
  />
  <span className="text-xs text-muted-foreground">
    Helper text
  </span>
</div>
```

#### Search Input
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
  <Input
    type="search"
    placeholder="Search..."
    className="h-11 pl-10 rounded-lg"
  />
</div>
```

---

## 🎨 Patterns

### Price Display

```tsx
// Dual pricing (NGN + Crypto)
<div className="space-y-1">
  <div className="text-2xl font-bold text-primary">
    ₦{price.toLocaleString()}
  </div>
  <div className="text-sm text-muted-foreground">
    ≈ {ethPrice} ETH
  </div>
</div>
```

### Stock Status

```tsx
<div className="flex items-center gap-2 text-sm">
  <div className={cn(
    "h-2 w-2 rounded-full",
    inStock ? "bg-success" : "bg-danger"
  )} />
  <span className="text-muted-foreground">
    {inStock ? "In Stock" : "Out of Stock"}
  </span>
</div>
```

### Rating Display

```tsx
<div className="flex items-center gap-2">
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={cn(
          "h-4 w-4",
          i < Math.round(rating) 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-gray-300"
        )} 
      />
    ))}
  </div>
  <span className="text-sm font-medium">{rating}</span>
  <span className="text-xs text-muted-foreground">({reviews})</span>
</div>
```

### Trust Indicators

```tsx
<div className="flex items-center gap-2 text-sm">
  <ShieldCheck className="h-4 w-4 text-success" />
  <span className="font-medium text-foreground">
    Escrow Protected
  </span>
</div>
```

### Verification Badge

```tsx
<div className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
  <ShieldCheck className="h-3.5 w-3.5" />
  <span>Verified Seller</span>
</div>
```

---

## 📱 Responsive Design

### Breakpoints

```typescript
const BREAKPOINTS = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

### Mobile-First Approach

Always design for mobile first, then enhance for larger screens:

```tsx
// ❌ Wrong - Desktop first
<div className="grid-cols-4 md:grid-cols-2 sm:grid-cols-1">

// ✅ Correct - Mobile first
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

### Common Patterns

```tsx
// Container
<div className="container mx-auto px-4 md:px-6 lg:px-8">

// Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

// Typography
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Spacing
<section className="py-12 md:py-16 lg:py-24">

// Hidden on mobile
<div className="hidden md:block">

// Mobile only
<div className="md:hidden">
```

---

## ♿ Accessibility

### Color Contrast

All text must meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States

```css
/* Global focus styles */
.focus-visible:focus {
  @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
}
```

### ARIA Labels

```tsx
// Icon buttons must have labels
<Button size="icon" aria-label="Add to cart">
  <ShoppingCart className="h-5 w-5" />
</Button>

// Form inputs need labels
<label htmlFor="email" className="sr-only">Email</label>
<Input id="email" type="email" />

// Regions need labels
<div role="region" aria-label="Product images">
  {/* Carousel */}
</div>
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Tab order should be logical
- Custom components need `onKeyDown` handlers
- Modals should trap focus
- Skip links for main content

---

## 🎬 Animations

### Principles

1. **Subtle** - Don't distract from content
2. **Fast** - Keep under 300ms
3. **Purposeful** - Guide user attention
4. **Respectful** - Honor `prefers-reduced-motion`

### Transitions

```tsx
// Default transition
<div className="transition-all duration-200 ease-in-out">

// Hover effects
<div className="hover:scale-105 transition-transform">

// Color transitions
<div className="transition-colors duration-300">

// Shadow transitions
<div className="transition-shadow">
```

### Framer Motion Patterns

```tsx
// Fade in
<FadeIn>
  <Component />
</FadeIn>

// Slide up
<SlideUp delay={0.2}>
  <Component />
</SlideUp>

// Stagger children
<StaggerContainer>
  {items.map((item, i) => (
    <StaggerItem key={i}>
      <Component />
    </StaggerItem>
  ))}
</StaggerContainer>
```

### Respect User Preferences

```tsx
// Check for reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
```

---

## 📋 Form Patterns

### Standard Form Layout

```tsx
<form className="space-y-6">
  {/* Text Input */}
  <div className="space-y-2">
    <label htmlFor="name" className="text-sm font-medium">
      Full Name
    </label>
    <Input id="name" placeholder="John Doe" />
  </div>

  {/* Select */}
  <div className="space-y-2">
    <label htmlFor="country" className="text-sm font-medium">
      Country
    </label>
    <Select>
      <SelectTrigger id="country">
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ng">Nigeria</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Checkbox */}
  <div className="flex items-center gap-2">
    <Checkbox id="terms" />
    <label htmlFor="terms" className="text-sm">
      I agree to the terms and conditions
    </label>
  </div>

  {/* Submit */}
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### Validation States

```tsx
// Error state
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    className="border-danger"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <span id="email-error" className="text-sm text-danger" role="alert">
    Please enter a valid email address
  </span>
</div>

// Success state
<div className="space-y-2">
  <label htmlFor="email" className="text-sm font-medium">
    Email
  </label>
  <Input
    id="email"
    type="email"
    className="border-success"
  />
  <span className="text-sm text-success flex items-center gap-1">
    <Check className="h-3 w-3" />
    Email is valid
  </span>
</div>
```

---

## 🖼️ Image Guidelines

### Aspect Ratios

| Use Case | Ratio | Class |
|----------|-------|-------|
| Product Images | 1:1 | `aspect-square` |
| Hero Images | 16:9 | `aspect-video` |
| Thumbnails | 4:3 | `aspect-[4/3]` |
| Banners | 21:9 | `aspect-[21/9]` |

### Optimization

```tsx
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product name"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
  priority={isAboveFold}
  loading={isAboveFold ? "eager" : "lazy"}
  quality={85}
/>
```

### Placeholder Strategy

```tsx
// Use blur placeholders
<Image
  src={product.image}
  alt={product.name}
  fill
  placeholder="blur"
  blurDataURL={product.blurDataURL}
/>

// Or skeleton loader
{isLoading ? (
  <Skeleton className="aspect-square" />
) : (
  <Image src={image} alt={alt} fill />
)}
```

---

## 📚 Icon System

### Icon Library

Use Lucide React for all icons: https://lucide.dev/

### Icon Sizes

| Size | Class | Pixels | Use Case |
|------|-------|--------|----------|
| XS | `h-3 w-3` | 12px | Inline text icons |
| SM | `h-4 w-4` | 16px | Badges, small buttons |
| MD | `h-5 w-5` | 20px | Default buttons, nav |
| LG | `h-6 w-6` | 24px | Headers, prominent actions |
| XL | `h-8 w-8` | 32px | Hero sections, features |

### Icon Usage

```tsx
import { ShoppingCart, Search, Heart } from 'lucide-react';

// In button
<Button>
  <ShoppingCart className="h-5 w-5 mr-2" />
  Add to Cart
</Button>

// Icon only button
<Button size="icon" aria-label="Search">
  <Search className="h-5 w-5" />
</Button>

// In text
<span className="flex items-center gap-2 text-sm">
  <Heart className="h-4 w-4 text-danger" />
  Wishlist
</span>
```

---

## 🎯 UI Checklist

Before shipping any component, verify:

### Visual
- [ ] Colors match design tokens
- [ ] Spacing is consistent with scale
- [ ] Border radius matches component type
- [ ] Shadows are appropriate
- [ ] Typography uses semantic scale
- [ ] Dark mode looks good
- [ ] Responsive on all breakpoints

### Interaction
- [ ] Hover states are clear
- [ ] Focus states are visible
- [ ] Loading states are handled
- [ ] Error states are handled
- [ ] Disabled states are clear
- [ ] Animations are smooth

### Accessibility
- [ ] Color contrast is sufficient
- [ ] All interactive elements are keyboard accessible
- [ ] ARIA labels on icon buttons
- [ ] Form inputs have labels
- [ ] Error messages are announced
- [ ] Focus trap in modals

### Performance
- [ ] Images are optimized
- [ ] Lazy loading for below fold
- [ ] Skeleton loaders in place
- [ ] No layout shift
- [ ] Animations respect reduced motion

---

## 🔧 Developer Tools

### VS Code Extensions
- Tailwind CSS IntelliSense
- Headwind (class sorting)
- ESLint
- Prettier

### Figma Plugins
- Tailwind CSS
- A11y - Color Contrast Checker
- Font Awesome Icons

### Testing Tools
- Chrome DevTools Lighthouse
- axe DevTools (accessibility)
- React DevTools
- Next.js DevTools

---

## 📖 Resources

### Official Documentation
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)

### Design Inspiration
- [Dribbble - E-commerce](https://dribbble.com/tags/ecommerce)
- [Mobbin](https://mobbin.com/) - Mobile patterns
- [RockAuto](https://www.rockauto.com/) - Functional design

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

---

**Maintained by:** SwenAutos Design Team  
**Questions?** Refer to UX_UI_ANALYSIS.md for implementation details
