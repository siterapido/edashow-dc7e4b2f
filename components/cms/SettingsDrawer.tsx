'use client'

import React from 'react'
import { Drawer } from 'vaul'
import { Settings, X, Calendar, Tag, User, Star, Link as LinkIcon } from 'lucide-react'
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
}

export function SettingsDrawer({
    open,
    onOpenChange,
    formData,
    onChange,
    categories,
    columnists
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
