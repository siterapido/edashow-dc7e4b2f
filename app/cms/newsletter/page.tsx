'use client'

import React, { useEffect, useState } from 'react'
import { Mail, CheckCircle, XCircle, Download, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/cms/DataTable'
import { getNewsletterSubscribers, toggleSubscriberStatus } from '@/lib/actions/cms-sponsors'
import { cn } from '@/lib/utils'

export default function CMSNewsletterPage() {
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchSubs = async () => {
        setLoading(true)
        try {
            const data = await getNewsletterSubscribers()
            setSubscribers(data || [])
        } catch (error) {
            console.error('Erro ao buscar inscritos:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSubs()
    }, [])

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await toggleSubscriberStatus(id, !currentStatus)
            setSubscribers(prev => prev.map(s => s.id === id ? { ...s, active: !currentStatus } : s))
        } catch (error) {
            console.error('Erro ao alternar status:', error)
        }
    }

    const exportCSV = () => {
        const headers = ['Email', 'Data de Inscrição', 'Status']
        const rows = subscribers.map(s => [
            s.email,
            new Date(s.created_at).toLocaleDateString(),
            s.active ? 'Ativo' : 'Inativo'
        ])

        const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
        a.click()
    }

    const columns = [
        {
            key: 'email',
            label: 'E-mail',
            render: (item: any) => (
                <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span className="font-medium text-white">{item.email}</span>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Inscrito em',
            render: (item: any) => new Date(item.created_at).toLocaleString('pt-BR')
        },
        {
            key: 'active',
            label: 'Status',
            render: (item: any) => (
                <button
                    onClick={() => handleToggle(item.id, item.active)}
                    className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                        item.active
                            ? "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
                    )}
                >
                    {item.active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {item.active ? 'Ativo' : 'Inativo'}
                </button>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Assinantes da Newsletter</h1>
                    <p className="text-slate-400 text-sm mt-1">Gerencie a lista de e-mails capturados pelo site.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchSubs}
                        className="border-slate-800 text-slate-400 hover:bg-slate-800"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    </Button>
                    <Button
                        onClick={exportCSV}
                        className="bg-green-600 hover:bg-green-500 text-white font-bold gap-2 shadow-lg shadow-green-900/20"
                        disabled={subscribers.length === 0}
                    >
                        <Download className="w-4 h-4" /> Exportar CSV
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={subscribers}
                loading={loading}
            />
        </div>
    )
}
