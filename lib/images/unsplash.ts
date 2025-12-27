/**
 * Unsplash API Client
 * Free high-quality stock photos
 * https://unsplash.com/developers
 */

const UNSPLASH_API_URL = 'https://api.unsplash.com'

export interface UnsplashPhoto {
    id: string
    created_at: string
    width: number
    height: number
    color: string
    blur_hash: string
    description: string | null
    alt_description: string | null
    urls: {
        raw: string
        full: string
        regular: string
        small: string
        thumb: string
    }
    links: {
        self: string
        html: string
        download: string
        download_location: string
    }
    user: {
        id: string
        username: string
        name: string
        portfolio_url: string | null
        links: {
            html: string
        }
    }
}

export interface UnsplashSearchResponse {
    total: number
    total_pages: number
    results: UnsplashPhoto[]
}

export interface UnsplashSearchOptions {
    query: string
    page?: number
    perPage?: number
    orientation?: 'landscape' | 'portrait' | 'squarish'
    color?: string
    orderBy?: 'relevant' | 'latest'
}

class UnsplashClient {
    private accessKey: string | undefined

    constructor() {
        this.accessKey = process.env.UNSPLASH_ACCESS_KEY
    }

    private getHeaders(): HeadersInit {
        if (!this.accessKey) {
            throw new Error('UNSPLASH_ACCESS_KEY not configured')
        }

        return {
            'Authorization': `Client-ID ${this.accessKey}`
        }
    }

    /**
     * Check if API is configured
     */
    isConfigured(): boolean {
        return !!this.accessKey && this.accessKey.length > 0
    }

    /**
     * Search for photos
     */
    async searchPhotos(options: UnsplashSearchOptions): Promise<UnsplashSearchResponse> {
        const params = new URLSearchParams({
            query: options.query,
            per_page: String(options.perPage || 15),
            page: String(options.page || 1)
        })

        if (options.orientation) params.append('orientation', options.orientation)
        if (options.color) params.append('color', options.color)
        if (options.orderBy) params.append('order_by', options.orderBy)

        const response = await fetch(`${UNSPLASH_API_URL}/search/photos?${params}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get random photos
     */
    async getRandomPhotos(count: number = 10, query?: string): Promise<UnsplashPhoto[]> {
        const params = new URLSearchParams({
            count: String(count)
        })

        if (query) params.append('query', query)

        const response = await fetch(`${UNSPLASH_API_URL}/photos/random?${params}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get a specific photo by ID
     */
    async getPhoto(id: string): Promise<UnsplashPhoto> {
        const response = await fetch(`${UNSPLASH_API_URL}/photos/${id}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Unsplash API error: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Track download (required by Unsplash API guidelines)
     */
    async trackDownload(downloadLocation: string): Promise<void> {
        await fetch(downloadLocation, {
            headers: this.getHeaders()
        })
    }

    /**
     * Normalize photo to common format
     */
    normalizePhoto(photo: UnsplashPhoto): NormalizedImage {
        return {
            id: `unsplash-${photo.id}`,
            provider: 'unsplash',
            url: photo.urls.regular,
            thumbnailUrl: photo.urls.small,
            width: photo.width,
            height: photo.height,
            alt: photo.alt_description || photo.description || 'Unsplash Photo',
            photographer: photo.user.name,
            photographerUrl: photo.user.links.html,
            downloadUrl: photo.urls.full,
            color: photo.color
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

export const unsplash = new UnsplashClient()
