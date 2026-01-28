'use client'

import React, { useState, useCallback, useEffect } from 'react'
import {
  ImageIcon,
  Sparkles,
  Search,
  Loader2,
  Check,
  RefreshCw,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  checkAIImageProviders,
  getAICoverSuggestions,
  selectAICoverImage,
  getAIVisualKeywords,
  searchStockImages
} from '@/lib/actions/ai-images'

interface CoverImageGeneratorProps {
  title: string
  content?: string
  onSelect: (url: string) => void
  onClose: () => void
}

type ImageResult = {
  id: string
  url: string
  thumbnailUrl: string
  alt: string
  photographer?: string
  source: 'pexels' | 'unsplash'
}

export function CoverImageGenerator({
  title,
  content,
  onSelect,
  onClose
}: CoverImageGeneratorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState<ImageResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState<string | null>(null)
  const [providers, setProviders] = useState<{ pexels: boolean }>({ pexels: false })
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  // Check available providers
  useEffect(() => {
    checkAIImageProviders().then(setProviders)
  }, [])

  // Get suggested keywords on mount
  useEffect(() => {
    if (title) {
      getAIVisualKeywords(title, content).then(keywords => {
        setSuggestedKeywords(keywords)
        setSearchQuery(keywords.join(' '))
      })
    }
  }, [title, content])

  // Auto-search on mount if we have a title
  useEffect(() => {
    if (title && providers.pexels && suggestedKeywords.length > 0) {
      handleSearch(suggestedKeywords.join(' '))
    }
  }, [title, providers.pexels, suggestedKeywords])

  const handleSearch = useCallback(async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await searchStockImages({
        query: searchTerm,
        provider: 'all',
        orientation: 'landscape',
        perPage: 12
      })

      if (result.error) {
        setError(result.error)
        setImages([])
      } else {
        setImages(result.images.map((img: any) => ({
          id: img.id,
          url: img.url,
          thumbnailUrl: img.thumbnailUrl || img.url,
          alt: img.alt || searchTerm,
          photographer: img.photographer,
          source: img.provider as 'pexels' | 'unsplash'
        })))
      }
    } catch (err) {
      setError('Erro ao buscar imagens')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery])

  const handleAISearch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await getAICoverSuggestions({
        title,
        content,
        count: 12
      })

      setImages(result.images.map(img => ({
        id: img.id,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        alt: img.alt,
        photographer: img.photographer,
        source: img.source
      })))

      if (result.images.length === 0) {
        setError('Nenhuma imagem encontrada. Tente outras palavras-chave.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar imagens')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [title, content])

  const handleSelectImage = useCallback(async (image: ImageResult) => {
    setIsSelecting(image.id)

    try {
      const result = await selectAICoverImage(image.url, image.source)

      if (result.error || !result.url) {
        throw new Error(result.error || 'Failed to upload image')
      }

      onSelect(result.url)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao selecionar imagem')
      console.error(err)
    } finally {
      setIsSelecting(null)
    }
  }, [onSelect, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Gerar Capa com IA</h2>
              <p className="text-sm text-gray-500">Busque ou gere uma imagem de capa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar imagens..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !searchQuery.trim()}
                className="px-4 py-2.5 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar
              </button>
              <button
                onClick={handleAISearch}
                disabled={isLoading || !title}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                title="Buscar com IA baseado no título"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Auto
              </button>
            </div>

            {/* Suggested Keywords */}
            {suggestedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Sugestões IA:</span>
                {suggestedKeywords.map((keyword, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(keyword)
                      handleSearch(keyword)
                    }}
                    className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Buscando imagens...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ImageIcon className="w-12 h-12 mb-3 opacity-50" />
              <p>Nenhuma imagem encontrada</p>
              <p className="text-sm">Tente buscar por outras palavras-chave</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={cn(
                    "relative group aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
                    isSelecting === image.id
                      ? "border-purple-500 ring-2 ring-purple-200"
                      : "border-transparent hover:border-purple-300"
                  )}
                  onClick={() => !isSelecting && handleSelectImage(image)}
                >
                  <img
                    src={image.thumbnailUrl}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
                    isSelecting === image.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    {isSelecting === image.id ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center text-white">
                        <Check className="w-8 h-8 mb-1" />
                        <span className="text-sm font-medium">Selecionar</span>
                      </div>
                    )}
                  </div>

                  {/* Source Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded capitalize">
                    {image.source}
                  </div>

                  {/* Photographer */}
                  {image.photographer && (
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs truncate">
                        Foto: {image.photographer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {providers.pexels && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Pexels (Gratuito)
              </span>
            )}
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              Keywords via IA
            </span>
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Atualizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoverImageGenerator
