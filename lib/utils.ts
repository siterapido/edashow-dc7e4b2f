import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Resolve uma URL de imagem para uso em meta tags Open Graph
 * Garante que a URL seja absoluta para funcionar corretamente no WhatsApp e outras redes
 * @param imageUrl - URL da imagem (pode ser relativa ou absoluta)
 * @param siteUrl - URL base do site (ex: https://edashow.com.br)
 * @returns URL absoluta da imagem
 */
export function getAbsoluteImageUrl(imageUrl: string | null | undefined, siteUrl: string): string {
  const fallbackImage = '/placeholder-logo.png'

  // Se não há imagem, usa o fallback
  if (!imageUrl) {
    return `${siteUrl}${fallbackImage}`
  }

  // Se já é uma URL absoluta (começa com http:// ou https://), retorna como está
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }

  // Se é URL relativa, converte para absoluta
  // Garante que não há barra dupla
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${siteUrl}${cleanImageUrl}`
}
