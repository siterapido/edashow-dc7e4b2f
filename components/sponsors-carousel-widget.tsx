"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface Sponsor {
    id: string | number
    name: string
    logo?: any
    logo_path?: string
    website?: string
}

interface SponsorsCarouselWidgetProps {
    sponsors?: Sponsor[]
}

export function SponsorsCarouselWidget({ sponsors = [] }: SponsorsCarouselWidgetProps) {
    // Se não houver patrocinadores, não renderiza nada
    if (!sponsors || sponsors.length === 0) return null

    // Duplicar a lista para criar o efeito infinito
    const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]

    return (
        <div className="overflow-hidden relative">
            {/* Gradiente nas bordas */}
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Carrossel Horizontal */}
            <div className="relative flex overflow-x-hidden py-4">
                <motion.div
                    className="flex whitespace-nowrap items-center gap-8"
                    animate={{
                        x: ["0%", "-33.333%"],
                    }}
                    transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicatedSponsors.map((sponsor, index) => {
                        const imageUrl = sponsor.logo_path || sponsor.logo?.url || '/placeholder.jpg'

                        return (
                            <div
                                key={`${sponsor.id}-${index}`}
                                className="flex-shrink-0 flex items-center justify-center transition-all duration-500 opacity-80 hover:opacity-100 transform hover:scale-105"
                                style={{ minWidth: "120px" }}
                            >
                                <div className="relative h-12 w-28">
                                    <Image
                                        src={imageUrl}
                                        alt={sponsor.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 120px"
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}
