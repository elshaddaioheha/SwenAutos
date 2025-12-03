"use client"

import React from "react"

export default function PrintableRecord({ record }: { record: any }) {
    return (
        <div className="p-3 border rounded bg-white">
            <div className="text-sm text-muted-foreground">Printable dispute record</div>
            <pre className="text-xs mt-2">{JSON.stringify(record, null, 2)}</pre>
            <div className="mt-2">
                <button onClick={() => window.print()} className="px-3 py-2 rounded bg-primary text-white">Print</button>
            </div>
        </div>
    )
}
