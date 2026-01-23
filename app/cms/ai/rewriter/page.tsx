'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Loader2, Save, Link as LinkIcon, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ArticleRewriterPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [result, setResult] = useState<any>(null)

    // Form states
    const [url, setUrl] = useState('')
    const [sourceContent, setSourceContent] = useState('')
    const [tone, setTone] = useState('professional')
    const [instructions, setInstructions] = useState('')

    async function handleFetchUrl() {
        if (!url) {
            toast({ title: "Digite uma URL válida", variant: "destructive" })
            return
        }

        setFetching(true)
        try {
            const response = await fetch('/api/ai/fetch-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })

            if (!response.ok) throw new Error('Falha ao buscar URL')

            const data = await response.json()
            setSourceContent(data.content || '')
            toast({ title: "Conteúdo importado com sucesso" })
        } catch (error) {
            toast({ 
                title: "Erro ao buscar URL", 
                description: "Verifique se o site permite acesso ou cole o texto manualmente.",
                variant: "destructive" 
            })
        } finally {
            setFetching(false)
        }
    }

    async function handleRewrite(e: React.FormEvent) {
        e.preventDefault()
        if (!sourceContent) {
            toast({ title: "Insira um conteúdo para reescrever", variant: "destructive" })
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const response = await fetch('/api/ai/rewrite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceContent,
                    sourceUrl: url,
                    tone,
                    instructions
                })
            })

            if (!response.ok) throw new Error('Falha na reescrita')

            const data = await response.json()
            setResult(data)
            toast({
                title: "Matéria reescrita com sucesso!",
                description: "O conteúdo foi adaptado para o tom do EDA Show.",
            })

        } catch (error: any) {
            console.error(error)
            toast({
                title: "Erro na reescrita",
                description: error.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    async function handleSaveDraft() {
        if (!result) return
        
        try {
            const response = await fetch('/api/cms/posts/create-draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...result,
                    sourceUrl: url // Save source for reference/credits
                })
            })

            if (!response.ok) throw new Error('Falha ao salvar rascunho')
            
            const { id } = await response.json()
            
            toast({
                title: "Rascunho salvo!",
                description: "Redirecionando para o editor...",
            })
            
            router.push(`/cms/posts/${id}`)
        } catch (error) {
            toast({
                title: "Erro ao salvar",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/cms/ai">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-blue-500" />
                        Reescritor de Matérias
                    </h1>
                    <p className="text-gray-500">Adapte notícias de outras fontes para o estilo EDA Show</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Source Input */}
                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle>Conteúdo Original</CardTitle>
                        <CardDescription>Importe via URL ou cole o texto</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Input 
                                placeholder="https://exemplo.com/noticia-original" 
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                            />
                            <Button variant="secondary" onClick={handleFetchUrl} disabled={fetching}>
                                {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Label>Texto da Matéria</Label>
                            <Textarea 
                                className="min-h-[300px]" 
                                placeholder="O texto da matéria aparecerá aqui..."
                                value={sourceContent}
                                onChange={e => setSourceContent(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tom de Adaptação</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Padrão EDA Show</SelectItem>
                                    <SelectItem value="summarized">Resumido / Curto</SelectItem>
                                    <SelectItem value="opinionated">Comentado / Opinativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleRewrite} className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading || !sourceContent}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Reescrevendo...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reescrever Agora
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Result View */}
                <div className="space-y-6">
                    {result ? (
                        <Card className="h-full border-blue-100 bg-blue-50/10">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <div>
                                    <CardTitle>Nova Versão</CardTitle>
                                    <CardDescription>Conteúdo original e otimizado</CardDescription>
                                </div>
                                <Button onClick={handleSaveDraft} variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                                    <Save className="mr-2 h-4 w-4" />
                                    Salvar Post
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-1">
                                    <Label className="text-xs uppercase text-gray-500">Novo Título</Label>
                                    <div className="p-3 bg-white border border-gray-100 rounded-md font-medium text-lg shadow-sm">
                                        {result.title}
                                    </div>
                                </div>

                                <Tabs defaultValue="content">
                                    <TabsList className="w-full">
                                        <TabsTrigger value="content" className="flex-1">Conteúdo</TabsTrigger>
                                        <TabsTrigger value="seo" className="flex-1">SEO & Tags</TabsTrigger>
                                        <TabsTrigger value="compare" className="flex-1">Comparação</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="content" className="mt-4">
                                        <div className="p-4 bg-white border border-gray-100 rounded-md min-h-[400px] whitespace-pre-wrap font-mono text-sm shadow-sm">
                                            {result.content}
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="seo" className="mt-4 space-y-4">
                                        <div className="space-y-1">
                                            <Label>Meta Description</Label>
                                            <div className="p-3 bg-white border rounded-md text-sm">{result.metaDescription}</div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Tags</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {(result.suggestedTags || result.tags || []).map((t: string) => (
                                                    <span key={t} className="px-2 py-1 bg-gray-100 rounded-full text-xs">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </TabsContent>
                                    
                                    <TabsContent value="compare" className="mt-4">
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div className="p-2 bg-red-50 rounded">
                                                <strong className="block mb-2 text-red-700">Original ({sourceContent.length} chars)</strong>
                                                <p className="opacity-70 line-clamp-[20]">{sourceContent}</p>
                                            </div>
                                            <div className="p-2 bg-green-50 rounded">
                                                <strong className="block mb-2 text-green-700">Novo ({result.content.length} chars)</strong>
                                                <p className="opacity-70 line-clamp-[20]">{result.content}</p>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-gray-400">
                            <RefreshCw className="w-12 h-12 mb-4 opacity-20" />
                            <p>O resultado da reescrita aparecerá aqui.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
