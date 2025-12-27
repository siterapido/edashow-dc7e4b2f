/**
 * Pexels API Client
 * Free stock photos API
 * https://www.pexels.com/api/
 */

const PEXELS_API_URL = 'https://api.pexels.com/v1'

export interface PexelsPhoto {
    id: number
    width: number
    height: number
    url: string
    photographer: string
    photographer_url: string
    photographer_id: number
    avg_color: string
    src: {
        original: string
        large2x: string
        large: string
        medium: string
        small: string
        portrait: string
        landscape: string
        tiny: string
    }
    alt: string
}

export interface PexelsSearchResponse {
    total_results: number
    page: number
    per_page: number
    photos: PexelsPhoto[]
    next_page?: string
}

export interface PexelsSearchOptions {
    query: string
    orientation?: 'landscape' | 'portrait' | 'square'
    size?: 'large' | 'medium' | 'small'
    color?: string
    locale?: string
    page?: number
    perPage?: number
}

class PexelsClient {
    private apiKey: string | undefined

    constructor() {
        this.apiKey = process.env.PEXELS_API_KEY
    }

    private getHeaders(): HeadersInit {
        if (!this.apiKey) {
            throw new Error('PEXELS_API_KEY not configured')
        }

        return {
            'Authorization': this.apiKey
        }
    }

    /**
     * Check if API is configured
     */
    isConfigured(): boolean {
        return !!this.apiKey && this.apiKey.length > 0
    }

    /**
     * Search for photos
     */
    async searchPhotos(options: PexelsSearchOptions): Promise<PexelsSearchResponse> {
        const params = new URLSearchParams({
            query: options.query,
            per_page: String(options.perPage || 15),
            page: String(options.page || 1)
        })

        if (options.orientation) params.append('orientation', options.orientation)
        if (options.size) params.append('size', options.size)
        if (options.color) params.append('color', options.color)
        if (options.locale) params.append('locale', options.locale)

        const response = await fetch(`${PEXELS_API_URL}/search?${params}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get curated photos (popular)
     */
    async getCurated(page: number = 1, perPage: number = 15): Promise<PexelsSearchResponse> {
        const params = new URLSearchParams({
            page: String(page),
            per_page: String(perPage)
        })

        const response = await fetch(`${PEXELS_API_URL}/curated?${params}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get a specific photo by ID
     */
    async getPhoto(id: number): Promise<PexelsPhoto> {
        const response = await fetch(`${PEXELS_API_URL}/photos/${id}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Normalize photo to common format
     */
    normalizePhoto(photo: PexelsPhoto): NormalizedImage {
        return {
            id: `pexels-${photo.id}`,
            provider: 'pexels',
            url: photo.src.large2x,
            thumbnailUrl: photo.src.medium,
            width: photo.width,
            height: photo.height,
            alt: photo.alt || 'Pexels Photo',
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
            downloadUrl: photo.src.original,
            color: photo.avg_color
        }
    }
}

export interface NormalizedImage {
    id: string
    provider: 'pexels' | 'unsplash' | 'freepik' | 'ai'
    url: string
    thumbnailUrl: string
    width: number
    height: number
    alt: string
    photographer?: string
    photographerUrl?: string
    downloadUrl: string
    color?: string
}

export const pexels = new PexelsClient()
