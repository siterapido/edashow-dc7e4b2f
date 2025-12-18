import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  containerClassName?: string;
  imageClassName?: string;
  priority?: boolean;
  variant?: "light" | "dark";
};

export function Logo({
  containerClassName,
  imageClassName,
  priority = false,
  variant = "light",
}: LogoProps) {
  const logoSrc = variant === "dark" ? "/logo-dark.png" : "/eda-show-logo.png";
  
  return (
    <Link
      href="/"
      aria-label="Ir para a página inicial do EDA Show"
      className={cn("inline-flex items-center", containerClassName)}
    >
      <Image
        src={logoSrc}
        alt="EDA Show"
        width={160}
        height={123}
        priority={priority}
        sizes="(max-width: 768px) 140px, 180px"
        className={cn(
          "h-10 w-auto object-contain drop-shadow-lg md:h-12",
          imageClassName
        )}
      />
    </Link>
  );
}




