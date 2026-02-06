"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type LogoProps = {
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "light" | "dark" | "white";
};

/**
 * Componente Logo - Usa o logo oficial do EDA Show
 */
export function Logo({
  containerClassName,
  imageClassName,
  priority = false,
}: LogoProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push("/")
  }

  return (
    <Link
      href="/"
      onClick={handleClick}
      aria-label="Ir para a página inicial do EDA Show"
      className={cn("inline-flex items-center", containerClassName)}
    >
      <Image
        src="/eda-show-logo.png"
        alt="EDA Show"
        width={187}
        height={144}
        priority={priority}
        sizes="(max-width: 768px) 140px, 180px"
        className={cn(
          "h-10 w-auto object-contain drop-shadow-lg md:h-12",
          imageClassName
        )}
      />
    </Link>
  )
}
