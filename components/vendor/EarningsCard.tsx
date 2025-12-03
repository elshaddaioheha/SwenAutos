"use client"

import React from "react"

export default function EarningsCard({ earnings }: { earnings: number }) {
    return (
        <div className="p-3 border rounded bg-white text-right">
            <div className="text-sm text-muted-foreground">Earnings</div>
            <div className="text-xl font-bold">${Number(earnings).toFixed(2)}</div>
        </div>
    )
}
