import React from 'react'

interface BannerZoneProps {
    children: React.ReactNode
    className?: string
}

/**
 * Wrapper component for banner display zones
 * Provides consistent styling and layout for ad spaces
 */
export default function BannerZone({ children, className = '' }: BannerZoneProps) {
    return (
        <div className={`banner-zone-wrapper ${className}`}>
            {children}
        </div>
    )
}
