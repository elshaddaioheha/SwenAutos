"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"

export default function SellerListingForm({ onCreate }: { onCreate?: (data: any) => void }) {
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState<number | "">("")
    const [inventory, setInventory] = useState<number | "">("")

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const listing = { title, price: Number(price || 0), inventory: Number(inventory || 0), id: Date.now() }
        // For now simply call callback; integration with backend/contract later
        onCreate?.(listing)
        setTitle("")
        setPrice("")
        setInventory("")
    }

    return (
        <form onSubmit={submit} className="space-y-4 max-w-xl">
            <div>
                <label className="block text-sm font-medium">Part title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
            </div>
            <div>
                <label className="block text-sm font-medium">Price (USD)</label>
                <input value={price} onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} type="number" className="mt-1 block w-full rounded border px-3 py-2" />
            </div>
            <div>
                <label className="block text-sm font-medium">Inventory</label>
                <input value={inventory} onChange={(e) => setInventory(e.target.value === "" ? "" : Number(e.target.value))} type="number" className="mt-1 block w-full rounded border px-3 py-2" />
            </div>
            <div className="flex items-center gap-2">
                <Button type="submit">Create Listing</Button>
            </div>
        </form>
    )
}
