/**
 * Funções auxiliares para buscar dados do PayloadCMS
 * Com sistema de fallback resiliente quando o CMS não está disponível
 */

import {
  getFallbackPosts,
  getFallbackPostBySlug,
  getFallbackEvents,
  getFallbackColumnists,
} from '@/lib/fallback-data'

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Verifica se o CMS está habilitado (padrão: true)
// Pode ser desabilitado definindo CMS_ENABLED=false no .env
const CMS_ENABLED = process.env.CMS_ENABLED !== 'false'

interface FetchOptions {
  revalidate?: number
  tags?: string[]
}

/**
 * Busca posts do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getPosts(options: {
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  category?: string
  featured?: boolean
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackPosts(options)
  }

  const {
    limit = 10,
    status = 'published',
    category,
    featured,
    revalidate = 60,
  } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
    'where[status][equals]': status,
    sort: '-publishedDate',
  })

  if (category) {
    params.append('where[category][equals]', category)
  }

  if (featured !== undefined) {
    params.append('where[featured][equals]', featured.toString())
  }

  try {
    const response = await fetch(`${API_URL}/api/posts?${params.toString()}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar posts (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackPosts(options)
    }

    const data = await response.json()
    const posts = data.docs || []
    
    // Se não houver posts do CMS, usa fallback
    if (posts.length === 0) {
      console.warn('[CMS] Nenhum post encontrado, usando dados de fallback')
      return getFallbackPosts(options)
    }

    return posts
  } catch (error) {
    console.warn('[CMS] Erro ao buscar posts do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackPosts(options)
  }
}

/**
 * Busca um post específico por slug
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getPostBySlug(slug: string, revalidate = 60) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackPostBySlug(slug)
  }

  try {
    const response = await fetch(
      `${API_URL}/api/posts?where[slug][equals]=${slug}&limit=1`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar post por slug (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackPostBySlug(slug)
    }

    const data = await response.json()
    const post = data.docs?.[0] || null

    // Se não encontrar no CMS, tenta fallback
    if (!post) {
      console.warn(`[CMS] Post não encontrado no CMS (slug: ${slug}), tentando fallback`)
      return getFallbackPostBySlug(slug)
    }

    return post
  } catch (error) {
    console.warn(`[CMS] Erro ao buscar post do CMS (slug: ${slug}), usando fallback:`, error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackPostBySlug(slug)
  }
}

/**
 * Busca eventos do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getEvents(options: {
  limit?: number
  status?: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackEvents(options)
  }

  const { limit = 10, status = 'upcoming', revalidate = 60 } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
    'where[status][equals]': status,
    sort: 'startDate',
  })

  try {
    const response = await fetch(`${API_URL}/api/events?${params.toString()}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar eventos (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackEvents(options)
    }

    const data = await response.json()
    const events = data.docs || []

    // Se não houver eventos do CMS, usa fallback
    if (events.length === 0) {
      console.warn('[CMS] Nenhum evento encontrado, usando dados de fallback')
      return getFallbackEvents(options)
    }

    return events
  } catch (error) {
    console.warn('[CMS] Erro ao buscar eventos do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackEvents(options)
  }
}

/**
 * Busca colunistas do CMS
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getColumnists(options: {
  limit?: number
  revalidate?: number
} = {}) {
  // Se CMS desabilitado, retorna fallback imediatamente
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, usando dados de fallback')
    return getFallbackColumnists(options)
  }

  const { limit = 10, revalidate = 60 } = options

  const params = new URLSearchParams({
    limit: limit.toString(),
  })

  try {
    const response = await fetch(
      `${API_URL}/api/columnists?${params.toString()}`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar colunistas (${response.status}): ${response.statusText}, usando fallback`)
      return getFallbackColumnists(options)
    }

    const data = await response.json()
    const columnists = data.docs || []

    // Se não houver colunistas do CMS, usa fallback
    if (columnists.length === 0) {
      console.warn('[CMS] Nenhum colunista encontrado, usando dados de fallback')
      return getFallbackColumnists(options)
    }

    return columnists
  } catch (error) {
    console.warn('[CMS] Erro ao buscar colunistas do CMS, usando dados de fallback:', error instanceof Error ? error.message : 'Erro desconhecido')
    return getFallbackColumnists(options)
  }
}

/**
 * Busca um colunista específico por slug
 * Retorna dados de fallback se o CMS não estiver disponível
 */
export async function getColumnistBySlug(slug: string, revalidate = 60) {
  // Se CMS desabilitado, retorna null (não há fallback para colunista específico)
  if (!CMS_ENABLED) {
    console.warn('[CMS] CMS desabilitado, retornando null para colunista específico')
    return null
  }

  try {
    const response = await fetch(
      `${API_URL}/api/columnists?where[slug][equals]=${slug}&limit=1`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      console.warn(`[CMS] Erro ao buscar colunista por slug (${response.status}): ${response.statusText}`)
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`[CMS] Erro ao buscar colunista do CMS (slug: ${slug}):`, error instanceof Error ? error.message : 'Erro desconhecido')
    return null
  }
}

/**
 * Busca configurações do site (Global)
 */
export async function getSiteSettings(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/site-settings`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Busca configurações do header (Global)
 */
export async function getHeader(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/header`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch header: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching header:', error)
    return null
  }
}

/**
 * Busca configurações do footer (Global)
 */
export async function getFooter(revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/globals/footer`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch footer: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching footer:', error)
    return null
  }
}

/**
 * Busca mídia por ID
 */
export async function getMediaById(id: string, revalidate = 3600) {
  try {
    const response = await fetch(`${API_URL}/api/media/${id}`, {
      next: { revalidate },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching media:', error)
    return null
  }
}

/**
 * Helper para obter URL de imagem
 */
export function getImageUrl(media: any, size?: string): string {
  if (!media) return '/placeholder.jpg'
  
  if (typeof media === 'string') {
    if (media.startsWith('/') || media.startsWith('http')) {
      return media
    }
    return `${API_URL}/api/media/${media}`
  }

  if (size && media.sizes?.[size]?.url) {
    return `${API_URL}${media.sizes[size].url}`
  }

  if (media.url) {
    return `${API_URL}${media.url}`
  }

  return '/placeholder.jpg'
}





