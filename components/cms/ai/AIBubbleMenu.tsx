'use client'

import React, { useState, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import {
  Wand2,
  Expand,
  Shrink,
  Languages,
  Sparkles,
  CheckCircle,
  RefreshCw,
  ChevronDown,
  Loader2,
  Undo2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  aiRewrite,
  aiExpand,
  aiSummarize,
  aiTranslate,
  aiAdjustTone,
  aiFixGrammar,
  aiQuickImprove
} from '@/lib/actions/ai-inline'

interface AIBubbleMenuProps {
  editor: Editor
  className?: string
}

type RewriteStyle = 'more_formal' | 'more_casual' | 'more_concise' | 'more_detailed' | 'different'
type ToneType = 'formal' | 'casual' | 'professional' | 'friendly' | 'academic'
type TranslateLanguage = 'en' | 'es' | 'pt' | 'fr' | 'de'

export function AIBubbleMenu({ editor, className }: AIBubbleMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [showRewriteMenu, setShowRewriteMenu] = useState(false)
  const [showToneMenu, setShowToneMenu] = useState(false)
  const [showTranslateMenu, setShowTranslateMenu] = useState(false)
  const [lastOriginal, setLastOriginal] = useState<string | null>(null)
  const [lastSelection, setLastSelection] = useState<{ from: number; to: number } | null>(null)

  const getSelectedText = useCallback(() => {
    const { from, to } = editor.state.selection
    return editor.state.doc.textBetween(from, to, ' ')
  }, [editor])

  const replaceSelection = useCallback((newText: string) => {
    const { from, to } = editor.state.selection
    editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, newText).run()
  }, [editor])

  const handleAIAction = useCallback(async (
    action: () => Promise<{ result: string; original: string }>,
    actionName: string
  ) => {
    const selectedText = getSelectedText()
    if (!selectedText.trim()) return

    setIsLoading(true)
    setLoadingAction(actionName)
    setShowRewriteMenu(false)
    setShowToneMenu(false)
    setShowTranslateMenu(false)

    try {
      // Store original for undo
      const { from, to } = editor.state.selection
      setLastOriginal(selectedText)
      setLastSelection({ from, to })

      const result = await action()
      replaceSelection(result.result)
    } catch (error) {
      console.error(`AI ${actionName} error:`, error)
      alert(`Erro ao processar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsLoading(false)
      setLoadingAction(null)
    }
  }, [editor, getSelectedText, replaceSelection])

  const handleRewrite = useCallback((style: RewriteStyle) => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiRewrite(selectedText, style),
      'rewrite'
    )
  }, [getSelectedText, handleAIAction])

  const handleExpand = useCallback(() => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiExpand(selectedText),
      'expand'
    )
  }, [getSelectedText, handleAIAction])

  const handleSummarize = useCallback(() => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiSummarize(selectedText),
      'summarize'
    )
  }, [getSelectedText, handleAIAction])

  const handleTranslate = useCallback((lang: TranslateLanguage) => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiTranslate(selectedText, lang),
      'translate'
    )
  }, [getSelectedText, handleAIAction])

  const handleTone = useCallback((tone: ToneType) => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiAdjustTone(selectedText, tone),
      'tone'
    )
  }, [getSelectedText, handleAIAction])

  const handleFixGrammar = useCallback(() => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiFixGrammar(selectedText),
      'grammar'
    )
  }, [getSelectedText, handleAIAction])

  const handleQuickImprove = useCallback(() => {
    const selectedText = getSelectedText()
    handleAIAction(
      () => aiQuickImprove(selectedText),
      'improve'
    )
  }, [getSelectedText, handleAIAction])

  const handleUndo = useCallback(() => {
    if (lastOriginal && lastSelection) {
      editor.chain()
        .focus()
        .setTextSelection(lastSelection)
        .deleteRange(lastSelection)
        .insertContentAt(lastSelection.from, lastOriginal)
        .run()
      setLastOriginal(null)
      setLastSelection(null)
    }
  }, [editor, lastOriginal, lastSelection])

  const rewriteOptions: { label: string; value: RewriteStyle; icon?: React.ReactNode }[] = [
    { label: 'Mais formal', value: 'more_formal' },
    { label: 'Mais casual', value: 'more_casual' },
    { label: 'Mais conciso', value: 'more_concise' },
    { label: 'Mais detalhado', value: 'more_detailed' },
    { label: 'Diferente', value: 'different' }
  ]

  const toneOptions: { label: string; value: ToneType }[] = [
    { label: 'Formal', value: 'formal' },
    { label: 'Casual', value: 'casual' },
    { label: 'Profissional', value: 'professional' },
    { label: 'Amigável', value: 'friendly' },
    { label: 'Acadêmico', value: 'academic' }
  ]

  const translateOptions: { label: string; value: TranslateLanguage }[] = [
    { label: 'Inglês', value: 'en' },
    { label: 'Espanhol', value: 'es' },
    { label: 'Português', value: 'pt' },
    { label: 'Francês', value: 'fr' },
    { label: 'Alemão', value: 'de' }
  ]

  return (
    <div className={cn(
      "flex items-center gap-0.5 p-1 bg-gradient-to-r from-purple-50 to-indigo-50 border-t border-purple-100",
      className
    )}>
      {/* Quick Improve */}
      <AIButton
        onClick={handleQuickImprove}
        isLoading={loadingAction === 'improve'}
        disabled={isLoading}
        title="Melhorar automaticamente"
        highlight
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="text-xs hidden sm:inline">Melhorar</span>
      </AIButton>

      <div className="w-px h-5 bg-purple-200 mx-0.5" />

      {/* Rewrite Dropdown */}
      <div className="relative">
        <AIButton
          onClick={() => setShowRewriteMenu(!showRewriteMenu)}
          isLoading={loadingAction === 'rewrite'}
          disabled={isLoading}
          title="Reescrever"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <ChevronDown className="w-3 h-3" />
        </AIButton>

        {showRewriteMenu && (
          <DropdownMenu onClose={() => setShowRewriteMenu(false)}>
            {rewriteOptions.map(opt => (
              <DropdownItem
                key={opt.value}
                onClick={() => handleRewrite(opt.value)}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </div>

      {/* Expand */}
      <AIButton
        onClick={handleExpand}
        isLoading={loadingAction === 'expand'}
        disabled={isLoading}
        title="Expandir"
      >
        <Expand className="w-3.5 h-3.5" />
      </AIButton>

      {/* Summarize */}
      <AIButton
        onClick={handleSummarize}
        isLoading={loadingAction === 'summarize'}
        disabled={isLoading}
        title="Resumir"
      >
        <Shrink className="w-3.5 h-3.5" />
      </AIButton>

      {/* Tone Dropdown */}
      <div className="relative">
        <AIButton
          onClick={() => setShowToneMenu(!showToneMenu)}
          isLoading={loadingAction === 'tone'}
          disabled={isLoading}
          title="Ajustar tom"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <ChevronDown className="w-3 h-3" />
        </AIButton>

        {showToneMenu && (
          <DropdownMenu onClose={() => setShowToneMenu(false)}>
            {toneOptions.map(opt => (
              <DropdownItem
                key={opt.value}
                onClick={() => handleTone(opt.value)}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </div>

      {/* Translate Dropdown */}
      <div className="relative">
        <AIButton
          onClick={() => setShowTranslateMenu(!showTranslateMenu)}
          isLoading={loadingAction === 'translate'}
          disabled={isLoading}
          title="Traduzir"
        >
          <Languages className="w-3.5 h-3.5" />
          <ChevronDown className="w-3 h-3" />
        </AIButton>

        {showTranslateMenu && (
          <DropdownMenu onClose={() => setShowTranslateMenu(false)}>
            {translateOptions.map(opt => (
              <DropdownItem
                key={opt.value}
                onClick={() => handleTranslate(opt.value)}
              >
                {opt.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </div>

      {/* Fix Grammar */}
      <AIButton
        onClick={handleFixGrammar}
        isLoading={loadingAction === 'grammar'}
        disabled={isLoading}
        title="Corrigir gramática"
      >
        <CheckCircle className="w-3.5 h-3.5" />
      </AIButton>

      {/* Undo AI Change */}
      {lastOriginal && (
        <>
          <div className="w-px h-5 bg-purple-200 mx-0.5" />
          <AIButton
            onClick={handleUndo}
            disabled={isLoading}
            title="Desfazer alteração IA"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </AIButton>
        </>
      )}
    </div>
  )
}

// AI Button Component
function AIButton({
  onClick,
  isLoading,
  disabled,
  title,
  children,
  highlight
}: {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex items-center gap-1 px-2 py-1.5 rounded transition-colors min-h-[28px]",
        highlight
          ? "bg-purple-500 text-white hover:bg-purple-600 disabled:bg-purple-300"
          : "text-purple-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        children
      )}
    </button>
  )
}

// Dropdown Menu Component
function DropdownMenu({
  children,
  onClose
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div className="absolute left-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[140px] py-1">
        {children}
      </div>
    </>
  )
}

// Dropdown Item Component
function DropdownItem({
  onClick,
  children
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
    >
      {children}
    </button>
  )
}

export default AIBubbleMenu
