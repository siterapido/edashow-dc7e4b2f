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
            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10 pointer-events-none" />

            {/* Carrossel Vertical */}
            <div className="relative flex flex-col overflow-y-hidden py-2 h-[300px]">
                <motion.div
                    className="flex flex-col items-center gap-6"
                    animate={{
                        y: ["0%", "-33.333%"],
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
                                className="flex items-center justify-center transition-all duration-500 opacity-80 hover:opacity-100 transform hover:scale-105"
                                style={{ minHeight: "60px", width: "100%" }}
                            >
                                <div className="relative h-14 w-32">
                                    <Image
                                        src={imageUrl}
                                        alt={sponsor.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 200px"
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
