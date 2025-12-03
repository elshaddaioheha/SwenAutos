"use client"

import React, { useState, useEffect } from "react"

export default function DeliveryOptions({ onChange }: { onChange?: (opts: any) => void }) {
    const [method, setMethod] = useState<"pickup" | "delivery">("pickup")
    const [fee, setFee] = useState<number>(0)

    useEffect(() => {
        setFee(method === "delivery" ? 9.99 : 0)
        onChange?.({ method, fee: method === "delivery" ? 9.99 : 0 })
    }, [method])

    return (
        <div className="p-4 border rounded bg-white max-w-lg">
            <h3 className="font-semibold mb-2">Delivery options</h3>
            <div className="space-y-2">
                <label className="flex items-center gap-2">
                    <input checked={method === "pickup"} onChange={() => setMethod("pickup")} type="radio" />
                    <div>
                        <div className="font-medium">Pick up from store</div>
                        <div className="text-sm text-muted-foreground">Free — pick up at the seller's location or designated store</div>
                    </div>
                </label>

                <label className="flex items-center gap-2">
                    <input checked={method === "delivery"} onChange={() => setMethod("delivery")} type="radio" />
                    <div>
                        <div className="font-medium">Home delivery</div>
                        <div className="text-sm text-muted-foreground">Delivery to buyer's address — fee applies: ${fee}</div>
                    </div>
                </label>
            </div>
        </div>
    )
}
