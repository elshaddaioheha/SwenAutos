"use client"

import React, { useState } from "react"

export default function ChatBox({ channelId }: { channelId: string }) {
    const [messages, setMessages] = useState<Array<{ id: number; text: string; from: string }>>([])
    const [text, setText] = useState("")

    function send() {
        if (!text) return
        const msg = { id: Date.now(), text, from: "you" }
        setMessages((s) => [...s, msg])
        setText("")
    }

    return (
        <div className="border rounded p-3 bg-white max-w-md">
            <div className="h-48 overflow-auto mb-2 space-y-2">
                {messages.length === 0 && <div className="text-sm text-muted-foreground">No messages yet. Use this to chat with seller.</div>}
                {messages.map((m) => (
                    <div key={m.id} className={`rounded px-2 py-1 ${m.from === "you" ? "bg-primary text-white ml-auto w-max" : "bg-gray-100"}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded border px-3 py-2" />
                <button onClick={send} className="px-3 py-2 rounded bg-primary text-white">Send</button>
            </div>
        </div>
    )
}
