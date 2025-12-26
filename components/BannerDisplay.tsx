'use client'

import React, { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import type { Banner, BannerLocation } from '@/lib/types/banner'
import { getActiveBannersByLocation } from '@/lib/actions/cms-banners'

interface BannerDisplayProps {
    location: BannerLocation
    className?: string
    rotationInterval?: number // in milliseconds, default 5000
}

export default function BannerDisplay({ location, className = '', rotationInterval = 5000 }: BannerDisplayProps) {
    const [banners, setBanners] = useState<Banner[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [fadeIn, setFadeIn] = useState(true)

    useEffect(() => {
        async function loadBanners() {
            const { data } = await getActiveBannersByLocation(location)
            if (data && data.length > 0) {
                setBanners(data)
            }
            setLoading(false)
        }
        loadBanners()
    }, [location])

    useEffect(() => {
        if (banners.length <= 1) return // No rotation needed for 0 or 1 banner

        const interval = setInterval(() => {
            setFadeIn(false)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % banners.length)
                setFadeIn(true)
            }, 300) // Half of transition duration
        }, rotationInterval)

        return () => clearInterval(interval)
    }, [banners.length, rotationInterval])

    // Don't render anything if loading or no banners
    if (loading || banners.length === 0) {
        return null
    }

    const currentBanner = banners[currentIndex]

    return (
        <div className={`banner-zone ${className}`}>
            <a
                href={currentBanner.link_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="block group relative overflow-hidden rounded-lg transition-transform hover:scale-[1.02]"
                onClick={() => {
                    // Track click analytics here if needed
                    console.log('Banner clicked:', currentBanner.title)
                }}
            >
                <img
                    src={currentBanner.image_path}
                    alt={currentBanner.title}
                    className={`w-full h-auto transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                    <ExternalLink className="w-5 h-5 text-white" />
                </div>

                {/* Multiple banners indicator */}
                {banners.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                        {banners.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? 'w-6 bg-orange-500'
                                        : 'w-1.5 bg-white/50'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </a>

            {/* Ad label for transparency */}
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 text-center">
                Publicidade
            </p>
        </div>
    )
}
