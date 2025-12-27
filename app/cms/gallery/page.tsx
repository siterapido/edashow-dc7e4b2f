'use client'

import React, { useEffect, useState } from 'react'
import { Upload, Trash2, Image as ImageIcon, Search, Plus, X, Loader2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMedia, uploadMedia, deleteMedia } from '@/lib/actions/cms-media'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function CMSGalleryPage() {
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const data = await getMedia()
            setMedia(data || [])
        } catch (error) {
            console.error('Erro ao buscar mídia:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMedia()
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            await uploadMedia(formData)
            fetchMedia()
        } catch (error) {
            console.error('Erro no upload:', error)
            alert('Falha no upload da imagem')
        }
        setUploading(false)
    }

    const handleDelete = async (id: string, filename: string) => {
        if (!confirm('Deseja excluir esta imagem?')) return
        try {
            await deleteMedia(id, filename)
            setMedia(prev => prev.filter(m => m.id !== id))
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galeria de Imagens</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie a galeria visual do site.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Tamanho Ideal: 1080x1080px (1:1)</span>
                    </div>

                    <div className="relative">
                        <Input
                            type="file"
                            id="media-upload"
                            className="hidden"
                            onChange={handleUpload}
                            accept="image/*"
                            disabled={uploading}
                        />
                        <Label
                            htmlFor="media-upload"
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white rounded-md cursor-pointer transition-all font-bold shadow-lg shadow-orange-500/20 active:scale-95 whitespace-nowrap",
                                uploading && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {uploading ? 'Enviando...' : 'Adicionar à Galeria'}
                        </Label>
                    </div>
                </div>
            </div>

            {/* Hint for mobile */}
            <div className="lg:hidden flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                <Info className="w-4 h-4" />
                <span className="text-xs font-semibold">Tamanho Ideal: 1080x1080px (Quadrada)</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {loading ? (
                    Array(10).fill(0).map((_, i) => (
                        <div key={i} className="aspect-square bg-white rounded-xl animate-pulse border border-gray-100 shadow-sm" />
                    ))
                ) : media.length > 0 ? (
                    media.map((item) => (
                        <div key={item.id} className="group relative aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-orange-500 transition-all shadow-sm hover:shadow-md">
                            <img
                                src={item.url}
                                alt={item.alt || item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(item.id, item.filename)}
                                    className="scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <ImageIcon className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Galeria Vazia</h3>
                        <p className="text-gray-400 mt-2 max-w-xs mx-auto text-sm">
                            Comece a popular sua galeria com imagens de alta qualidade (1080x1080px).
                        </p>
                        <Button
                            variant="link"
                            className="mt-4 text-orange-500 font-bold"
                            onClick={() => document.getElementById('media-upload')?.click()}
                        >
                            Fazer primeiro upload
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
