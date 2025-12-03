"use client"

import React from "react"

export default function ProgressStepper({ steps = [], current = 0 }: { steps?: string[]; current?: number }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-4">
                {steps.map((s, i) => {
                    const active = i <= current
                    return (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}>{i + 1}</div>
                            <div className={`text-sm ${active ? "text-primary" : "text-muted-foreground"}`}>{s}</div>
                        </div>
                    )
                })}
            </div>
            <div className="h-2 bg-gray-100 rounded overflow-hidden mt-2">
                <div className="h-2 bg-primary" style={{ width: `${((current + 1) / Math.max(steps.length, 1)) * 100}%` }} />
            </div>
        </div>
    )
}
