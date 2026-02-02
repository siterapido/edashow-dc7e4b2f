'use client'

import React, { useState, useCallback } from 'react'
import {
  Sparkles,
  FileText,
  Heading,
  Search,
  Tags,
  Loader2,
  Check,
  X,
  AlertCircle,
  Copy,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getAIExcerpt,
  getAITitles,
  getAITags,
  analyzPostSEO,
  autoCategorizeContent
} from '@/lib/actions/ai-posts'

interface AIToolsPanelProps {
  title: string
  content: string
  excerpt: string
  onExcerptChange: (excerpt: string) => void
  onTitleChange: (title: string) => void
  onTagsChange?: (tags: string[]) => void
  onCategoryChange?: (categoryId: string) => void
  categories?: Array<{ id: string; name: string }>
  onClose: () => void
}

type Tool = 'excerpt' | 'titles' | 'seo' | 'tags' | 'categorize'

export function AIToolsPanel({
  title,
  content,
  excerpt,
  onExcerptChange,
  onTitleChange,
  onTagsChange,
  onCategoryChange,
  categories,
  onClose
}: AIToolsPanelProps) {
  const [activeTool, setActiveTool] = useState<Tool | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Results
  const [generatedExcerpt, setGeneratedExcerpt] = useState<string | null>(null)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [seoAnalysis, setSeoAnalysis] = useState<any>(null)
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [suggestedCategory, setSuggestedCategory] = useState<{ category: string; categoryId?: string } | null>(null)

  // Tool handlers
  const handleGenerateExcerpt = useCallback(async () => {
    if (!content || content.length < 50) {
      setError('O conteudo precisa ter pelo menos 50 caracteres')
      return
    }

    setIsLoading(true)
    setError(null)
    setActiveTool('excerpt')

    try {
      const result = await getAIExcerpt(content, 160)
      setGeneratedExcerpt(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar resumo')
    } finally {
      setIsLoading(false)
    }
  }, [content])

  const handleGenerateTitles = useCallback(async () => {
    if (!content || content.length < 50) {
      setError('O conteudo precisa ter pelo menos 50 caracteres')
      return
    }

    setIsLoading(true)
    setError(null)
    setActiveTool('titles')

    try {
      const result = await getAITitles(title || 'Sem titulo', [], 5)
      setGeneratedTitles(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar titulos')
    } finally {
      setIsLoading(false)
    }
  }, [content, title])

  const handleAnalyzeSEO = useCallback(async () => {
    if (!title || !content) {
      setError('Titulo e conteudo sao necessarios para analise SEO')
      return
    }

    setIsLoading(true)
    setError(null)
    setActiveTool('seo')

    try {
      const result = await analyzPostSEO(title, content, [], excerpt)
      setSeoAnalysis(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na analise SEO')
    } finally {
      setIsLoading(false)
    }
  }, [title, content, excerpt])

  const handleGenerateTags = useCallback(async () => {
    if (!title || !content) {
      setError('Titulo e conteudo sao necessarios')
      return
    }

    setIsLoading(true)
    setError(null)
    setActiveTool('tags')

    try {
      const result = await getAITags(title, content)
      setGeneratedTags(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar tags')
    } finally {
      setIsLoading(false)
    }
  }, [title, content])

  const handleAutoCategorize = useCallback(async () => {
    if (!title || !content) {
      setError('Titulo e conteudo sao necessarios')
      return
    }

    setIsLoading(true)
    setError(null)
    setActiveTool('categorize')

    try {
      const result = await autoCategorizeContent(title, content, excerpt)
      setSuggestedCategory({
        category: result.category,
        categoryId: result.categoryId
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao categorizar')
    } finally {
      setIsLoading(false)
    }
  }, [title, content, excerpt])

  // Use result handlers
  const handleUseExcerpt = () => {
    if (generatedExcerpt) {
      onExcerptChange(generatedExcerpt)
      setGeneratedExcerpt(null)
      setActiveTool(null)
    }
  }

  const handleUseTitle = (newTitle: string) => {
    onTitleChange(newTitle)
    setGeneratedTitles([])
    setActiveTool(null)
  }

  const handleUseTags = () => {
    if (generatedTags.length > 0 && onTagsChange) {
      onTagsChange(generatedTags)
      setGeneratedTags([])
      setActiveTool(null)
    }
  }

  const handleUseCategory = () => {
    if (suggestedCategory?.categoryId && onCategoryChange) {
      onCategoryChange(suggestedCategory.categoryId)
      setSuggestedCategory(null)
      setActiveTool(null)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Ferramentas de IA</h2>
              <p className="text-sm text-gray-500">Otimize seu conteudo com inteligencia artificial</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tools Grid */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <ToolButton
              icon={FileText}
              label="Gerar Resumo"
              onClick={handleGenerateExcerpt}
              isActive={activeTool === 'excerpt'}
              isLoading={isLoading && activeTool === 'excerpt'}
            />
            <ToolButton
              icon={Heading}
              label="Sugerir Titulos"
              onClick={handleGenerateTitles}
              isActive={activeTool === 'titles'}
              isLoading={isLoading && activeTool === 'titles'}
            />
            <ToolButton
              icon={Search}
              label="Analise SEO"
              onClick={handleAnalyzeSEO}
              isActive={activeTool === 'seo'}
              isLoading={isLoading && activeTool === 'seo'}
            />
            <ToolButton
              icon={Tags}
              label="Gerar Tags"
              onClick={handleGenerateTags}
              isActive={activeTool === 'tags'}
              isLoading={isLoading && activeTool === 'tags'}
            />
            <ToolButton
              icon={Target}
              label="Categorizar"
              onClick={handleAutoCategorize}
              isActive={activeTool === 'categorize'}
              isLoading={isLoading && activeTool === 'categorize'}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-500" />
              <p>Processando com IA...</p>
            </div>
          )}

          {/* Excerpt Result */}
          {!isLoading && activeTool === 'excerpt' && generatedExcerpt && (
            <ResultCard
              title="Resumo Gerado"
              icon={FileText}
              onUse={handleUseExcerpt}
              onRefresh={handleGenerateExcerpt}
            >
              <p className="text-gray-700 leading-relaxed">{generatedExcerpt}</p>
              <p className="text-xs text-gray-400 mt-2">{generatedExcerpt.length} caracteres</p>
            </ResultCard>
          )}

          {/* Titles Result */}
          {!isLoading && activeTool === 'titles' && generatedTitles.length > 0 && (
            <ResultCard
              title="Titulos Sugeridos"
              icon={Heading}
              onRefresh={handleGenerateTitles}
            >
              <div className="space-y-2">
                {generatedTitles.map((suggestedTitle, i) => (
                  <button
                    key={i}
                    onClick={() => handleUseTitle(suggestedTitle)}
                    className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-gray-700 group-hover:text-purple-700">{suggestedTitle}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ResultCard>
          )}

          {/* SEO Analysis Result */}
          {!isLoading && activeTool === 'seo' && seoAnalysis && (
            <ResultCard
              title="Analise SEO"
              icon={Search}
              onRefresh={handleAnalyzeSEO}
            >
              <div className="space-y-4">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "text-3xl font-bold px-4 py-2 rounded-xl",
                    getScoreColor(seoAnalysis.score || 0)
                  )}>
                    {seoAnalysis.score || 0}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Pontuacao SEO</p>
                    <p className="text-sm text-gray-500">
                      {seoAnalysis.score >= 80 ? 'Excelente!' : seoAnalysis.score >= 60 ? 'Bom, mas pode melhorar' : 'Precisa de atencao'}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                {seoAnalysis.recommendations && seoAnalysis.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      Recomendacoes
                    </p>
                    <ul className="space-y-1.5">
                      {seoAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ResultCard>
          )}

          {/* Tags Result */}
          {!isLoading && activeTool === 'tags' && generatedTags.length > 0 && (
            <ResultCard
              title="Tags Sugeridas"
              icon={Tags}
              onUse={onTagsChange ? handleUseTags : undefined}
              onRefresh={handleGenerateTags}
            >
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </ResultCard>
          )}

          {/* Categorize Result */}
          {!isLoading && activeTool === 'categorize' && suggestedCategory && (
            <ResultCard
              title="Categoria Sugerida"
              icon={Target}
              onUse={onCategoryChange && suggestedCategory.categoryId ? handleUseCategory : undefined}
              onRefresh={handleAutoCategorize}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{suggestedCategory.category}</p>
                  {suggestedCategory.categoryId && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Categoria encontrada no sistema
                    </p>
                  )}
                  {!suggestedCategory.categoryId && (
                    <p className="text-sm text-yellow-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Categoria nao cadastrada
                    </p>
                  )}
                </div>
              </div>
            </ResultCard>
          )}

          {/* Empty State */}
          {!isLoading && !activeTool && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-medium">Selecione uma ferramenta acima</p>
              <p className="text-sm">para comecar a otimizar seu conteudo</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500">
            Powered by OpenRouter AI
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

// Tool Button Component
function ToolButton({
  icon: Icon,
  label,
  onClick,
  isActive,
  isLoading
}: {
  icon: React.ElementType
  label: string
  onClick: () => void
  isActive?: boolean
  isLoading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
        isActive
          ? "border-purple-300 bg-purple-50 text-purple-700"
          : "border-gray-100 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50/50"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Icon className="w-5 h-5" />
      )}
      <span className="text-xs font-medium text-center leading-tight">{label}</span>
    </button>
  )
}

// Result Card Component
function ResultCard({
  title,
  icon: Icon,
  children,
  onUse,
  onRefresh
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  onUse?: () => void
  onRefresh?: () => void
}) {
  return (
    <div className="bg-gradient-to-br from-purple-50/50 to-white border border-purple-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-purple-600" />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              title="Gerar novamente"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onUse && (
            <button
              onClick={onUse}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500 text-white text-sm font-medium rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Usar
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

export default AIToolsPanel
