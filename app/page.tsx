import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";
import { Search, ArrowRight, ShieldCheck, Truck, Zap, Wrench, Disc, Activity, Car, Armchair, Battery, Lock } from "lucide-react";

// Mock Data
const CATEGORIES = [
  { name: "Engine", icon: Wrench },
  { name: "Brakes", icon: Disc },
  { name: "Suspension", icon: Activity },
  { name: "Electrical", icon: Battery },
  { name: "Body", icon: Car },
  { name: "Interior", icon: Armchair },
];

const FEATURED_PRODUCTS = [
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
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="p-4 md:p-6 lg:p-8">
        <section className="relative bg-[#F3F4F6] rounded-3xl py-16 md:py-24 overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#111827] leading-tight">
                    Buy & Sell Auto Parts with Trust
                  </h1>
                  <p className="text-lg md:text-xl text-gray-500 max-w-xl">
                    Connect with verified sellers. Pay with Naira or Crypto. Get genuine OEM and aftermarket parts delivered safely.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-12 rounded-lg shadow-blue-200 shadow-lg">
                    <Search className="mr-2 h-5 w-5" />
                    Find Parts Now
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 font-semibold px-8 h-12 rounded-lg">
                    <Truck className="mr-2 h-5 w-5" />
                    Sell Your Parts
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <span>1000+ Verified Sellers</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <ShieldCheck className="h-5 w-5 text-blue-500" />
                    <span>Escrow Protected</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Truck className="h-5 w-5 text-yellow-500" />
                    <span>Fast Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Content (Placeholder Card) */}
              <div className="relative hidden lg:block">
                <div className="bg-gray-200/50 rounded-3xl aspect-[4/3] flex items-center justify-center border border-white/50 shadow-xl backdrop-blur-sm">
                  <Car className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* How SwenAutos Works */}
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827]">How SwenAutos Works</h2>
          </div>

          <div className="rounded-xl p-8 md:p-12 bg-white mx-auto max-w-6xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center space-y-4">
                <Search className="h-14 w-14 text-primary" strokeWidth={2.5} />
                <h3 className="text-xl font-bold text-[#111827]">Search & Find</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Browse thousands of genuine spare parts from verified sellers across Nigeria
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center space-y-4">
                <Lock className="h-14 w-14 text-primary fill-primary" />
                <h3 className="text-xl font-bold text-[#111827]">Secure Payment</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Pay safely with Naira or Crypto. Your money is held in escrow until delivery
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center space-y-4">
                <Truck className="h-14 w-14 text-primary fill-primary" />
                <h3 className="text-xl font-bold text-[#111827]">Get Delivered</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                  Receive parts at your doorstep or pickup from verified sellers near you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Spare Parts */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827]">Popular Spare Parts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="bg-[#E5E7EB] h-48 flex items-center justify-center">
                <Wrench className="h-12 w-12 text-primary" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">Engine Oil Filter</h3>
                  <p className="text-primary font-bold mt-1">₦12,500</p>
                  <p className="text-xs text-gray-400">≈ 0.008 ETH</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9 text-sm">
                  View Details
                </Button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="bg-[#E5E7EB] h-48 flex items-center justify-center">
                <Disc className="h-12 w-12 text-primary" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">Brake Pads Set</h3>
                  <p className="text-primary font-bold mt-1">₦28,000</p>
                  <p className="text-xs text-gray-400">≈ 0.018 ETH</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9 text-sm">
                  View Details
                </Button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="bg-[#E5E7EB] h-48 flex items-center justify-center">
                <Battery className="h-12 w-12 text-primary" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">Car Battery 12V</h3>
                  <p className="text-primary font-bold mt-1">₦45,000</p>
                  <p className="text-xs text-gray-400">≈ 0.029 ETH</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9 text-sm">
                  View Details
                </Button>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 group hover:shadow-md transition-shadow">
              <div className="bg-[#E5E7EB] h-48 flex items-center justify-center">
                <Car className="h-12 w-12 text-primary" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">Headlight Assembly</h3>
                  <p className="text-primary font-bold mt-1">₦35,000</p>
                  <p className="text-xs text-gray-400">≈ 0.022 ETH</p>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium h-9 text-sm">
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Sell CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Sell Your Parts?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join 1000+ verified vendors earning on SwenAutos
          </p>
          <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary font-semibold px-8 h-12">
            <Truck className="mr-2 h-5 w-5" />
            Start Selling Today
          </Button>
        </div>
      </section>
    </div>
  );
}
