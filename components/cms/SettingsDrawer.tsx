'use client'

import React, { useEffect, useState } from 'react'
import { Drawer } from 'vaul'
import { Settings, X, Calendar, Tag, User, Star, Link as LinkIcon, ChevronRight, Trash2, AlertTriangle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SettingsDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    formData: {
        status: string
        category_id: string
        columnist_id: string
        published_at: string
        featured_home: boolean
        source_url: string
    }
    onChange: (field: string, value: any) => void
    categories: Array<{ id: string; name: string }>
    columnists: Array<{ id: string; name: string }>
    onDelete?: () => void
    isNew?: boolean
}

// Desktop Sidebar Panel Component
function DesktopSettingsPanel({
    open,
    onOpenChange,
    formData,
    onChange,
    categories,
    columnists,
    onDelete,
    isNew
}: SettingsDrawerProps) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
                    open ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => onOpenChange(false)}
            />

            {/* Side Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-xl">
                            <Settings className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Configurações</h2>
                            <p className="text-xs text-gray-500">Ajuste as opções do post</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpenChange(false)}
                        className="text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="space-y-8">
                        {/* Status Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Tag className="w-4 h-4 text-orange-500" />
                                <Label className="text-sm font-semibold text-gray-700">Status do Post</Label>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { value: 'draft', label: 'Rascunho', color: 'slate', icon: '📝' },
                                    { value: 'published', label: 'Publicado', color: 'green', icon: '✅' },
                                    { value: 'archived', label: 'Arquivado', color: 'orange', icon: '📦' }
                                ].map(status => (
                                    <button
                                        key={status.value}
                                        type="button"
                                        onClick={() => onChange('status', status.value)}
                                        className={cn(
                                            "py-4 px-3 rounded-xl border-2 text-sm font-medium transition-all flex flex-col items-center gap-2",
                                            formData.status === status.value
                                                ? status.value === 'published'
                                                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm shadow-green-100"
                                                    : status.value === 'archived'
                                                        ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm shadow-orange-100"
                                                        : "border-gray-400 bg-gray-50 text-gray-700"
                                                : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200 hover:bg-gray-100"
                                        )}
                                    >
                                        <span className="text-lg">{status.icon}</span>
                                        <span>{status.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Category & Author in 2 columns */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Category */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-orange-500" />
                                    <Label className="text-sm font-semibold text-gray-700">Categoria</Label>
                                </div>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => onChange('category_id', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer hover:border-gray-300"
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </section>

                            {/* Author */}
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-orange-500" />
                                    <Label className="text-sm font-semibold text-gray-700">Autor</Label>
                                </div>
                                <select
                                    value={formData.columnist_id}
                                    onChange={(e) => onChange('columnist_id', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer hover:border-gray-300"
                                >
                                    <option value="">Selecione...</option>
                                    {columnists.map(col => (
                                        <option key={col.id} value={col.id}>{col.name}</option>
                                    ))}
                                </select>
                            </section>
                        </div>

                        {/* Publication Date */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <Label className="text-sm font-semibold text-gray-700">Data de Publicação</Label>
                            </div>
                            <Input
                                type="date"
                                value={formData.published_at}
                                onChange={(e) => onChange('published_at', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 rounded-xl h-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer hover:border-gray-300"
                            />
                        </section>

                        {/* Featured Toggle */}
                        <section>
                            <div
                                className={cn(
                                    "flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all",
                                    formData.featured_home
                                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
                                        : "bg-gray-50 border-gray-100 hover:border-gray-200"
                                )}
                                onClick={() => onChange('featured_home', !formData.featured_home)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "p-3 rounded-xl transition-colors",
                                        formData.featured_home ? "bg-orange-100" : "bg-gray-200"
                                    )}>
                                        <Star className={cn(
                                            "w-5 h-5 transition-colors",
                                            formData.featured_home ? "text-orange-500 fill-orange-500" : "text-gray-400"
                                        )} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Destaque na Home</p>
                                        <p className="text-xs text-gray-500">Exibir na seção principal do site</p>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-14 h-8 rounded-full p-1 transition-colors",
                                    formData.featured_home ? "bg-orange-500" : "bg-gray-200"
                                )}>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full bg-white shadow-md transition-transform",
                                        formData.featured_home && "translate-x-6"
                                    )} />
                                </div>
                            </div>
                        </section>

                        {/* Source URL */}
                        <section className="space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <LinkIcon className="w-4 h-4 text-orange-500" />
                                <Label className="text-sm font-semibold text-gray-700">URL Original</Label>
                                <span className="text-xs text-gray-400 ml-auto">(Opcional)</span>
                            </div>
                            <Input
                                value={formData.source_url}
                                onChange={(e) => onChange('source_url', e.target.value)}
                                placeholder="https://fonte-original.com/artigo"
                                className="bg-gray-50 border-gray-200 text-gray-900 rounded-xl h-12 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all hover:border-gray-300"
                            />
                        </section>

                        {/* Danger Zone */}
                        {!isNew && onDelete && (
                            <section className="pt-4 border-t border-gray-100">
                                <Label className="text-xs font-bold uppercase text-red-500 mb-3 block">Zona de Perigo</Label>
                                <Button
                                    variant="outline"
                                    onClick={onDelete}
                                    className="w-full justify-start text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 hover:text-red-700 h-12 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir Post
                                </Button>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                    >
                        Aplicar Configurações
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </>
    )
}

// Mobile Drawer Component
function MobileSettingsDrawer({
    open,
    onOpenChange,
    formData,
    onChange,
    categories,
    columnists,
    onDelete,
    isNew
}: SettingsDrawerProps) {
    return (
        <Drawer.Root open={open} onOpenChange={onOpenChange}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 z-50" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-2xl bg-white border-t border-gray-200 shadow-2xl">
                    {/* Handle */}
                    <div className="mx-auto mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-200" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-orange-500" />
                            <Drawer.Title className="text-lg font-bold text-gray-900">
                                Configurações do Post
                            </Drawer.Title>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-400 hover:text-gray-900"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                        {/* Status */}
                        <div className="space-y-3">
                            <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Status do Post
                            </Label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { value: 'draft', label: 'Rascunho', color: 'slate' },
                                    { value: 'published', label: 'Publicado', color: 'green' },
                                    { value: 'archived', label: 'Arquivado', color: 'orange' }
                                ].map(status => (
                                    <button
                                        key={status.value}
                                        type="button"
                                        onClick={() => onChange('status', status.value)}
                                        className={cn(
                                            "py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all",
                                            formData.status === status.value
                                                ? status.value === 'published'
                                                    ? "border-green-500 bg-green-50 text-green-700"
                                                    : status.value === 'archived'
                                                        ? "border-orange-500 bg-orange-50 text-orange-700"
                                                        : "border-gray-400 bg-gray-50 text-gray-700"
                                                : "border-gray-100 bg-gray-50/50 text-gray-500 hover:border-gray-200"
                                        )}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-3">
                            <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Categoria
                            </Label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => onChange('category_id', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Columnist */}
                        <div className="space-y-3">
                            <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Autor / Colunista
                            </Label>
                            <select
                                value={formData.columnist_id}
                                onChange={(e) => onChange('columnist_id', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Selecione um autor</option>
                                {columnists.map(col => (
                                    <option key={col.id} value={col.id}>{col.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Published Date */}
                        <div className="space-y-3">
                            <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Data de Publicação
                            </Label>
                            <Input
                                type="date"
                                value={formData.published_at}
                                onChange={(e) => onChange('published_at', e.target.value)}
                                className="bg-gray-50 border-gray-200 text-gray-900 rounded-xl h-12"
                            />
                        </div>

                        {/* Featured */}
                        <div
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer"
                            onClick={() => onChange('featured_home', !formData.featured_home)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    formData.featured_home ? "bg-orange-50" : "bg-gray-200"
                                )}>
                                    <Star className={cn(
                                        "w-5 h-5",
                                        formData.featured_home ? "text-orange-400" : "text-slate-400"
                                    )} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Destaque na Home</p>
                                    <p className="text-xs text-gray-400">Exibir na seção principal</p>
                                </div>
                            </div>
                            <div className={cn(
                                "w-12 h-7 rounded-full p-1 transition-colors",
                                formData.featured_home ? "bg-orange-500" : "bg-gray-200"
                            )}>
                                <div className={cn(
                                    "w-5 h-5 rounded-full bg-white transition-transform",
                                    formData.featured_home && "translate-x-5"
                                )} />
                            </div>
                        </div>

                        {/* Source URL */}
                        <div className="space-y-3">
                            <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                URL Original (Opcional)
                            </Label>
                            <Input
                                value={formData.source_url}
                                onChange={(e) => onChange('source_url', e.target.value)}
                                placeholder="https://..."
                                className="bg-gray-50 border-gray-200 text-gray-900 rounded-xl h-12"
                            />
                        </div>

                        {/* Danger Zone */}
                        {!isNew && onDelete && (
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <Label className="text-gray-400 text-xs font-bold uppercase flex items-center gap-2 text-red-400">
                                    <AlertTriangle className="w-4 h-4" />
                                    Zona de Perigo
                                </Label>
                                <Button
                                    variant="outline"
                                    onClick={onDelete}
                                    className="w-full text-red-600 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 hover:text-red-700 h-12 rounded-xl"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir Post
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Footer - Aplicar */}
                    <div className="p-4 border-t border-gray-100 safe-area-pb">
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold h-12 rounded-xl"
                        >
                            Aplicar Configurações
                        </Button>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}

// Main Component - Responsive switcher
export function SettingsDrawer(props: SettingsDrawerProps) {
    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        // Check if we're on desktop (768px+)
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768)
        }

        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (props.open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [props.open])

    if (isDesktop) {
        return <DesktopSettingsPanel {...props} />
    }

    return <MobileSettingsDrawer {...props} />
}
