'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    Trash2,
    Eye,
    Settings,
    Check,
    Loader2,
    Send
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MediumEditor } from './MediumEditor'
import { CoverImageUpload } from './CoverImageUpload'
import { SettingsDrawer } from './SettingsDrawer'
import { PostPreview } from './PostPreview'
import { savePost, deletePost, autoSavePost } from '@/lib/actions/cms-posts'
import { useAutoSave } from '@/lib/hooks/useAutoSave'
import { slugify } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PostEditorProps {
    post: any
    categories: any[]
    columnists: any[]
}

export function PostEditor({ post, categories, columnists }: PostEditorProps) {
    const router = useRouter()

    const [settingsOpen, setSettingsOpen] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [formData, setFormData] = useState({
        id: post?.id || 'new',
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        cover_image_url: post?.cover_image_url || '',
        category_id: post?.category_id || '',
        columnist_id: post?.columnist_id || '',
        status: post?.status || 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '',
        featured_home: post?.featured_home || false,
        source_url: post?.source_url || '',
        tags: post?.tags || []
    })

    // Auto-save hook
    const { isSaving, statusText, hasUnsavedChanges } = useAutoSave({
        data: formData,
        delay: 5000,
        enabled: formData.id !== 'new' && formData.title.length > 0,
        onSave: async (data) => {
            await autoSavePost(data)
        }
    })

    const updateField = useCallback((field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Auto-generate slug from title for new posts
            ...(field === 'title' && formData.id === 'new' ? { slug: slugify(value) } : {})
        }))
    }, [formData.id])

    const handleSave = async () => {
        if (!formData.title) {
            alert('Por favor, adicione um título ao post.')
            return
        }

        try {
            const savedPost = await savePost(formData)
            if (formData.id === 'new') {
                router.replace(`/cms/posts/${savedPost.id}`)
            } else {
                router.push('/cms/posts')
            }
        } catch (error) {
            console.error('Erro ao salvar post:', error)
            alert('Erro ao salvar post. Verifique o console.')
        }
    }

    const handlePublish = async () => {
        if (!formData.title) {
            alert('Por favor, adicione um título ao post.')
            return
        }

        setIsPublishing(true)
        try {
            const savedPost = await savePost({
                ...formData,
                status: 'published',
                published_at: formData.published_at || new Date().toISOString().split('T')[0]
            })
            if (formData.id === 'new') {
                router.replace(`/cms/posts/${savedPost.id}`)
            } else {
                router.push('/cms/posts')
            }
        } catch (error) {
            console.error('Erro ao publicar post:', error)
            alert('Erro ao publicar post.')
        } finally {
            setIsPublishing(false)
        }
    }

    const handleDelete = async () => {
        if (formData.id === 'new') return
        if (!confirm('Tem certeza que deseja excluir este post?')) return

        try {
            await deletePost(formData.id)
            router.push('/cms/posts')
        } catch (error) {
            console.error('Erro ao deletar post:', error)
        }
    }

    const currentCategory = categories.find(c => c.id === formData.category_id)?.name

    return (
        <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
            {/* Header */}
            <header className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Left: Back button */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/cms/posts')}
                            className="text-gray-400 hover:text-gray-900 -ml-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div className="hidden sm:flex items-center gap-2 text-sm">
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                            ) : hasUnsavedChanges ? (
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                            ) : (
                                <Check className="w-4 h-4 text-green-500" />
                            )}
                            <span className="text-gray-400 text-xs">{statusText}</span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewOpen(true)}
                            className="text-gray-500 hover:text-gray-900 gap-2"
                            title="Ver prévia"
                        >
                            <Eye className="w-4 h-4" />
                            <span className="hidden md:inline font-medium">Prévia</span>
                        </Button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {formData.id !== 'new' && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleDelete}
                                className="text-gray-400 hover:text-red-600 hidden sm:flex"
                            >
                                <Trash2 className="w-5 h-5" />
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setSettingsOpen(true)}
                            className="text-gray-500 hover:text-gray-900 gap-2"
                        >
                            <Settings className="w-4 h-4" />
                            <span className="hidden md:inline font-medium">Configurações</span>
                        </Button>
                        {formData.status === 'published' ? (
                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-green-600 hover:bg-green-500 text-white font-medium px-4 gap-2"
                            >
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Atualizar</span>
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePublish}
                                disabled={isPublishing || !formData.title}
                                className="bg-orange-500 hover:bg-orange-400 text-white font-medium px-4 gap-2"
                            >
                                {isPublishing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Publicar</span>
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Title Input - Medium Style */}
                <div className="space-y-1">
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        placeholder="Título do post"
                        className="w-full bg-transparent text-3xl md:text-4xl font-bold text-gray-900 placeholder:text-gray-300 outline-none border-none"
                    />
                    {formData.slug && (
                        <p className="text-xs text-gray-400 font-mono">
                            /posts/{formData.slug}
                        </p>
                    )}
                </div>

                {/* Cover Image */}
                <CoverImageUpload
                    value={formData.cover_image_url}
                    onChange={(url) => updateField('cover_image_url', url || '')}
                />

                {/* Excerpt */}
                <textarea
                    value={formData.excerpt}
                    onChange={(e) => updateField('excerpt', e.target.value)}
                    placeholder="Escreva um resumo ou subtítulo para o post..."
                    className="w-full bg-transparent text-lg text-gray-700 placeholder:text-gray-400 outline-none border-none resize-none min-h-[60px]"
                    rows={2}
                />

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Editor */}
                <MediumEditor
                    content={formData.content}
                    onChange={(content) => updateField('content', content)}
                    placeholder="Comece a escrever sua história..."
                />
            </main>

            {/* Settings Drawer */}
            <SettingsDrawer
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                formData={{
                    status: formData.status,
                    category_id: formData.category_id,
                    columnist_id: formData.columnist_id,
                    published_at: formData.published_at,
                    featured_home: formData.featured_home,
                    source_url: formData.source_url
                }}
                onChange={updateField}
                categories={categories}
                columnists={columnists}
            />

            {/* Post Preview Modal */}
            <PostPreview
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                post={{
                    title: formData.title,
                    content: formData.content,
                    excerpt: formData.excerpt,
                    cover_image_url: formData.cover_image_url,
                    category: currentCategory
                }}
            />

            {/* Mobile Bottom Spacer (for the editor toolbar) */}
            <div className="h-16 md:hidden" />
        </div>
    )
}
