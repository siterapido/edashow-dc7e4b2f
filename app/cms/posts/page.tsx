'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Search, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { DataTable } from '@/components/cms/DataTable'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function CMSPostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchPosts = async () => {
        setLoading(true)
        const supabase = createClient()

        let query = supabase
            .from('posts')
            .select('*, categories(name)')
            .order('created_at', { ascending: false })

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter)
        }

        const { data, error } = await query

        if (error) {
            console.error('Erro ao buscar posts:', error)
        } else {
            setPosts(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchPosts()
    }, [statusFilter])

    const columns = [
        {
            key: 'title',
            label: 'Título',
            render: (post: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-orange-300 transition-colors">{post.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">{post.id}</span>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Categoria',
            render: (post: any) => post.categories?.name || 'Sem categoria'
        },
        {
            key: 'status',
            label: 'Status',
            render: (post: any) => (
                <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider",
                    post.status === 'published' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"
                )}>
                    {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                </span>
            )
        },
        {
            key: 'published_at',
            label: 'Data de Publicação',
            render: (post: any) => post.published_at ? new Date(post.published_at).toLocaleDateString('pt-BR') : '-'
        }
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Posts</h1>
                    <p className="text-slate-400 text-sm mt-1">Gerencie todos os artigos e notícias do site.</p>
                </div>
                <Button
                    onClick={() => router.push('/cms/posts/new')}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg shadow-orange-900/20"
                >
                    <Plus className="w-4 h-4" /> Novo Post
                </Button>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                        placeholder="Buscar por título..."
                        className="pl-10 bg-slate-950 border-slate-800 text-white"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-300 text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="published">Publicados</option>
                        <option value="draft">Rascunhos</option>
                    </select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fetchPosts()}
                        className="border-slate-800 hover:bg-slate-800 text-slate-400"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={posts}
                loading={loading}
                onRowClick={(post) => router.push(`/cms/posts/${post.id}`)}
            />
        </div>
    )
}
