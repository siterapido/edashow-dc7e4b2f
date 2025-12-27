'use client'

import React, { useState } from 'react'
import {
    Search,
    X,
    Download,
    Loader2,
    ExternalLink,
    Image as ImageIcon,
    Filter,
    RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import {
    searchStockImages,
    saveImageToStorage,
    checkImageProviders,
    getImageSearchSuggestions,
    NormalizedImage
} from '@/lib/actions/ai-images'

interface ImageSearchModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelectImage: (url: string) => void
    initialQuery?: string
}

export function ImageSearchModal({
    open,
    onOpenChange,
    onSelectImage,
    initialQuery = ''
}: ImageSearchModalProps) {
    const [query, setQuery] = useState(initialQuery)
    const [images, setImages] = useState<NormalizedImage[]>([])
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [providers, setProviders] = useState<{ pexels: boolean; unsplash: boolean }>({ pexels: false, unsplash: false })
    const [suggestions, setSuggestions] = useState<string[]>([])

    // Filters
    const [provider, setProvider] = useState<'all' | 'pexels' | 'unsplash'>('all')
    const [orientation, setOrientation] = useState<'landscape' | 'portrait' | 'square' | undefined>(undefined)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)

    // Check providers on mount
    React.useEffect(() => {
        checkImageProviders().then(setProviders)
    }, [])

    // Get suggestions when query changes
    React.useEffect(() => {
        if (query && query.length > 2) {
            getImageSearchSuggestions(query).then(setSuggestions)
        }
    }, [query])

    const handleSearch = async (searchQuery?: string, resetPage = true) => {
        const q = searchQuery || query
        if (!q.trim()) return

        setLoading(true)
        setError(null)
        if (resetPage) {
            setPage(1)
            setImages([])
        }

        try {
            const result = await searchStockImages({
                query: q,
                provider,
                orientation,
                page: resetPage ? 1 : page,
                perPage: 20
            })

            if (result.error) {
                setError(result.error)
            } else {
                if (resetPage) {
                    setImages(result.images)
                } else {
                    setImages(prev => [...prev, ...result.images])
                }
                setHasMore(result.hasMore)
            }
            setProviders(result.providers)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao buscar imagens')
        } finally {
            setLoading(false)
        }
    }

    const handleLoadMore = () => {
        setPage(prev => prev + 1)
        handleSearch(query, false)
    }

    const handleSelectImage = async (image: NormalizedImage) => {
        setSaving(image.id)
        try {
            const result = await saveImageToStorage(image, 'posts')
            if (result.error) {
                setError(result.error)
            } else if (result.url) {
                onSelectImage(result.url)
                onOpenChange(false)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar imagem')
        } finally {
            setSaving(null)
        }
    }

    const handleUseDirectUrl = (image: NormalizedImage) => {
        onSelectImage(image.url)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-orange-500" />
                        Buscar Imagens
                    </DialogTitle>
                    <DialogDescription>
                        Busque imagens gratuitas no Pexels e Unsplash
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 flex-1 overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Buscar imagens..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={() => handleSearch()} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
                        </Button>
                    </div>

                    {/* Suggestions */}
                    {suggestions.length > 0 && !images.length && (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500">Sugestões:</span>
                            {suggestions.map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setQuery(suggestion)
                                        handleSearch(suggestion)
                                    }}
                                    className="text-sm px-2 py-1 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <Label className="text-sm text-gray-500">Filtros:</Label>
                        </div>

                        <Select value={provider} onValueChange={(v) => setProvider(v as typeof provider)}>
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Fonte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="pexels" disabled={!providers.pexels}>Pexels</SelectItem>
                                <SelectItem value="unsplash" disabled={!providers.unsplash}>Unsplash</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={orientation || 'any'}
                            onValueChange={(v) => setOrientation(v === 'any' ? undefined : v as typeof orientation)}
                        >
                            <SelectTrigger className="w-32 h-8">
                                <SelectValue placeholder="Orientação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Qualquer</SelectItem>
                                <SelectItem value="landscape">Paisagem</SelectItem>
                                <SelectItem value="portrait">Retrato</SelectItem>
                                <SelectItem value="square">Quadrada</SelectItem>
                            </SelectContent>
                        </Select>

                        {(provider !== 'all' || orientation) && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setProvider('all')
                                    setOrientation(undefined)
                                }}
                                className="h-8 text-gray-500"
                            >
                                <X className="w-3 h-3 mr-1" />
                                Limpar
                            </Button>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Provider Status */}
                    {!providers.pexels && !providers.unsplash && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                            <strong>Nenhuma API configurada.</strong> Adicione PEXELS_API_KEY ou UNSPLASH_ACCESS_KEY ao arquivo .env
                        </div>
                    )}

                    {/* Image Grid */}
                    <div className="flex-1 overflow-y-auto">
                        {images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
                                {images.map((image) => (
                                    <div
                                        key={image.id}
                                        className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-orange-300 transition-all"
                                    >
                                        <img
                                            src={image.thumbnailUrl}
                                            alt={image.alt}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSelectImage(image)}
                                                    disabled={saving === image.id}
                                                    className="bg-orange-500 hover:bg-orange-600"
                                                >
                                                    {saving === image.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Usar
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Provider Badge */}
                                        <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded">
                                            {image.provider}
                                        </div>

                                        {/* Photographer */}
                                        {image.photographer && (
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                                <p className="text-white text-xs truncate">
                                                    📷 {image.photographer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : !loading && query && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <p>Nenhuma imagem encontrada</p>
                            </div>
                        )}

                        {/* Load More */}
                        {hasMore && !loading && (
                            <div className="flex justify-center py-4">
                                <Button variant="outline" onClick={handleLoadMore}>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Carregar mais
                                </Button>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
