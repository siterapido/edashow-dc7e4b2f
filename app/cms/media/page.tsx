'use client'

import React, { useEffect, useState } from 'react'
import { Upload, Trash2, Image as ImageIcon, Info, Loader2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMedia, uploadMedia, deleteMedia } from '@/lib/actions/cms-media'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function CMSMediaPage() {
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [copiedId, setCopiedId] = useState<string | null>(null)

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
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            // Support multiple file upload if needed, but for now let's stick to one to match current actions
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData()
                formData.append('file', files[i])
                await uploadMedia(formData)
            }
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

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Galeria e Biblioteca de Mídia</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie todas as imagens e mídias do site em um só lugar.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                        <Info className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase tracking-wider">Dica: Formato 1:1 é ideal para posts</span>
                    </div>

                    <div className="relative">
                        <Input
                            type="file"
                            id="media-upload"
                            className="hidden"
                            onChange={handleUpload}
                            accept="image/*"
                            multiple
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
                            {uploading ? 'Enviando...' : 'Fazer Upload'}
                        </Label>
                    </div>
                </div>
            </div>

            {/* Hint for mobile */}
            <div className="lg:hidden flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100">
                <Info className="w-4 h-4" />
                <span className="text-xs font-semibold text-center w-full">Dica: Use imagens quadradas para melhor exibição</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {loading ? (
                    Array(12).fill(0).map((_, i) => (
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

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="h-9 w-9 bg-white hover:bg-gray-100 text-gray-900 border-none shadow-sm"
                                        onClick={() => copyToClipboard(item.url, item.id)}
                                        title="Copiar URL"
                                    >
                                        {copiedId === item.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        className="h-9 w-9 shadow-sm"
                                        onClick={() => handleDelete(item.id, item.filename)}
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 backdrop-blur-sm">
                                    <p className="text-[10px] text-white font-medium truncate text-center">
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center flex flex-col items-center justify-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                        <div className="p-4 bg-gray-50 rounded-full mb-4">
                            <ImageIcon className="w-12 h-12 text-gray-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Nenhum arquivo encontrado</h3>
                        <p className="text-gray-400 mt-2 max-w-xs mx-auto text-sm">
                            Sua galeria está vazia. Comece fazendo upload de imagens para usar em seus posts e páginas.
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
