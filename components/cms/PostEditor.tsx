'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Save,
    ArrowLeft,
    Trash2,
    Eye,
    Calendar,
    Tag as TagIcon,
    Globe,
    Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from './RichTextEditor'
import { savePost, deletePost } from '@/lib/actions/cms-posts'
import { slugify } from '@/lib/utils' // Assuming this exists or I'll create it
import { cn } from '@/lib/utils'

interface PostEditorProps {
    post: any
    categories: any[]
    columnists: any[]
}

export function PostEditor({ post, categories, columnists }: PostEditorProps) {
    const router = useRouter()
    const isNew = !post

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        id: post?.id || 'new',
        title: post?.title || '',
        slug: post?.slug || '',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        category_id: post?.category_id || '',
        columnist_id: post?.columnist_id || '',
        status: post?.status || 'draft',
        published_at: post?.published_at ? new Date(post.published_at).toISOString().split('T')[0] : '',
        featured_home: post?.featured_home || false,
        source_url: post?.source_url || '',
        tags: post?.tags || []
    })

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await savePost(formData)
            router.push('/cms/posts')
        } catch (error) {
            console.error('Erro ao salvar post:', error)
            alert('Erro ao salvar post. Verifique o console.')
        }
        setLoading(false)
    }

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este post?')) return
        setLoading(true)
        try {
            await deletePost(post.id)
            router.push('/cms/posts')
        } catch (error) {
            console.error('Erro ao deletar post:', error)
        }
        setLoading(false)
    }

    const updateTitle = (title: string) => {
        setFormData(prev => ({
            ...prev,
            title,
            slug: isNew ? slugify(title) : prev.slug
        }))
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-6 sticky top-16 bg-slate-950 z-30">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.push('/cms/posts')}
                        className="text-slate-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold text-white">
                            {isNew ? 'Criar Novo Post' : 'Editar Post'}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">
                            {isNew ? 'Rascunho' : post.status}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isNew && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                            className="border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar Post
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs font-bold uppercase">Título do Post</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => updateTitle(e.target.value)}
                                placeholder="Ex: O Futuro da Saúde Digital..."
                                className="text-2xl font-bold bg-slate-950 border-slate-800 text-white h-auto p-4 placeholder:text-slate-700 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs font-bold uppercase">Slug (URL)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...prev, slug: e.target.value })}
                                        className="pl-10 bg-slate-950 border-slate-800 text-slate-400 text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs font-bold uppercase">Data de Publicação</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        type="date"
                                        value={formData.published_at}
                                        onChange={(e) => setFormData({ ...prev, published_at: e.target.value })}
                                        className="pl-10 bg-slate-950 border-slate-800 text-slate-400 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400 text-xs font-bold uppercase">Resumo (Excerpt)</Label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...prev, excerpt: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded-md p-3 text-slate-300 text-sm min-h-[100px] outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-700"
                                placeholder="Uma breve introdução para o post..."
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-400 text-xs font-bold uppercase px-1">Conteúdo do Post</Label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        />
                    </div>
                </div>

                {/* Sidebar Settings Section */}
                <div className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="p-4 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-orange-500" />
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Configurações</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">Status do Post</Label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...prev, status: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="draft">Rascunho</option>
                                    <option value="published">Publicado</option>
                                    <option value="archived">Arquivado</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">Categoria</Label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...prev, category_id: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">Colunista / Autor</Label>
                                <select
                                    value={formData.columnist_id}
                                    onChange={(e) => setFormData({ ...prev, columnist_id: e.target.value })}
                                    className="w-full bg-slate-950 border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">Selecione um autor</option>
                                    {columnists.map(col => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-300">Destaque na Home</span>
                                    <span className="text-[10px] text-slate-500">Exibir na seção principal</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.featured_home}
                                    onChange={(e) => setFormData({ ...prev, featured_home: e.target.checked })}
                                    className="w-4 h-4 bg-slate-800 rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
                        <CardHeader className="p-4 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-2">
                                <TagIcon className="w-4 h-4 text-orange-500" />
                                <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-400">Tags & SEO</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[10px] font-bold uppercase">URL Original (Opcional)</Label>
                                <Input
                                    value={formData.source_url}
                                    onChange={(e) => setFormData({ ...prev, source_url: e.target.value })}
                                    placeholder="https://..."
                                    className="bg-slate-950 border-slate-800 text-slate-400 text-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    )
}
