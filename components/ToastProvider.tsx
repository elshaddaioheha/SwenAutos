"use client"

import React, { createContext, useContext, useState, useCallback } from "react";

type Toast = { id: string; message: string; type?: "info" | "success" | "error" };

const ToastContext = createContext<{ push: (t: Omit<Toast, "id">) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = String(Date.now()) + Math.random().toString(36).slice(2, 9);
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 6000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{ position: "fixed", right: 20, top: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ marginBottom: 8, padding: "10px 14px", borderRadius: 8, background: t.type === "error" ? "#fee2e2" : t.type === "success" ? "#ecfccb" : "#eef2ff", color: "#111827", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", minWidth: 240 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.type?.toUpperCase() || "INFO"}</div>
            <div style={{ fontSize: 14 }}>{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
