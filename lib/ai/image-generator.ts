/**
 * AI Image Generator
 * Uses Pexels for FREE high-quality stock images
 * AI-powered keyword extraction for better search results
 */

export interface ImageSearchResult {
  id: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  alt: string
  photographer?: string
  photographerUrl?: string
  source: 'pexels' | 'unsplash'
}

export interface ImageGenerationResult {
  images: ImageSearchResult[]
  source: 'pexels'
  query: string
}

// Pexels API (FREE)
const PEXELS_API_URL = 'https://api.pexels.com/v1'

/**
 * Extract visual keywords from text using AI
 */
export async function extractVisualKeywords(
  title: string,
  content?: string
): Promise<string[]> {
  const { openrouter } = await import('./openrouter')

  if (!openrouter.isConfigured()) {
    // Fallback: extract keywords manually
    return title.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
      .slice(0, 5)
  }

  const prompt = `Extract 3-5 visual keywords in English that would help find a good cover image for this article.
Return ONLY a JSON array of strings, nothing else.

Title: ${title}
${content ? `Content excerpt: ${content.slice(0, 500)}...` : ''}

Example output: ["technology", "innovation", "office", "computer"]`

  try {
    const result = await openrouter.generate(prompt, {
      temperature: 0.3,
      maxTokens: 100
    })

    const match = result.match(/\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0])
    }
    return title.split(' ').slice(0, 3)
  } catch {
    return title.split(' ').slice(0, 3)
  }
}

/**
 * Generate optimized search query from title and content
 */
export async function generateImagePrompt(
  title: string,
  content?: string,
  style?: string
): Promise<string> {
  // Just use keywords for Pexels search
  const keywords = await extractVisualKeywords(title, content)
  return keywords.join(' ')
}

/**
 * Search images on Pexels
 */
export async function searchPexels(
  query: string,
  count: number = 4
): Promise<ImageSearchResult[]> {
  const apiKey = process.env.PEXELS_API_KEY

  if (!apiKey) {
    console.warn('PEXELS_API_KEY not configured')
    return []
  }

  try {
    const response = await fetch(
      `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    )

    if (!response.ok) {
      console.error('Pexels API error:', response.statusText)
      return []
    }

    const data = await response.json()

    return (data.photos || []).map((photo: any) => ({
      id: String(photo.id),
      url: photo.src.large2x || photo.src.large,
      thumbnailUrl: photo.src.medium,
      width: photo.width,
      height: photo.height,
      alt: photo.alt || query,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      source: 'pexels' as const
    }))
  } catch (error) {
    console.error('Pexels search error:', error)
    return []
  }
}

/**
 * Get cover images based on title/content
 * Uses Pexels (FREE) with AI-powered keyword extraction
 */
export async function getCoverImages(
  title: string,
  options: {
    content?: string
    count?: number
  } = {}
): Promise<ImageGenerationResult> {
  const { content, count = 8 } = options

  // Extract smart keywords using AI
  const keywords = await extractVisualKeywords(title, content)
  const query = keywords.join(' ')
  const images = await searchPexels(query, count)

  return {
    images,
    source: 'pexels',
    query
  }
}

/**
 * Check which image providers are available
 */
export function getAvailableProviders(): {
  pexels: boolean
} {
  return {
    pexels: !!process.env.PEXELS_API_KEY
  }
}
