"use client"

import React, { useState, useEffect } from "react"
import ProgressStepper from "../ui/ProgressStepper"

export default function DeliveryTracker({ status = 0 }: { status?: number }) {
    const steps = ["Payment", "Processing", "Out for delivery", "Delivered"]
    const [current, setCurrent] = useState(status)

    useEffect(() => {
        setCurrent(status)
    }, [status])

    return (
        <div className="p-4 border rounded bg-white max-w-2xl">
            <h3 className="font-semibold mb-2">Delivery progress</h3>
            <ProgressStepper steps={steps} current={current} />
            <div className="text-sm text-muted-foreground mt-3">Status: {steps[current] || "Unknown"}</div>
        </div>
    )
}
