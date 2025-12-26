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
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex flex-col">
            {/* Toolbar */}
            <div className="border-b border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-bold">Pré-visualização</h2>
                    <div className="h-6 w-px bg-slate-800" />
                    <div className="flex bg-slate-900 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'desktop' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={cn(
                                "p-1.5 rounded-md transition-all",
                                viewMode === 'mobile' ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-900/50">
                <div className={cn(
                    "bg-slate-950 shadow-2xl transition-all duration-300 overflow-y-auto scrollbar-hide flex flex-col",
                    viewMode === 'desktop' ? "w-full max-w-4xl rounded-xl" : "w-[375px] h-[667px] self-center rounded-[3rem] border-8 border-slate-800"
                )}>
                    {/* Fake Browser/Mobile Status bar */}
                    {viewMode === 'mobile' && (
                        <div className="h-6 w-full flex justify-center items-center py-6">
                            <div className="w-20 h-4 bg-slate-800 rounded-full" />
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
                            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
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
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
                                <img
                                    src={post.cover_image_url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-invert prose-orange prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-blockquote:border-orange-500 prose-blockquote:bg-orange-500/5 prose-blockquote:py-1 prose-img:rounded-2xl"
                            dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-slate-600 italic">Escreva algo para ver o conteúdo...</p>' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
