'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Check,
    Lightbulb,
    FileText,
    ImageIcon,
    Target,
    Tags,
    Calendar,
    Wand2,
    X,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
    generateAIPost,
    getKeywordSuggestions,
    checkAIConfiguration
} from '@/lib/actions/ai-posts'
import { savePost } from '@/lib/actions/cms-posts'
import { ImageSearchModal } from './ImageSearchModal'

interface AIPostWizardProps {
    categories: Array<{ id: string; name: string }>
    onClose?: () => void
    className?: string
}

type WizardStep = 'topic' | 'keywords' | 'generate' | 'review' | 'image' | 'publish'

interface GeneratedContent {
    title: string
    slug: string
    excerpt: string
    content: string
    metaDescription: string
    suggestedTags: string[]
    suggestedCategory?: string
    categoryId?: string
}

export function AIPostWizard({ categories, onClose, className }: AIPostWizardProps) {
    const router = useRouter()

    // Wizard state
    const [step, setStep] = useState<WizardStep>('topic')
    const [isConfigured, setIsConfigured] = useState(true)

    // Form state
    const [topic, setTopic] = useState('')
    const [tone, setTone] = useState<'professional' | 'casual' | 'formal' | 'friendly'>('professional')
    const [wordCount, setWordCount] = useState(800)
    const [additionalInstructions, setAdditionalInstructions] = useState('')

    // Keywords
    const [keywords, setKeywords] = useState<string[]>([])
    const [suggestedKeywords, setSuggestedKeywords] = useState<{
        primary: string[]
        secondary: string[]
        longTail: string[]
    } | null>(null)
    const [loadingKeywords, setLoadingKeywords] = useState(false)

    // Generated content
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Image
    const [coverImage, setCoverImage] = useState('')
    const [imageModalOpen, setImageModalOpen] = useState(false)

    // Publishing
    const [selectedCategory, setSelectedCategory] = useState('')
    const [tags, setTags] = useState<string[]>([])
    const [publishing, setPublishing] = useState(false)

    // Check configuration on mount
    React.useEffect(() => {
        checkAIConfiguration().then(config => {
            setIsConfigured(config.configured)
        })
    }, [])

    const steps: { key: WizardStep; label: string; icon: React.ElementType }[] = [
        { key: 'topic', label: 'Tópico', icon: Lightbulb },
        { key: 'keywords', label: 'Keywords', icon: Target },
        { key: 'generate', label: 'Gerar', icon: Wand2 },
        { key: 'review', label: 'Revisar', icon: FileText },
        { key: 'image', label: 'Imagem', icon: ImageIcon },
        { key: 'publish', label: 'Publicar', icon: Calendar }
    ]

    const currentStepIndex = steps.findIndex(s => s.key === step)

    const goToStep = (targetStep: WizardStep) => {
        const targetIndex = steps.findIndex(s => s.key === targetStep)
        if (targetIndex <= currentStepIndex) {
            setStep(targetStep)
        }
    }

    const handleGenerateKeywords = async () => {
        if (!topic.trim()) return

        setLoadingKeywords(true)
        setError(null)

        try {
            const result = await getKeywordSuggestions(topic)
            setSuggestedKeywords(result)
            // Auto-select primary keywords
            setKeywords(result.primary.slice(0, 3))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar keywords')
        } finally {
            setLoadingKeywords(false)
        }
    }

    const handleGenerate = async () => {
        setGenerating(true)
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

            setGeneratedContent(result)
            setTags(result.suggestedTags || [])
            if (result.categoryId) {
                setSelectedCategory(result.categoryId)
            }
            setStep('review')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao gerar conteúdo')
        } finally {
            setGenerating(false)
        }
    }

    const handlePublish = async (status: 'draft' | 'published') => {
        if (!generatedContent) return

        setPublishing(true)
        setError(null)

        try {
            const savedPost = await savePost({
                id: 'new',
                title: generatedContent.title,
                slug: generatedContent.slug,
                excerpt: generatedContent.excerpt,
                content: generatedContent.content,
                cover_image_url: coverImage,
                category_id: selectedCategory,
                status,
                published_at: status === 'published' ? new Date().toISOString().split('T')[0] : '',
                tags
            })

            router.push(`/cms/posts/${savedPost.id}`)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar post')
        } finally {
            setPublishing(false)
        }
    }

    const toggleKeyword = (keyword: string) => {
        setKeywords(prev =>
            prev.includes(keyword)
                ? prev.filter(k => k !== keyword)
                : [...prev, keyword]
        )
    }

    if (!isConfigured) {
        return (
            <div className={cn('p-8 text-center', className)}>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">IA Não Configurada</h2>
                <p className="text-gray-500 mb-4">
                    Para usar o assistente de IA, adicione sua chave do OpenRouter ao arquivo .env:
                </p>
                <code className="block bg-gray-100 p-3 rounded-lg text-sm mb-4">
                    OPENROUTER_API_KEY=sua-chave-aqui
                </code>
                <Button variant="outline" onClick={onClose}>
                    Fechar
                </Button>
            </div>
        )
    }

    return (
        <div className={cn('flex flex-col h-full', className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">AI Post Wizard</h2>
                        <p className="text-sm text-gray-500">Criar post com IA</p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b overflow-x-auto">
                {steps.map((s, i) => {
                    const Icon = s.icon
                    const isActive = s.key === step
                    const isCompleted = i < currentStepIndex
                    const isClickable = i < currentStepIndex

                    return (
                        <React.Fragment key={s.key}>
                            <button
                                onClick={() => isClickable && goToStep(s.key)}
                                disabled={!isClickable}
                                className={cn(
                                    'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
                                    isActive && 'bg-orange-100 text-orange-700',
                                    isCompleted && 'text-green-600',
                                    !isActive && !isCompleted && 'text-gray-400',
                                    isClickable && 'cursor-pointer hover:bg-gray-100'
                                )}
                            >
                                <div className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                                    isActive && 'bg-orange-500 text-white',
                                    isCompleted && 'bg-green-500 text-white',
                                    !isActive && !isCompleted && 'bg-gray-200 text-gray-500'
                                )}>
                                    {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                                </div>
                                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                            </button>
                            {i < steps.length - 1 && (
                                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                            )}
                        </React.Fragment>
                    )
                })}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {/* Step 1: Topic */}
                {step === 'topic' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Sobre o que você quer escrever?</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Descreva o tópico do seu post. Quanto mais detalhado, melhor será o resultado.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="topic">Tópico / Tema *</Label>
                                <Textarea
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: Benefícios da escovação elétrica para a saúde bucal"
                                    className="mt-1 min-h-[100px]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tom</Label>
                                    <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="professional">Profissional</SelectItem>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="friendly">Amigável</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Tamanho (palavras)</Label>
                                    <Select value={String(wordCount)} onValueChange={(v) => setWordCount(Number(v))}>
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="400">Curto (~400)</SelectItem>
                                            <SelectItem value="800">Médio (~800)</SelectItem>
                                            <SelectItem value="1200">Longo (~1200)</SelectItem>
                                            <SelectItem value="2000">Muito Longo (~2000)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="instructions">Instruções Adicionais (opcional)</Label>
                                <Textarea
                                    id="instructions"
                                    value={additionalInstructions}
                                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                                    placeholder="Ex: Incluir estatísticas recentes, mencionar produtos específicos..."
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Keywords */}
                {step === 'keywords' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Palavras-chave para SEO</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Selecione as palavras-chave que deseja focar no conteúdo.
                            </p>
                        </div>

                        {!suggestedKeywords && (
                            <Button
                                onClick={handleGenerateKeywords}
                                disabled={loadingKeywords}
                                className="w-full"
                            >
                                {loadingKeywords ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                )}
                                Sugerir Keywords com IA
                            </Button>
                        )}

                        {suggestedKeywords && (
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-green-600">Principais (recomendadas)</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {suggestedKeywords.primary.map((kw) => (
                                            <button
                                                key={kw}
                                                onClick={() => toggleKeyword(kw)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                                                    keywords.includes(kw)
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                )}
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-blue-600">Secundárias</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {suggestedKeywords.secondary.map((kw) => (
                                            <button
                                                key={kw}
                                                onClick={() => toggleKeyword(kw)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                                                    keywords.includes(kw)
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                                                )}
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-purple-600">Cauda Longa</Label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {suggestedKeywords.longTail.map((kw) => (
                                            <button
                                                key={kw}
                                                onClick={() => toggleKeyword(kw)}
                                                className={cn(
                                                    'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                                                    keywords.includes(kw)
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                                                )}
                                            >
                                                {kw}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {keywords.length > 0 && (
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <Label className="text-orange-700">Selecionadas ({keywords.length})</Label>
                                <p className="text-sm text-orange-600 mt-1">{keywords.join(', ')}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Generate */}
                {step === 'generate' && (
                    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                        {generating ? (
                            <>
                                <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Gerando seu post...</h3>
                                <p className="text-gray-500 text-sm">Isso pode levar alguns segundos</p>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-4">
                                    <Wand2 className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">Pronto para gerar!</h3>
                                <p className="text-gray-500 text-sm mb-6 max-w-md">
                                    A IA vai criar um post completo sobre "{topic}"
                                    {keywords.length > 0 && ` focando nas palavras-chave: ${keywords.slice(0, 3).join(', ')}`}
                                </p>
                                <Button onClick={handleGenerate} size="lg" className="gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Gerar Post com IA
                                </Button>
                            </>
                        )}
                    </div>
                )}

                {/* Step 4: Review */}
                {step === 'review' && generatedContent && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Revise o conteúdo gerado</h3>
                            <p className="text-gray-500 text-sm">
                                Você pode editar o conteúdo depois de publicar.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white border rounded-xl">
                                <Label className="text-gray-500 text-xs uppercase">Título</Label>
                                <h2 className="text-xl font-bold mt-1">{generatedContent.title}</h2>
                            </div>

                            <div className="p-4 bg-white border rounded-xl">
                                <Label className="text-gray-500 text-xs uppercase">Resumo</Label>
                                <p className="mt-1 text-gray-700">{generatedContent.excerpt}</p>
                            </div>

                            <div className="p-4 bg-white border rounded-xl">
                                <Label className="text-gray-500 text-xs uppercase">Conteúdo</Label>
                                <div
                                    className="mt-2 prose prose-sm max-w-none max-h-[300px] overflow-y-auto"
                                    dangerouslySetInnerHTML={{
                                        __html: generatedContent.content
                                            .replace(/\n/g, '<br>')
                                            .replace(/## (.*)/g, '<h2>$1</h2>')
                                            .replace(/### (.*)/g, '<h3>$1</h3>')
                                    }}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {generatedContent.suggestedTags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Image */}
                {step === 'image' && (
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Imagem de capa</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Escolha uma imagem para o seu post.
                            </p>
                        </div>

                        {coverImage ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border">
                                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-2 right-2"
                                    onClick={() => setCoverImage('')}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setImageModalOpen(true)}
                                className="w-full aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:border-orange-300 hover:bg-orange-50 transition-all"
                            >
                                <ImageIcon className="w-12 h-12 text-gray-300" />
                                <span className="text-gray-500">Clique para buscar imagens</span>
                            </button>
                        )}

                        <Button
                            variant="outline"
                            onClick={() => setImageModalOpen(true)}
                            className="w-full"
                        >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Buscar Imagens
                        </Button>

                        <ImageSearchModal
                            open={imageModalOpen}
                            onOpenChange={setImageModalOpen}
                            onSelectImage={setCoverImage}
                            initialQuery={topic}
                        />
                    </div>
                )}

                {/* Step 6: Publish */}
                {step === 'publish' && generatedContent && (
                    <div className="space-y-6 max-w-xl mx-auto">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Configurações finais</h3>
                            <p className="text-gray-500 text-sm mb-4">
                                Configure categoria e publique seu post.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label>Categoria</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Preview Card */}
                            <div className="p-4 bg-gray-50 rounded-xl border">
                                <h4 className="font-medium mb-3">Preview do Post</h4>
                                <div className="flex gap-4">
                                    {coverImage && (
                                        <img
                                            src={coverImage}
                                            alt=""
                                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <h5 className="font-bold truncate">{generatedContent.title}</h5>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                            {generatedContent.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-4 border-t bg-white">
                <Button
                    variant="ghost"
                    onClick={() => {
                        const prevIndex = currentStepIndex - 1
                        if (prevIndex >= 0) {
                            setStep(steps[prevIndex].key)
                        }
                    }}
                    disabled={currentStepIndex === 0}
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar
                </Button>

                <div className="flex gap-2">
                    {step === 'publish' ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handlePublish('draft')}
                                disabled={publishing}
                            >
                                {publishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Salvar Rascunho
                            </Button>
                            <Button
                                onClick={() => handlePublish('published')}
                                disabled={publishing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {publishing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Publicar Agora
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={() => {
                                if (step === 'topic' && topic.trim()) {
                                    setStep('keywords')
                                } else if (step === 'keywords') {
                                    setStep('generate')
                                } else if (step === 'review') {
                                    setStep('image')
                                } else if (step === 'image') {
                                    setStep('publish')
                                }
                            }}
                            disabled={
                                (step === 'topic' && !topic.trim()) ||
                                (step === 'keywords' && loadingKeywords) ||
                                (step === 'generate' && generating)
                            }
                        >
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
