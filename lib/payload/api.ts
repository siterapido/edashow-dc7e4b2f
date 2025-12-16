/**
 * Funções auxiliares para buscar dados do PayloadCMS
 */

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

interface FetchOptions {
  revalidate?: number
  tags?: string[]
}

/**
 * Busca posts do CMS
 */
export async function getPosts(options: {
  limit?: number
  status?: 'draft' | 'published' | 'archived'
  category?: string
  featured?: boolean
  revalidate?: number
} = {}) {
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
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

/**
 * Busca um post específico por slug
 */
export async function getPostBySlug(slug: string, revalidate = 60) {
  try {
    const response = await fetch(
      `${API_URL}/api/posts?where[slug][equals]=${slug}&limit=1`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

/**
 * Busca eventos do CMS
 */
export async function getEvents(options: {
  limit?: number
  status?: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  revalidate?: number
} = {}) {
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
      throw new Error(`Failed to fetch events: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

/**
 * Busca colunistas do CMS
 */
export async function getColumnists(options: {
  limit?: number
  revalidate?: number
} = {}) {
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
      throw new Error(`Failed to fetch columnists: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching columnists:', error)
    return []
  }
}

/**
 * Busca um colunista específico por slug
 */
export async function getColumnistBySlug(slug: string, revalidate = 60) {
  try {
    const response = await fetch(
      `${API_URL}/api/columnists?where[slug][equals]=${slug}&limit=1`,
      {
        next: { revalidate },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch columnist: ${response.statusText}`)
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching columnist:', error)
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

