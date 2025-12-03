"use client"

import React, { useState } from "react"
import PrintableRecord from "./PrintableRecord"

export default function DisputeModule({ orderId }: { orderId: number }) {
    const [open, setOpen] = useState(false)
    const [reason, setReason] = useState("")
    const [status, setStatus] = useState<"open" | "in_review" | "resolved">("open")
    const [record, setRecord] = useState<any | null>(null)

    function submit() {
        const r = { id: Date.now(), orderId, reason, status: "in_review", createdAt: new Date().toISOString() }
        setRecord(r)
        setStatus("in_review")
        setOpen(false)
    }

    return (
        <div className="p-4 border rounded bg-white max-w-xl">
            <h3 className="font-semibold mb-2">Dispute</h3>
            {!record && (
                <div>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Describe the issue" className="w-full rounded border px-3 py-2" />
                    <div className="flex gap-2 mt-2">
                        <button onClick={submit} className="px-3 py-2 rounded bg-destructive text-white">Open dispute</button>
                        <button onClick={() => setOpen(!open)} className="px-3 py-2 rounded border">Preview printable</button>
                    </div>
                    {open && <PrintableRecord record={{ orderId, reason }} />}
                </div>
            )}

            {record && (
                <div>
                    <div className="text-sm">Dispute created — status: {status}</div>
                    <div className="mt-2">
                        <PrintableRecord record={record} />
                    </div>
                </div>
            )}
        </div>
    )
}
