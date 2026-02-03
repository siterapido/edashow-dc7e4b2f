"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LogoProps = {
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "light" | "dark" | "white";
  children?: React.ReactNode;
};

/**
 * Componente Logo - Carrega o logo do CMS dinamicamente
 */
export function Logo({
  containerClassName,
  imageClassName,
  priority = false,
  variant = "light",
  children,
}: LogoProps) {
  const router = useRouter();
  const [logoSrc, setLogoSrc] = useState<string>("");
  const [logoAlt, setLogoAlt] = useState<string>("EDA Show");

  useEffect(() => {
    async function loadLogo() {
      try {
        const response = await fetch('/api/globals/site-settings')
        if (response.ok) {
          const settings = await response.json()
          if (settings.logo_url) {
            setLogoSrc(settings.logo_url)
            if (settings.site_name) setLogoAlt(settings.site_name)
          } else {
            setDefaultLogo()
          }
        } else {
          setDefaultLogo()
        }
      } catch (error) {
        console.error('Error loading dynamic logo:', error)
        setDefaultLogo()
      }
    }

    loadLogo()
  }, [variant])

  const setDefaultLogo = () => {
    // Logo padrão - usa logo branco para variante white, senão placeholder
    if (variant === "white") {
      setLogoSrc("/logo-white.svg")
    } else {
      setLogoSrc("/placeholder-logo.svg")
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/")
  }

  if (!logoSrc) {
    return (
      <div className={cn("inline-flex items-center", containerClassName)}>
        <div className={cn(
          "h-10 w-40 bg-gray-200 animate-pulse rounded md:h-12",
          imageClassName
        )} />
      </div>
    )
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label={`Ir para a página inicial do ${logoAlt}`}
      className={cn("inline-flex items-center", containerClassName)}
    >
      <Image
        src={logoSrc}
        alt={logoAlt}
        width={160}
        height={123}
        priority={priority}
        sizes="(max-width: 768px) 140px, 180px"
        className={cn(
          "h-10 w-auto object-contain drop-shadow-lg md:h-12",
          imageClassName,
          // Aplica filtro apenas se for logo externo em variante white (logo-white.svg já é branco)
          variant === "white" && logoSrc.startsWith('http') && "brightness-0 invert"
        )}
      />
      {children}
    </Link>
  )
}
