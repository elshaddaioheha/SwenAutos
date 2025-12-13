"use client";

import dynamic from "next/dynamic";
import React from "react";

const Web3Provider = dynamic(
    () => import("./Web3Provider").then((mod) => mod.Web3Provider),
    { ssr: false }
);

export function Web3Wrapper({ children }: { children: React.ReactNode }) {
    return <Web3Provider>{children}</Web3Provider>;
}
