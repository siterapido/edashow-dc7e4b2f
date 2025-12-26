'use client'

import React from 'react'
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ArrowUpDown,
    Search,
    Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface Column<T> {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    loading?: boolean
    onRowClick?: (item: T) => void
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    loading,
    onRowClick
}: DataTableProps<T>) {
    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest"
                                >
                                    <div className="flex items-center gap-2">
                                        {col.label}
                                        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 bg-slate-800 rounded w-full" />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        "hover:bg-slate-800/50 transition-colors cursor-pointer group",
                                        onRowClick && "active:bg-slate-800"
                                    )}
                                >
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                                            {col.render ? col.render(item) : (item as any)[col.key]}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-500 italic">
                                    Nenhum registro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Placeholder */}
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                    Mostrando <span className="font-bold text-slate-300">{data.length}</span> resultados
                </p>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 h-8 px-2">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 h-8 px-2">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
