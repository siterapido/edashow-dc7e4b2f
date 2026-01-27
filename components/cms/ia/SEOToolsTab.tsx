'use client'

import React, { useState } from 'react'
import {
    Search,
    Loader2,
    AlertCircle,
    CheckCircle,
    AlertTriangle,
    Info,
    Tag,
    FileText,
    TrendingUp,
    Copy,
    Check,
    Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
    analyzPostSEO,
    getOptimizedMeta,
    getKeywordSuggestions,
    analyzeContentTopic,
    checkAIConfiguration
} from '@/lib/actions/ai-posts'

type ToolMode = 'analyzer' | 'meta' | 'keywords'

interface SEOAnalysis {
    score: number
    issues: Array<{
        type: 'error' | 'warning' | 'info'
        message: string
        fix?: string
    }>
    suggestions: string[]
    readabilityScore: number
    keywordDensity: Record<string, number>
}

interface OptimizedMeta {
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    keywords: string[]
}

interface KeywordPlan {
    primary: string[]
    secondary: string[]
    longTail: string[]
    topicAnalysis?: {
        mainTopic: string
        relatedTopics: string[]
        searchIntent: string
        difficulty: string
        suggestedAngle: string
    }
}

export function SEOToolsTab() {
    const [mode, setMode] = useState<ToolMode>('analyzer')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState<string | null>(null)

    // Analyzer state
    const [analyzerTitle, setAnalyzerTitle] = useState('')
    const [analyzerContent, setAnalyzerContent] = useState('')
    const [analyzerKeywords, setAnalyzerKeywords] = useState('')
    const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)

    // Meta generator state
    const [metaTitle, setMetaTitle] = useState('')
    const [metaContent, setMetaContent] = useState('')
    const [metaKeywords, setMetaKeywords] = useState('')
    const [optimizedMeta, setOptimizedMeta] = useState<OptimizedMeta | null>(null)

    // Keyword planner state
    const [keywordTopic, setKeywordTopic] = useState('')
    const [keywordPlan, setKeywordPlan] = useState<KeywordPlan | null>(null)

    // Analyze SEO
    const handleAnalyzeSEO = async () => {
        if (!analyzerTitle.trim() || !analyzerContent.trim()) {
            setError('Preencha o título e o conteúdo')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const config = await checkAIConfiguration()
            if (!config.configured) {
                setError('API de IA não configurada')
                return
            }

            const keywords = analyzerKeywords.split(',').map(k => k.trim()).filter(Boolean)
            const result = await analyzPostSEO(analyzerTitle, analyzerContent, keywords)
            setSeoAnalysis(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao analisar SEO')
        } finally {
            setIsLoading(false)
        }
    }

    // Generate meta tags
    const handleGenerateMeta = async () => {
        if (!metaTitle.trim() || !metaContent.trim()) {
            setError('Preencha o título e o conteúdo')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const config = await checkAIConfiguration()
            if (!config.configured) {
                setError('API de IA não configurada')
                return
            }

            const keywords = metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
            const result = await getOptimizedMeta(metaTitle, metaContent, keywords)
            setOptimizedMeta(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar meta tags')
        } finally {
            setIsLoading(false)
        }
    }

    // Plan keywords
    const handlePlanKeywords = async () => {
        if (!keywordTopic.trim()) {
            setError('Informe o tópico')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const config = await checkAIConfiguration()
            if (!config.configured) {
                setError('API de IA não configurada')
                return
            }

            const [keywords, analysis] = await Promise.all([
                getKeywordSuggestions(keywordTopic),
                analyzeContentTopic(keywordTopic)
            ])

            setKeywordPlan({
                ...keywords,
                topicAnalysis: analysis
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao planejar keywords')
        } finally {
            setIsLoading(false)
        }
    }

    // Copy to clipboard
    const handleCopy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 2000)
    }

    // Get score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Tool Selection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => setMode('analyzer')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            mode === 'analyzer'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <Search className="w-4 h-4" />
                        Analisador SEO
                    </button>
                    <button
                        onClick={() => setMode('meta')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            mode === 'meta'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <Tag className="w-4 h-4" />
                        Gerador de Meta Tags
                    </button>
                    <button
                        onClick={() => setMode('keywords')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            mode === 'keywords'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <TrendingUp className="w-4 h-4" />
                        Planejador de Keywords
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* SEO Analyzer */}
            {mode === 'analyzer' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analisar Conteúdo</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                <Input
                                    value={analyzerTitle}
                                    onChange={(e) => setAnalyzerTitle(e.target.value)}
                                    placeholder="Título do artigo..."
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                                <Textarea
                                    value={analyzerContent}
                                    onChange={(e) => setAnalyzerContent(e.target.value)}
                                    placeholder="Cole o conteúdo do artigo..."
                                    className="min-h-[150px] bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Palavras-chave alvo (separadas por vírgula)
                                </label>
                                <Input
                                    value={analyzerKeywords}
                                    onChange={(e) => setAnalyzerKeywords(e.target.value)}
                                    placeholder="clareamento dental, odontologia estética..."
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleAnalyzeSEO}
                                    disabled={isLoading}
                                    className="bg-orange-500 hover:bg-orange-600"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Search className="w-4 h-4 mr-2" />
                                    )}
                                    Analisar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Results */}
                    {seoAnalysis && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Score SEO</h3>
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-32">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke="#e5e7eb"
                                                strokeWidth="12"
                                            />
                                            <circle
                                                cx="64"
                                                cy="64"
                                                r="56"
                                                fill="none"
                                                stroke={seoAnalysis.score >= 80 ? '#22c55e' : seoAnalysis.score >= 60 ? '#eab308' : '#ef4444'}
                                                strokeWidth="12"
                                                strokeDasharray={`${(seoAnalysis.score / 100) * 352} 352`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={cn("text-3xl font-bold", getScoreColor(seoAnalysis.score))}>
                                                {seoAnalysis.score}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-500">Legibilidade: {seoAnalysis.readabilityScore}/100</p>
                                </div>
                            </div>

                            {/* Issues */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Problemas Encontrados</h3>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                                    {seoAnalysis.issues.map((issue, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "p-3 rounded-lg flex items-start gap-3",
                                                issue.type === 'error' && "bg-red-50",
                                                issue.type === 'warning' && "bg-yellow-50",
                                                issue.type === 'info' && "bg-blue-50"
                                            )}
                                        >
                                            {issue.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                                            {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />}
                                            {issue.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                                            <div>
                                                <p className="text-sm text-gray-900">{issue.message}</p>
                                                {issue.fix && (
                                                    <p className="text-xs text-gray-500 mt-1">Sugestão: {issue.fix}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {seoAnalysis.issues.length === 0 && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-sm">Nenhum problema encontrado!</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Suggestions */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:col-span-3">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Sugestões de Melhoria</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {seoAnalysis.suggestions.map((suggestion, index) => (
                                        <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                            <Sparkles className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700">{suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Meta Tag Generator */}
            {mode === 'meta' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gerar Meta Tags</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Título atual</label>
                                <Input
                                    value={metaTitle}
                                    onChange={(e) => setMetaTitle(e.target.value)}
                                    placeholder="Título do artigo..."
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                                <Textarea
                                    value={metaContent}
                                    onChange={(e) => setMetaContent(e.target.value)}
                                    placeholder="Cole o início do conteúdo..."
                                    className="min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Palavras-chave (separadas por vírgula)
                                </label>
                                <Input
                                    value={metaKeywords}
                                    onChange={(e) => setMetaKeywords(e.target.value)}
                                    placeholder="clareamento dental, odontologia..."
                                    className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleGenerateMeta}
                                    disabled={isLoading}
                                    className="bg-orange-500 hover:bg-orange-600"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Tag className="w-4 h-4 mr-2" />
                                    )}
                                    Gerar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Generated Meta Tags */}
                    {optimizedMeta && (
                        <div className="space-y-4">
                            {/* Google Preview */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Preview no Google</h3>
                                <div className="p-4 bg-gray-50 rounded-lg max-w-xl">
                                    <p className="text-blue-700 text-lg hover:underline cursor-pointer truncate">
                                        {optimizedMeta.title}
                                    </p>
                                    <p className="text-green-700 text-sm">www.edashow.com.br › artigo</p>
                                    <p className="text-gray-600 text-sm line-clamp-2">{optimizedMeta.description}</p>
                                </div>
                            </div>

                            {/* Meta Tags */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Meta Tags Geradas</h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Title', value: optimizedMeta.title, key: 'title' },
                                        { label: 'Description', value: optimizedMeta.description, key: 'desc' },
                                        { label: 'OG Title', value: optimizedMeta.ogTitle, key: 'ogTitle' },
                                        { label: 'OG Description', value: optimizedMeta.ogDescription, key: 'ogDesc' }
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-start gap-4">
                                            <span className="text-sm font-medium text-gray-500 w-28 shrink-0">
                                                {item.label}
                                            </span>
                                            <div className="flex-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                                {item.value}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCopy(item.value, item.key)}
                                            >
                                                {copied === item.key ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex items-start gap-4">
                                        <span className="text-sm font-medium text-gray-500 w-28 shrink-0">Keywords</span>
                                        <div className="flex-1 flex flex-wrap gap-2">
                                            {optimizedMeta.keywords.map((kw) => (
                                                <span key={kw} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Keyword Planner */}
            {mode === 'keywords' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Planejar Palavras-chave</h2>
                        <div className="flex gap-3">
                            <Input
                                value={keywordTopic}
                                onChange={(e) => setKeywordTopic(e.target.value)}
                                placeholder="Sobre qual tópico você quer escrever?"
                                className="flex-1 bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                            />
                            <Button
                                onClick={handlePlanKeywords}
                                disabled={isLoading}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                )}
                                Analisar
                            </Button>
                        </div>
                    </div>

                    {/* Keyword Plan Results */}
                    {keywordPlan && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Topic Analysis */}
                            {keywordPlan.topicAnalysis && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Análise do Tópico</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Tópico Principal</p>
                                            <p className="text-sm font-medium text-gray-900">{keywordPlan.topicAnalysis.mainTopic}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Intenção de Busca</p>
                                            <p className="text-sm font-medium text-gray-900 capitalize">
                                                {keywordPlan.topicAnalysis.searchIntent}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Dificuldade</p>
                                            <p className={cn(
                                                "text-sm font-medium capitalize",
                                                keywordPlan.topicAnalysis.difficulty === 'low' && "text-green-600",
                                                keywordPlan.topicAnalysis.difficulty === 'medium' && "text-yellow-600",
                                                keywordPlan.topicAnalysis.difficulty === 'high' && "text-red-600"
                                            )}>
                                                {keywordPlan.topicAnalysis.difficulty === 'low' && 'Baixa'}
                                                {keywordPlan.topicAnalysis.difficulty === 'medium' && 'Média'}
                                                {keywordPlan.topicAnalysis.difficulty === 'high' && 'Alta'}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Ângulo Sugerido</p>
                                            <p className="text-sm font-medium text-gray-900">{keywordPlan.topicAnalysis.suggestedAngle}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500 mb-2">Tópicos Relacionados</p>
                                        <div className="flex flex-wrap gap-2">
                                            {keywordPlan.topicAnalysis.relatedTopics.map((topic) => (
                                                <span key={topic} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Primary Keywords */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                                    <h3 className="text-sm font-medium text-gray-900">Palavras-chave Principais</h3>
                                </div>
                                <div className="space-y-2">
                                    {keywordPlan.primary.map((kw) => (
                                        <div key={kw} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                            <span className="text-sm text-gray-900">{kw}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(kw, `primary-${kw}`)}
                                            >
                                                {copied === `primary-${kw}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Keywords */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-medium text-gray-900">Palavras-chave Secundárias</h3>
                                </div>
                                <div className="space-y-2">
                                    {keywordPlan.secondary.map((kw) => (
                                        <div key={kw} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <span className="text-sm text-gray-900">{kw}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(kw, `secondary-${kw}`)}
                                            >
                                                {copied === `secondary-${kw}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Long-tail Keywords */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:col-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                    <h3 className="text-sm font-medium text-gray-900">Palavras-chave Long-tail</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {keywordPlan.longTail.map((kw) => (
                                        <div key={kw} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <span className="text-sm text-gray-900">{kw}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCopy(kw, `longtail-${kw}`)}
                                            >
                                                {copied === `longtail-${kw}` ? (
                                                    <Check className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
