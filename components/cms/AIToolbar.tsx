'use client'

import React, { useState } from 'react'
import {
    Sparkles,
    Search,
    ImageIcon,
    Target,
    Tags,
    Wand2,
    Loader2,
    ChevronDown,
    Lightbulb,
    FileText,
    Zap,
    MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface AIToolbarProps {
    onGenerateContent?: () => void
    onSearchImages?: () => void
    onSuggestKeywords?: () => void
    onOptimizeSEO?: () => void
    onAutoCategorize?: () => void
    onImproveContent?: (type: 'clarity' | 'seo' | 'engagement' | 'grammar') => void
    isGenerating?: boolean
    disabled?: boolean
    className?: string
    variant?: 'full' | 'compact' | 'minimal'
}

export function AIToolbar({
    onGenerateContent,
    onSearchImages,
    onSuggestKeywords,
    onOptimizeSEO,
    onAutoCategorize,
    onImproveContent,
    isGenerating = false,
    disabled = false,
    className,
    variant = 'full'
}: AIToolbarProps) {
    const [showAdvanced, setShowAdvanced] = useState(false)

    if (variant === 'minimal') {
        return (
            <TooltipProvider>
                <div className={cn('flex items-center gap-1', className)}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={onGenerateContent}
                                disabled={disabled || isGenerating}
                                className="h-8 w-8 text-orange-500 hover:text-orange-600 hover:bg-orange-50"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Gerar com IA</TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
        )
    }

    if (variant === 'compact') {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={disabled || isGenerating}
                            className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            <span>IA</span>
                            <ChevronDown className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Ferramentas de IA</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onGenerateContent}>
                            <Wand2 className="w-4 h-4 mr-2" />
                            Gerar Conteúdo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onSearchImages}>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Buscar Imagens
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onSuggestKeywords}>
                            <Search className="w-4 h-4 mr-2" />
                            Sugerir Keywords
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onOptimizeSEO}>
                            <Target className="w-4 h-4 mr-2" />
                            Otimizar SEO
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onAutoCategorize}>
                            <Tags className="w-4 h-4 mr-2" />
                            Auto-categorizar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    // Full variant
    return (
        <TooltipProvider>
            <div className={cn(
                'flex flex-wrap items-center gap-2 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100',
                className
            )}>
                {/* AI Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg shadow-sm border border-orange-200">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-600">AI Studio</span>
                </div>

                <div className="h-6 w-px bg-orange-200 mx-1" />

                {/* Main Actions */}
                <div className="flex items-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onGenerateContent}
                                disabled={disabled || isGenerating}
                                className="gap-1.5 h-8 px-3 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">Gerar</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Gerar conteúdo com IA</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onSearchImages}
                                disabled={disabled || isGenerating}
                                className="gap-1.5 h-8 px-3 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Imagens</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Buscar imagens</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={onSuggestKeywords}
                                disabled={disabled || isGenerating}
                                className="gap-1.5 h-8 px-3 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span className="hidden sm:inline">Keywords</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sugerir palavras-chave</TooltipContent>
                    </Tooltip>
                </div>

                <div className="h-6 w-px bg-orange-200 mx-1 hidden sm:block" />

                {/* Secondary Actions */}
                <div className="hidden sm:flex items-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={onOptimizeSEO}
                                disabled={disabled || isGenerating}
                                className="h-8 w-8 text-orange-600 hover:bg-orange-100 hover:text-orange-800"
                            >
                                <Target className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Otimizar SEO</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={onAutoCategorize}
                                disabled={disabled || isGenerating}
                                className="h-8 w-8 text-orange-600 hover:bg-orange-100 hover:text-orange-800"
                            >
                                <Tags className="w-4 h-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Auto-categorizar</TooltipContent>
                    </Tooltip>
                </div>

                {/* More Options */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={disabled || isGenerating}
                            className="h-8 w-8 text-orange-600 hover:bg-orange-100"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Melhorar Conteúdo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onImproveContent?.('clarity')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Melhorar Clareza
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onImproveContent?.('seo')}>
                            <Target className="w-4 h-4 mr-2" />
                            Melhorar SEO
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onImproveContent?.('engagement')}>
                            <Zap className="w-4 h-4 mr-2" />
                            Aumentar Engajamento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onImproveContent?.('grammar')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Corrigir Gramática
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="sm:hidden">Mais Ferramentas</DropdownMenuLabel>
                        <DropdownMenuItem onClick={onOptimizeSEO} className="sm:hidden">
                            <Target className="w-4 h-4 mr-2" />
                            Otimizar SEO
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onAutoCategorize} className="sm:hidden">
                            <Tags className="w-4 h-4 mr-2" />
                            Auto-categorizar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </TooltipProvider>
    )
}
