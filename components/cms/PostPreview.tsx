'use client'

import React from 'react'
import { X, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PostPreviewProps {
    open: boolean
    onClose: () => void
    post: {
        title: string
        content: string
        excerpt: string
        cover_image_url: string
        category?: string
    }
}

export function PostPreview({ open, onClose, post }: PostPreviewProps) {
    const [viewMode, setViewMode] = React.useState<'mobile' | 'desktop'>('desktop')

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-gray-900 font-bold">Pré-visualização</h2>
                    <div className="h-6 w-px bg-gray-200" />
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'desktop' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'mobile' ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-900">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-gray-50">
                <div className={cn(
                    "bg-white shadow-2xl transition-all duration-300 overflow-y-auto scrollbar-hide flex flex-col",
                    viewMode === 'desktop' ? "w-full max-w-4xl rounded-xl" : "w-[375px] h-[667px] self-center rounded-[3rem] border-8 border-gray-200"
                )}>
                    {/* Fake Browser/Mobile Status bar */}
                    {viewMode === 'mobile' && (
                        <div className="h-6 w-full flex justify-center items-center py-6">
                            <div className="w-20 h-4 bg-gray-100 rounded-full" />
                        </div>
                    )}

                    <div className="p-6 md:p-12 space-y-6">
                        {/* Header Info */}
                        <div className="space-y-4">
                            {post.category && (
                                <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">
                                    {post.category}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {post.title || 'Título do Post'}
                            </h1>
                            {post.excerpt && (
                                <p className="text-xl text-slate-400 font-medium">
                                    {post.excerpt}
                                </p>
                            )}
                        </div>

                        {/* Cover Image */}
                        {post.cover_image_url && (
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-orange prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/5 prose-blockquote:py-1 prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-gray-400 italic">Escreva algo para ver o conteúdo...</p>' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
