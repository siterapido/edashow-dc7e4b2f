"use client";

import { useEffect } from "react";
import { useShare } from "@/context/share-context";

interface MobileQuickShareProps {
    url: string;
    title: string;
    description?: string;
}

export function MobileQuickShare({ url, title, description }: MobileQuickShareProps) {
    const { setShareData } = useShare();

    useEffect(() => {
        // Set share data when component mounts
        setShareData({ url, title, description });

        // Clear share data when component unmounts
        return () => {
            setShareData(null);
        };
    }, [url, title, description, setShareData]);

    // This component no longer renders anything visible itself
    return null;
}
