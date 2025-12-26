'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, ShieldCheck, ArrowUpDown, Loader2, Globe, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DataTable } from '@/components/cms/DataTable'
import { saveSponsor, deleteSponsor } from '@/lib/actions/cms-sponsors'
import { createClient } from '@/lib/supabase/client'

export default function CMSSponsorsPage() {
    const [sponsors, setSponsors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentSponsor, setCurrentSponsor] = useState<any>({ name: '', logo_url: '', website_url: '', display_order: 0 })
    const [saving, setSaving] = useState(false)

    const fetchSponsors = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data } = await supabase.from('sponsors').select('*').order('display_order')
        setSponsors(data || [])
        setLoading(false)
    }

    useEffect(() => {
        fetchSponsors()
    }, [])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await saveSponsor(currentSponsor)
            setIsEditing(false)
            setCurrentSponsor({ name: '', logo_url: '', website_url: '', display_order: 0 })
            fetchSponsors()
        } catch (error) {
            console.error('Erro ao salvar patrocinador:', error)
        }
        setSaving(false)
    }

    const handleEdit = (sponsor: any) => {
        setCurrentSponsor(sponsor)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este patrocinador?')) return
        try {
            await deleteSponsor(id)
            fetchSponsors()
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    const columns = [
        {
            key: 'name',
            label: 'Nome',
            render: (item: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-white p-1 flex items-center justify-center border border-gray-100 shadow-sm">
                        {item.logo_url ? <img src={item.logo_url} className="max-w-full max-h-full object-contain" /> : <ImageIcon className="text-gray-300 w-4 h-4" />}
                    </div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                </div>
            )
        },
        { key: 'display_order', label: 'Ordem' },
        {
            key: 'link',
            label: 'Site',
            render: (item: any) => item.website_url ? (
                <a href={item.website_url} target="_blank" className="text-orange-600 hover:text-orange-500 flex items-center gap-1 font-medium">
                    Ver Site <ExternalLink className="w-3 h-3" />
                </a>
            ) : '-'
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Patrocinadores</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie os logotipos e parceiros exibidos no site.</p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentSponsor({ name: '', logo_url: '', website_url: '', display_order: sponsors.length + 1 })
                        setIsEditing(true)
                    }}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg shadow-orange-500/20"
                >
                    <Plus className="w-4 h-4" /> Novo Patrocinador
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <DataTable
                        columns={columns}
                        data={sponsors}
                        loading={loading}
                        onRowClick={handleEdit}
                    />
                </div>

                <div className={cn(
                    "bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-24 transition-all",
                    !isEditing && "opacity-50 pointer-events-none grayscale"
                )}>
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck className="w-4 h-4 text-orange-500" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                            {currentSponsor.id ? 'Editar Parceria' : 'Nova Parceria'}
                        </h2>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Nome da Empresa</Label>
                            <Input
                                value={currentSponsor.name}
                                onChange={(e) => setCurrentSponsor({ ...prev, name: e.target.value })}
                                placeholder="Ex: Hospital Central"
                                className="bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Logo URL</Label>
                            <Input
                                value={currentSponsor.logo_url}
                                onChange={(e) => setCurrentSponsor({ ...prev, logo_url: e.target.value })}
                                placeholder="https://..."
                                className="bg-gray-50 border-gray-100 text-gray-500 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Endereço Web</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                <Input
                                    value={currentSponsor.website_url}
                                    onChange={(e) => setCurrentSponsor({ ...prev, website_url: e.target.value })}
                                    placeholder="www.exemplo.com.br"
                                    className="pl-8 bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-400 text-[10px] font-bold uppercase">Ordem de Exibição</Label>
                            <Input
                                type="number"
                                value={currentSponsor.display_order}
                                onChange={(e) => setCurrentSponsor({ ...prev, display_order: parseInt(e.target.value) })}
                                className="bg-gray-50 border-gray-100 text-gray-900 w-24 focus:bg-white transition-colors"
                            />
                        </div>

                        <div className="pt-4 flex gap-2">
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white font-bold"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                {currentSponsor.id ? 'Atualizar' : 'Criar Parceria'}
                            </Button>
                            {currentSponsor.id && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleDelete(currentSponsor.id)}
                                    className="border-red-100 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="w-full text-gray-400 text-xs hover:bg-gray-50"
                        >
                            Cancelar
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
