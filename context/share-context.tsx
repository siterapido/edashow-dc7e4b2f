"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShareData {
    url: string;
    title: string;
    description?: string;
}

interface ShareContextType {
    shareData: ShareData | null;
    setShareData: (data: ShareData | null) => void;
}

const ShareContext = createContext<ShareContextType | undefined>(undefined);

export function ShareProvider({ children }: { children: ReactNode }) {
    const [shareData, setShareData] = useState<ShareData | null>(null);

    return (
        <ShareContext.Provider value={{ shareData, setShareData }}>
            {children}
        </ShareContext.Provider>
    );
}

export function useShare() {
    const context = useContext(ShareContext);
    if (context === undefined) {
        throw new Error("useShare must be used within a ShareProvider");
    }
    return context;
}
