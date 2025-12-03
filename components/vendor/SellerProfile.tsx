"use client"

import React from "react"
import EarningsCard from "./EarningsCard"
import ChatBox from "../chat/ChatBox"

export default function SellerProfile({ seller }: { seller: any }) {
    const mockListings = seller?.listings || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{seller?.name || "Seller"}</h1>
                    <p className="text-sm text-muted-foreground">Joined: {seller?.joined || "—"}</p>
                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-50 text-sm">
                        <span className="font-semibold">Accepts CAMP</span>
                        <span className="text-xs text-muted-foreground">Pay with CAMP for lower fees & rewards</span>
                    </div>
                </div>
                <EarningsCard earnings={seller?.earnings || 0} />
            </div>

            <section>
                <h2 className="font-semibold mb-2">Listings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockListings.length === 0 && <div className="text-sm text-muted-foreground">No listings yet.</div>}
                    {mockListings.map((l: any) => (
                        <div key={l.id} className="p-3 border rounded bg-white">
                            <div className="font-medium">{l.title}</div>
                            <div className="text-sm text-muted-foreground">${l.price} — {l.inventory} in stock</div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="font-semibold mb-2">Contact seller</h2>
                <ChatBox channelId={`seller-${seller?.id || "anon"}`} />
            </section>
        </div>
    )
}
