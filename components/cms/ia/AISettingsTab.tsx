'use client'

import React, { useState, useEffect } from 'react'
import {
    Settings,
    Loader2,
    Save,
    Plus,
    Trash2,
    Edit3,
    Check,
    X,
    User,
    FileText,
    Cpu,
    BarChart3,
    AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
    getAISettings,
    updateAISetting,
    getPersonaConfig,
    updatePersonaConfig,
    getAIPrompts,
    saveAIPrompt,
    deleteAIPrompt,
    getAvailableModels,
    getAIUsageStats,
    getPromptCategories,
    type PersonaConfig,
    type AIPrompt
} from '@/lib/actions/ai-settings'

type SettingsSection = 'persona' | 'prompts' | 'model' | 'stats'

export function AISettingsTab() {
    const [section, setSection] = useState<SettingsSection>('persona')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    // Persona state
    const [persona, setPersona] = useState<PersonaConfig>({
        persona_description: '',
        writing_style: '',
        vocabulary_examples: [],
        avoid_phrases: []
    })
    const [vocabInput, setVocabInput] = useState('')
    const [avoidInput, setAvoidInput] = useState('')

    // Prompts state
    const [prompts, setPrompts] = useState<AIPrompt[]>([])
    const [categories, setCategories] = useState<string[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null)
    const [isCreatingPrompt, setIsCreatingPrompt] = useState(false)

    // Model state
    const [models, setModels] = useState<Array<{ id: string; name: string; description: string }>>([])
    const [selectedModel, setSelectedModel] = useState('')
    const [temperature, setTemperature] = useState(0.7)

    // Stats state
    const [stats, setStats] = useState<{
        totalGenerations: number
        totalTokens: number
        totalCost: number
        byType: Record<string, number>
        byDay: Array<{ date: string; count: number; tokens: number }>
    } | null>(null)

    // Load initial data
    useEffect(() => {
        async function loadData() {
            setIsLoading(true)
            try {
                const [personaData, promptsData, modelsData, categoriesData, settings] = await Promise.all([
                    getPersonaConfig(),
                    getAIPrompts(),
                    getAvailableModels(),
                    getPromptCategories(),
                    getAISettings()
                ])

                setPersona(personaData)
                setPrompts(promptsData)
                setModels(modelsData)
                setCategories(categoriesData)
                setSelectedModel(settings.default_model || 'z-ai/glm-4.7-flash')
                setTemperature(settings.default_temperature || 0.7)
            } catch (err) {
                setError('Erro ao carregar configurações')
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [])

    // Load stats when switching to stats section
    useEffect(() => {
        if (section === 'stats' && !stats) {
            loadStats()
        }
    }, [section, stats])

    const loadStats = async () => {
        try {
            const statsData = await getAIUsageStats(30)
            setStats(statsData)
        } catch {
            setError('Erro ao carregar estatísticas')
        }
    }

    // Save persona
    const handleSavePersona = async () => {
        setIsSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const result = await updatePersonaConfig(persona)
            if (result.success) {
                setSuccess('Persona salva com sucesso!')
                setTimeout(() => setSuccess(null), 3000)
            } else {
                setError(result.error || 'Erro ao salvar')
            }
        } catch {
            setError('Erro ao salvar persona')
        } finally {
            setIsSaving(false)
        }
    }

    // Add vocabulary example
    const handleAddVocab = () => {
        if (vocabInput.trim() && !persona.vocabulary_examples.includes(vocabInput.trim())) {
            setPersona({
                ...persona,
                vocabulary_examples: [...persona.vocabulary_examples, vocabInput.trim()]
            })
            setVocabInput('')
        }
    }

    // Remove vocabulary example
    const handleRemoveVocab = (item: string) => {
        setPersona({
            ...persona,
            vocabulary_examples: persona.vocabulary_examples.filter(v => v !== item)
        })
    }

    // Add avoid phrase
    const handleAddAvoid = () => {
        if (avoidInput.trim() && !persona.avoid_phrases.includes(avoidInput.trim())) {
            setPersona({
                ...persona,
                avoid_phrases: [...persona.avoid_phrases, avoidInput.trim()]
            })
            setAvoidInput('')
        }
    }

    // Remove avoid phrase
    const handleRemoveAvoid = (item: string) => {
        setPersona({
            ...persona,
            avoid_phrases: persona.avoid_phrases.filter(p => p !== item)
        })
    }

    // Save prompt
    const handleSavePrompt = async () => {
        if (!editingPrompt) return

        setIsSaving(true)
        setError(null)

        try {
            const result = await saveAIPrompt(editingPrompt)
            if (result.success) {
                const updatedPrompts = await getAIPrompts()
                setPrompts(updatedPrompts)
                setEditingPrompt(null)
                setIsCreatingPrompt(false)
                setSuccess('Prompt salvo com sucesso!')
                setTimeout(() => setSuccess(null), 3000)
            } else {
                setError(result.error || 'Erro ao salvar prompt')
            }
        } catch {
            setError('Erro ao salvar prompt')
        } finally {
            setIsSaving(false)
        }
    }

    // Delete prompt
    const handleDeletePrompt = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este prompt?')) return

        try {
            const result = await deleteAIPrompt(id)
            if (result.success) {
                setPrompts(prompts.filter(p => p.id !== id))
            }
        } catch {
            setError('Erro ao excluir prompt')
        }
    }

    // Save model settings
    const handleSaveModel = async () => {
        setIsSaving(true)
        setError(null)

        try {
            await Promise.all([
                updateAISetting('default_model', selectedModel),
                updateAISetting('default_temperature', temperature)
            ])
            setSuccess('Configurações de modelo salvas!')
            setTimeout(() => setSuccess(null), 3000)
        } catch {
            setError('Erro ao salvar configurações')
        } finally {
            setIsSaving(false)
        }
    }

    // Create new prompt
    const handleNewPrompt = () => {
        setIsCreatingPrompt(true)
        setEditingPrompt({
            name: '',
            category: categories[0] || 'post',
            prompt_template: '',
            description: '',
            is_active: true
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Section Selection */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => setSection('persona')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            section === 'persona'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <User className="w-4 h-4" />
                        Persona & Voz
                    </button>
                    <button
                        onClick={() => setSection('prompts')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            section === 'prompts'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <FileText className="w-4 h-4" />
                        Prompts
                    </button>
                    <button
                        onClick={() => setSection('model')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            section === 'model'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <Cpu className="w-4 h-4" />
                        Modelo
                    </button>
                    <button
                        onClick={() => setSection('stats')}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                            section === 'stats'
                                ? "bg-orange-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                    >
                        <BarChart3 className="w-4 h-4" />
                        Estatísticas
                    </button>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-green-700 text-sm">{success}</p>
                </div>
            )}

            {/* Persona Section */}
            {section === 'persona' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Persona & Voz</h2>
                        <p className="text-sm text-gray-500">Configure a personalidade e estilo de escrita da IA</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição da Persona
                        </label>
                        <Textarea
                            value={persona.persona_description}
                            onChange={(e) => setPersona({ ...persona, persona_description: e.target.value })}
                            placeholder="Você é um redator especialista em..."
                            className="min-h-[100px] bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estilo de Escrita
                        </label>
                        <Input
                            value={persona.writing_style}
                            onChange={(e) => setPersona({ ...persona, writing_style: e.target.value })}
                            placeholder="informativo, acessível, profissional..."
                            className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Vocabulário Preferido
                        </label>
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={vocabInput}
                                onChange={(e) => setVocabInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddVocab())}
                                placeholder="Adicionar termo..."
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                            />
                            <Button variant="outline" onClick={handleAddVocab}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {persona.vocabulary_examples.map((item) => (
                                <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                    {item}
                                    <button onClick={() => handleRemoveVocab(item)} className="hover:text-green-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frases/Termos a Evitar
                        </label>
                        <div className="flex gap-2 mb-3">
                            <Input
                                value={avoidInput}
                                onChange={(e) => setAvoidInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAvoid())}
                                placeholder="Adicionar termo..."
                                className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                            />
                            <Button variant="outline" onClick={handleAddAvoid}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {persona.avoid_phrases.map((item) => (
                                <span key={item} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                    {item}
                                    <button onClick={() => handleRemoveAvoid(item)} className="hover:text-red-900">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleSavePersona}
                            disabled={isSaving}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Salvar Persona
                        </Button>
                    </div>
                </div>
            )}

            {/* Prompts Section */}
            {section === 'prompts' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Prompts Personalizados</h2>
                                <p className="text-sm text-gray-500">Gerencie templates de prompts para diferentes usos</p>
                            </div>
                            <Button onClick={handleNewPrompt} className="bg-orange-500 hover:bg-orange-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Prompt
                            </Button>
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 mb-6">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                                    selectedCategory === ''
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize",
                                        selectedCategory === cat
                                            ? "bg-orange-500 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Prompts List */}
                        <div className="space-y-3">
                            {prompts
                                .filter(p => !selectedCategory || p.category === selectedCategory)
                                .map((prompt) => (
                                    <div
                                        key={prompt.id}
                                        className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-gray-900">{prompt.name}</h3>
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs capitalize">
                                                        {prompt.category}
                                                    </span>
                                                    {prompt.is_active ? (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs">
                                                            Ativo
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                                                            Inativo
                                                        </span>
                                                    )}
                                                </div>
                                                {prompt.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{prompt.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingPrompt(prompt)}
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => prompt.id && handleDeletePrompt(prompt.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {prompts.filter(p => !selectedCategory || p.category === selectedCategory).length === 0 && (
                                <p className="text-center text-gray-500 py-8">Nenhum prompt encontrado</p>
                            )}
                        </div>
                    </div>

                    {/* Prompt Editor Modal */}
                    {(editingPrompt || isCreatingPrompt) && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {isCreatingPrompt ? 'Novo Prompt' : 'Editar Prompt'}
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                        <Input
                                            value={editingPrompt?.name || ''}
                                            onChange={(e) => setEditingPrompt({ ...editingPrompt!, name: e.target.value })}
                                            placeholder="Nome do prompt..."
                                            className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                        <select
                                            value={editingPrompt?.category || ''}
                                            onChange={(e) => setEditingPrompt({ ...editingPrompt!, category: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                                        <Input
                                            value={editingPrompt?.description || ''}
                                            onChange={(e) => setEditingPrompt({ ...editingPrompt!, description: e.target.value })}
                                            placeholder="Breve descrição..."
                                            className="bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Template do Prompt
                                        </label>
                                        <Textarea
                                            value={editingPrompt?.prompt_template || ''}
                                            onChange={(e) => setEditingPrompt({ ...editingPrompt!, prompt_template: e.target.value })}
                                            placeholder="Use {{variavel}} para variáveis dinâmicas..."
                                            className="min-h-[200px] font-mono text-sm bg-gray-50 border-gray-200 focus:bg-white focus:ring-orange-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Variáveis disponíveis: {'{{topic}}'}, {'{{keywords}}'}, {'{{tone}}'}, {'{{word_count}}'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={editingPrompt?.is_active || false}
                                            onChange={(e) => setEditingPrompt({ ...editingPrompt!, is_active: e.target.checked })}
                                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <label htmlFor="is_active" className="text-sm text-gray-700">Prompt ativo</label>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setEditingPrompt(null)
                                            setIsCreatingPrompt(false)
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleSavePrompt}
                                        disabled={isSaving}
                                        className="bg-orange-500 hover:bg-orange-600"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        Salvar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Model Section */}
            {section === 'model' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-1">Configurações do Modelo</h2>
                        <p className="text-sm text-gray-500">Escolha o modelo de IA e ajuste os parâmetros</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Modelo Padrão</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {models.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => setSelectedModel(model.id)}
                                    className={cn(
                                        "p-4 rounded-xl border-2 text-left transition-all",
                                        selectedModel === model.id
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-gray-200 hover:border-orange-300"
                                    )}
                                >
                                    <p className={cn(
                                        "font-medium",
                                        selectedModel === model.id ? "text-orange-700" : "text-gray-900"
                                    )}>
                                        {model.name}
                                    </p>
                                    <p className="text-sm text-gray-500">{model.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Temperatura: {temperature.toFixed(1)}
                        </label>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500">Preciso</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <span className="text-xs text-gray-500">Criativo</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Valores mais baixos geram respostas mais focadas. Valores mais altos geram respostas mais criativas.
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <Button
                            onClick={handleSaveModel}
                            disabled={isSaving}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Salvar Configurações
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Section */}
            {section === 'stats' && (
                <div className="space-y-6">
                    {stats ? (
                        <>
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <p className="text-sm text-gray-500 mb-1">Total de Gerações (30 dias)</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalGenerations}</p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <p className="text-sm text-gray-500 mb-1">Tokens Consumidos</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.totalTokens.toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <p className="text-sm text-gray-500 mb-1">Custo Estimado</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        ${stats.totalCost.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* By Type */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-4">Gerações por Tipo</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.byType).map(([type, count]) => (
                                        <div key={type} className="flex items-center gap-4">
                                            <span className="text-sm text-gray-600 w-24 capitalize">{type}</span>
                                            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full"
                                                    style={{
                                                        width: `${(count / stats.totalGenerations) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 w-12 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Daily Activity */}
                            {stats.byDay.length > 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-4">Atividade Diária</h3>
                                    <div className="flex items-end gap-1 h-32">
                                        {stats.byDay.slice(-30).map((day) => {
                                            const maxCount = Math.max(...stats.byDay.map(d => d.count))
                                            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
                                            return (
                                                <div
                                                    key={day.date}
                                                    className="flex-1 bg-orange-500 rounded-t hover:bg-orange-600 transition-colors cursor-pointer group relative"
                                                    style={{ height: `${Math.max(height, 4)}%` }}
                                                    title={`${day.date}: ${day.count} gerações`}
                                                >
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        {day.date}: {day.count}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
