'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles,
    Loader2,
    ChevronRight,
    ChevronLeft,
    Lightbulb,
    Settings2,
    FileText,
    Send,
    Check,
    Plus,
    X,
    Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
    generateAIPost,
    getKeywordSuggestions,
    checkAIConfiguration
} from '@/lib/actions/ai-posts'

type ToneType = 'professional' | 'casual' | 'formal' | 'friendly'

interface GeneratedPost {
    title: string
    slug: string
    excerpt: string
    content: string
    metaDescription: string
    suggestedTags: string[]
    suggestedCategory?: string
    categoryId?: string
    seoScore?: number
}

const toneOptions: Array<{ id: ToneType; label: string; description: string }> = [
    { id: 'professional', label: 'Profissional', description: 'Tom sério e informativo' },
    { id: 'casual', label: 'Casual', description: 'Conversa amigável e descontraída' },
    { id: 'formal', label: 'Formal', description: 'Linguagem técnica e acadêmica' },
    { id: 'friendly', label: 'Amigável', description: 'Acolhedor e acessível' }
]

const wordCountOptions = [
    { value: 500, label: 'Curto', description: '~500 palavras' },
    { value: 800, label: 'Médio', description: '~800 palavras' },
    { value: 1200, label: 'Longo', description: '~1200 palavras' },
    { value: 2000, label: 'Extenso', description: '~2000 palavras' }
]

export function GeneratePostTab() {
    const router = useRouter()

    // Wizard state
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingKeywords, setIsLoadingKeywords] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Step 1: Topic & Keywords
    const [topic, setTopic] = useState('')
    const [keywords, setKeywords] = useState<string[]>([])
    const [keywordInput, setKeywordInput] = useState('')
    const [suggestedKeywords, setSuggestedKeywords] = useState<{
        primary: string[]
        secondary: string[]
        longTail: string[]
    } | null>(null)

    // Step 2: Configuration
    const [tone, setTone] = useState<ToneType>('professional')
    const [wordCount, setWordCount] = useState(800)
    const [additionalInstructions, setAdditionalInstructions] = useState('')

    // Step 3 & 4: Generation
    const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    // Add keyword manually
    const handleAddKeyword = () => {
        if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
            setKeywords([...keywords, keywordInput.trim()])
            setKeywordInput('')
        }
    }

    // Remove keyword
    const handleRemoveKeyword = (keyword: string) => {
        setKeywords(keywords.filter(k => k !== keyword))
    }

    // Toggle suggested keyword
    const toggleSuggestedKeyword = (keyword: string) => {
        if (keywords.includes(keyword)) {
            handleRemoveKeyword(keyword)
        } else {
            setKeywords([...keywords, keyword])
        }
    }

    // Get keyword suggestions
    const handleSuggestKeywords = async () => {
        if (!topic.trim()) return

        setIsLoadingKeywords(true)
        setError(null)

        try {
            const config = await checkAIConfiguration()
            if (!config.configured) {
                setError('API de IA não configurada. Configure a OPENROUTER_API_KEY.')
                return
            }

            const suggestions = await getKeywordSuggestions(topic)
            setSuggestedKeywords(suggestions)

            // Auto-select primary keywords
            if (suggestions.primary.length > 0) {
                setKeywords(prev => {
                    const newKeywords = [...prev]
                    for (const kw of suggestions.primary) {
                        if (!newKeywords.includes(kw)) {
                            newKeywords.push(kw)
                        }
                    }
                    return newKeywords
                })
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao sugerir keywords')
        } finally {
            setIsLoadingKeywords(false)
        }
    }

    // Generate post
    const handleGenerate = async () => {
        setIsGenerating(true)
        setError(null)

        try {
            const result = await generateAIPost({
                topic,
                keywords,
                tone,
                wordCount,
                additionalInstructions,
                autoCategorize: true
            })

            setGeneratedPost(result)
            setStep(4)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar post')
        } finally {
            setIsGenerating(false)
        }
    }

    // Send to editor
    const handleSendToEditor = () => {
        if (!generatedPost) return

        // Save to sessionStorage
        sessionStorage.setItem('ai_generated_post', JSON.stringify(generatedPost))

        // Redirect to new post page
        router.push('/cms/posts/new?fromAI=true')
    }

    // Step indicators
    const steps = [
        { number: 1, label: 'Tópico', icon: Lightbulb },
        { number: 2, label: 'Configuração', icon: Settings2 },
        { number: 3, label: 'Geração', icon: Wand2 },
        { number: 4, label: 'Revisão', icon: FileText }
    ]

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((s, index) => {
                        const Icon = s.icon
                        const isActive = step === s.number
                        const isCompleted = step > s.number
                        return (
                            <React.Fragment key={s.number}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                            isActive && "bg-orange-500 text-white shadow-lg",
                                            isCompleted && "bg-green-500 text-white",
                                            !isActive && !isCompleted && "bg-gray-200 text-gray-500"
                                        )}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <span className={cn(
                                        "text-xs mt-2 font-medium",
                                        isActive && "text-orange-600",
                                        isCompleted && "text-green-600",
                                        !isActive && !isCompleted && "text-gray-500"
                                    )}>
                                        {s.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-1 mx-2 rounded",
                                        step > s.number ? "bg-green-500" : "bg-gray-200"
                                    )} />
                                )}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Step 1: Topic & Keywords */}
            {step === 1 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Sobre o que você quer escrever?</h2>
                        <p className="text-sm text-gray-500">Descreva o tópico principal do seu artigo</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tópico</label>
                        <Textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ex: Os benefícios do clareamento dental para a autoestima..."
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500 min-h-[100px]"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Palavras-chave</label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSuggestKeywords}
                                disabled={!topic.trim() || isLoadingKeywords}
                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                                {isLoadingKeywords ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Sparkles className="w-4 h-4 mr-2" />
                                )}
                                Sugerir Keywords
                            </Button>
                        </div>

                        <div className="flex gap-2 mb-3">
                            <Input
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                placeholder="Digite uma palavra-chave..."
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                            />
                            <Button variant="outline" onClick={handleAddKeyword}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Selected Keywords */}
                        {keywords.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {keywords.map((kw) => (
                                    <span
                                        key={kw}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                                    >
                                        {kw}
                                        <button onClick={() => handleRemoveKeyword(kw)} className="hover:text-orange-900">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Suggested Keywords */}
                        {suggestedKeywords && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                                <p className="text-sm font-medium text-gray-700">Sugestões da IA:</p>

                                {suggestedKeywords.primary.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Principais</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedKeywords.primary.map((kw) => (
                                                <button
                                                    key={kw}
                                                    onClick={() => toggleSuggestedKeyword(kw)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-sm transition-colors",
                                                        keywords.includes(kw)
                                                            ? "bg-orange-500 text-white"
                                                            : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                                                    )}
                                                >
                                                    {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {suggestedKeywords.secondary.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Secundárias</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedKeywords.secondary.map((kw) => (
                                                <button
                                                    key={kw}
                                                    onClick={() => toggleSuggestedKeyword(kw)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-sm transition-colors",
                                                        keywords.includes(kw)
                                                            ? "bg-orange-500 text-white"
                                                            : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                                                    )}
                                                >
                                                    {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {suggestedKeywords.longTail.length > 0 && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Long-tail</p>
                                        <div className="flex flex-wrap gap-2">
                                            {suggestedKeywords.longTail.map((kw) => (
                                                <button
                                                    key={kw}
                                                    onClick={() => toggleSuggestedKeyword(kw)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-sm transition-colors",
                                                        keywords.includes(kw)
                                                            ? "bg-orange-500 text-white"
                                                            : "bg-white border border-gray-200 text-gray-700 hover:border-orange-300"
                                                    )}
                                                >
                                                    {kw}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => setStep(2)}
                            disabled={!topic.trim()}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            Continuar
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Configuration */}
            {step === 2 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Configure a geração</h2>
                        <p className="text-sm text-gray-500">Escolha o tom e tamanho do artigo</p>
                    </div>

                    {/* Tone Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tom de voz</label>
                        <div className="grid grid-cols-2 gap-3">
                            {toneOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setTone(option.id)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 text-left transition-all",
                                        tone === option.id
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-300"
                                    )}
                                >
                                    <p className={cn(
                                        "font-medium",
                                        tone === option.id ? "text-orange-700" : "text-gray-900"
                                    )}>
                                        {option.label}
                                    </p>
                                    <p className="text-sm text-gray-500">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Word Count */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tamanho do artigo</label>
                        <div className="grid grid-cols-4 gap-3">
                            {wordCountOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setWordCount(option.value)}
                                    className={cn(
                                        "p-3 rounded-xl border-2 text-center transition-all",
                                        wordCount === option.value
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-300"
                                    )}
                                >
                                    <p className={cn(
                                        "font-medium",
                                        wordCount === option.value ? "text-orange-700" : "text-gray-900"
                                    )}>
                                        {option.label}
                                    </p>
                                    <p className="text-xs text-gray-500">{option.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Additional Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instruções adicionais (opcional)
                        </label>
                        <Textarea
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                            placeholder="Ex: Incluir estatísticas recentes, mencionar benefícios para pacientes idosos..."
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500 min-h-[80px]"
                        />
                    </div>

                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(1)}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                        <Button
                            onClick={() => {
                                setStep(3)
                                handleGenerate()
                            }}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Gerar Artigo
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Generation (Loading) */}
            {step === 3 && isGenerating && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Gerando seu artigo...</h2>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        A IA está criando um artigo sobre "{topic}" com aproximadamente {wordCount} palavras.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                        {keywords.slice(0, 5).map((kw) => (
                            <span key={kw} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                                {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && generatedPost && (
                <div className="space-y-6">
                    {/* Summary Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <span className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                                    Artigo Gerado
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 mt-1">{generatedPost.title}</h2>
                            </div>
                            {generatedPost.seoScore && (
                                <div className="text-center">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold",
                                        generatedPost.seoScore >= 80 ? "bg-green-500" :
                                            generatedPost.seoScore >= 60 ? "bg-yellow-500" : "bg-red-500"
                                    )}>
                                        {generatedPost.seoScore}
                                    </div>
                                    <span className="text-xs text-gray-500">SEO</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{generatedPost.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                            {generatedPost.suggestedTags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-white/70 text-gray-600 rounded text-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content Preview */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Conteúdo</h3>
                        </div>
                        <div className="p-6 prose prose-sm max-w-none max-h-[400px] overflow-y-auto">
                            <div dangerouslySetInnerHTML={{
                                __html: generatedPost.content
                                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                    .replace(/\n/g, '<br />')
                            }} />
                        </div>
                    </div>

                    {/* Meta Description */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Meta Description</h3>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {generatedPost.metaDescription}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            {generatedPost.metaDescription.length}/160 caracteres
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between">
                        <Button variant="outline" onClick={() => setStep(2)}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Voltar e Ajustar
                        </Button>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => {
                                setStep(3)
                                handleGenerate()
                            }}>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Gerar Novamente
                            </Button>
                            <Button
                                onClick={handleSendToEditor}
                                className="bg-orange-500 hover:bg-orange-600"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar para Editor
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
