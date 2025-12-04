"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search, ShoppingCart, Heart, Star, Check, Car, MapPin,
    Grid, List, ChevronDown, Filter, ChevronRight, SlidersHorizontal
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ShopPage() {
    return (
        <div className="min-h-screen bg-[#F8F8F5]">

            {/* Breadcrumb */}
            <div className="container px-4 md:px-6 py-4">
                <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <Link href="/" className="text-[#1D4ED8] hover:underline">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/shop" className="text-[#1D4ED8] hover:underline">Engine Parts</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-gray-500">Oil Filters</span>
                </div>
            </div>

            <div className="container px-4 md:px-6 pb-20">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 flex-shrink-0 space-y-8 hidden md:block">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#111827]">Filters</h2>
                            <button className="text-sm font-bold text-[#1D4ED8] hover:underline">Clear All</button>
                        </div>

                        {/* Category Filter */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Category</h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]" defaultChecked />
                                    <span className="text-sm text-[#111827]">OEM</span>
                                    <span className="text-xs text-gray-500 ml-auto">(342)</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Aftermarket</span>
                                    <span className="text-xs text-gray-500 ml-auto">(786)</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#1D4ED8] focus:ring-[#1D4ED8]" />
                                    <span className="text-sm text-[#111827]">Refurbished</span>
                                    <span className="text-xs text-gray-500 ml-auto">(120)</span>
                                </label>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Price Range (₦)</h3>
                            <div className="flex items-center space-x-2">
                                <div className="relative flex-1">
                                    <Input type="number" placeholder="Min" defaultValue="5000" className="bg-white border-gray-200" />
                                </div>
                                <span className="text-gray-500">-</span>
                                <div className="relative flex-1">
                                    <Input type="number" placeholder="Max" defaultValue="50000" className="bg-white border-gray-200" />
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Compatibility */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Vehicle Compatibility</h3>
                            <div className="space-y-2">
                                <Input placeholder="Year" className="bg-white border-gray-200" />
                                <Input placeholder="Make" className="bg-white border-gray-200" />
                                <Input placeholder="Model" className="bg-white border-gray-200" />
                                <Button className="w-full bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-10">
                                    Apply
                                </Button>
                            </div>
                        </div>

                        {/* Condition */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Condition</h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="condition" className="text-[#1D4ED8] focus:ring-[#1D4ED8]" />
                                    <span className="text-sm text-[#111827]">New</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="condition" className="text-[#1D4ED8] focus:ring-[#1D4ED8]" defaultChecked />
                                    <span className="text-sm text-[#111827]">Used</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="condition" className="text-[#1D4ED8] focus:ring-[#1D4ED8]" />
                                    <span className="text-sm text-[#111827]">Any</span>
                                </label>
                            </div>
                        </div>

                        {/* Seller Rating */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Seller Rating</h3>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="rating" className="text-[#1D4ED8] focus:ring-[#1D4ED8]" defaultChecked />
                                    <div className="flex items-center text-[#F59E0B]">
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 text-gray-300" />
                                    </div>
                                    <span className="text-sm text-[#111827]">& above</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="rating" className="text-[#1D4ED8] focus:ring-[#1D4ED8]" />
                                    <div className="flex items-center text-[#F59E0B]">
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 fill-current" />
                                        <Star className="h-4 w-4 text-gray-300" />
                                        <Star className="h-4 w-4 text-gray-300" />
                                    </div>
                                    <span className="text-sm text-[#111827]">& above</span>
                                </label>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-[#111827]">Location</h3>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="Enter location" className="pl-9 bg-white border-gray-200" />
                            </div>
                        </div>

                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">

                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-[#111827]">Engine Oil Filters</h1>
                            <p className="text-gray-500 mt-1">1,248 parts available</p>
                        </div>

                        {/* Sort & View Controls */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center space-x-4 w-full sm:w-auto">
                                <Button variant="outline" className="md:hidden w-full flex items-center justify-center gap-2">
                                    <Filter className="h-4 w-4" /> Filters
                                </Button>
                                <div className="hidden sm:flex items-center space-x-2">
                                    <span className="text-sm font-bold text-[#111827]">Sort by:</span>
                                    <select className="text-sm border-none bg-transparent font-medium focus:ring-0 cursor-pointer">
                                        <option>Best Match</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                        <option>Newest Arrivals</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                <span className="text-sm text-gray-500 hidden sm:inline">Showing 1-24 of 1,248 results</span>
                                <div className="flex items-center space-x-2">
                                    <Button size="icon" variant="ghost" className="bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/90 h-9 w-9 rounded-lg">
                                        <Grid className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-gray-500 hover:bg-gray-100 h-9 w-9 rounded-lg">
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Product Card 1 */}
                            <Link href="/product/1" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">OEM</span>
                                            <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-2 py-1 rounded">VERIFIED</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        {/* Placeholder Image */}
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                Premium Engine Oil Filter - Toyota Camry 2018-2023
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: 90915-YZZF2</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-[#10B981]" />
                                            <span>Fits: Toyota Camry 2018-2023</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    CA
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Chukwu Auto Parts</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">4.8</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦12,500</div>
                                                <div className="text-xs text-gray-500">≈ 7.81 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Card 2 */}
                            <Link href="/product/2" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">OEM</span>
                                            <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-2 py-1 rounded">VERIFIED</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                Honda Accord Oil Filter OEM Quality
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: 15400-PLM-A02</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-[#10B981]" />
                                            <span>Fits: Honda Accord 2016-2021</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    NM
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Nneka Motors</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">4.9</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦14,200</div>
                                                <div className="text-xs text-gray-500">≈ 8.87 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Card 3 */}
                            <Link href="/product/3" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-1 rounded">AFTERMARKET</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                Universal Oil Filter for Most Cars
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: UNI-OF-001</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-gray-500" />
                                            <span>Compatible with multiple models</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    OP
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Obi Parts Ltd</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">4.5</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦8,500</div>
                                                <div className="text-xs text-gray-500">≈ 5.31 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Card 4 */}
                            <Link href="/product/4" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">OEM</span>
                                            <span className="bg-[#1D4ED8] text-white text-[10px] font-bold px-2 py-1 rounded">VERIFIED</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                Mercedes-Benz C-Class Oil Filter Original
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: 271-180-01-09</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-[#10B981]" />
                                            <span>Fits: Mercedes C-Class 2015-2020</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    EG
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Elite German Parts</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">5.0</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦28,900</div>
                                                <div className="text-xs text-gray-500">≈ 18.06 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Card 5 */}
                            <Link href="/product/5" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#10B981] text-white text-[10px] font-bold px-2 py-1 rounded">OEM</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                Lexus RX350 Engine Oil Filter
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: 04152-YZZA6</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-[#10B981]" />
                                            <span>Fits: Lexus RX350 2016-2022</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    IP
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Ikenna Premium Parts</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">4.7</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦16,500</div>
                                                <div className="text-xs text-gray-500">≈ 10.31 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Card 6 */}
                            <Link href="/product/6" className="block">
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group h-full">
                                    <div className="relative h-48 bg-gray-100 p-4 flex items-center justify-center">
                                        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                                            <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-1 rounded">AFTERMARKET</span>
                                        </div>
                                        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-20" onClick={(e) => e.preventDefault()}>
                                            <Heart className="h-4 w-4" />
                                        </button>
                                        <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                                            <Image src="/placeholder-part.png" width={128} height={128} alt="Part" className="object-contain" />
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-[#111827] leading-tight group-hover:text-[#1D4ED8] transition-colors">
                                                High Performance Oil Filter - Universal
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Part #: HP-OF-500</p>
                                        </div>

                                        <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                                            <Car className="h-3 w-3 text-gray-500" />
                                            <span>Fits most 4-cylinder engines</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                            <div className="flex items-center space-x-2">
                                                <div className="h-6 w-6 rounded-full bg-[#1D4ED8] flex items-center justify-center text-white text-[10px] font-bold">
                                                    AA
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-medium text-[#111827]">Adaeze Auto Store</span>
                                                    <div className="flex items-center text-[#F59E0B] text-[10px]">
                                                        <Star className="h-3 w-3 fill-current" />
                                                        <span className="ml-0.5">4.6</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-1">
                                            <div>
                                                <div className="text-lg font-bold text-[#111827]">₦9,800</div>
                                                <div className="text-xs text-gray-500">≈ 6.12 CAMP</div>
                                            </div>
                                            <Button size="sm" className="bg-[#1D4ED8] hover:bg-[#1D4ED8]/90 text-white font-bold h-9 px-4" onClick={(e) => e.preventDefault()}>
                                                <ShoppingCart className="h-3 w-3 mr-2" />
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                        </div>

                        {/* Pagination */}
                        <div className="mt-12 flex justify-center">
                            <nav className="flex items-center space-x-2">
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-gray-400" disabled>
                                    <span className="sr-only">Previous</span>
                                    <ChevronRight className="h-4 w-4 rotate-180" />
                                </Button>
                                <Button variant="default" size="icon" className="h-10 w-10 rounded-lg bg-[#1D4ED8] text-white hover:bg-[#1D4ED8]/90">
                                    1
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-[#111827] hover:bg-gray-50">
                                    2
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-[#111827] hover:bg-gray-50">
                                    3
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-[#111827] hover:bg-gray-50">
                                    4
                                </Button>
                                <span className="text-gray-500 px-2">...</span>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-[#111827] hover:bg-gray-50">
                                    52
                                </Button>
                                <Button variant="outline" size="icon" className="h-10 w-10 rounded-lg border-gray-200 text-[#111827] hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </nav>
                        </div>

                    </main>
                </div>
            </div>

        </div>
    );
}
