'use client'

import React from 'react'
import {
    BookOpen,
    Image as ImageIcon,
    FileText,
    Search,
    Zap,
    Lightbulb,
    CheckCircle2,
    Monitor,
    Smartphone
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function CMSDocsPage() {
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="space-y-2 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-orange-500" />
                    Documentação & Guia de Uso
                </h1>
                <p className="text-gray-500 text-lg">
                    Orientações essenciais para manter a qualidade e o desempenho do seu portal.
                </p>
            </div>

            {/* Grid de Tamanhos de Imagem */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-orange-50/50">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                            <ImageIcon className="text-white w-6 h-6" />
                        </div>
                        <CardTitle>Capa de Posts</CardTitle>
                        <CardDescription>Otimizado para redes sociais e site.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Tamanho Ideal</span>
                                <span className="text-sm font-bold text-orange-600">1280 x 720 px</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Proporção</span>
                                <span className="text-sm font-bold text-gray-900">16:9 (Wide)</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Formato</span>
                                <span className="text-sm font-bold text-gray-900">WEBP ou JPEG</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-blue-50/50">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                            <Monitor className="text-white w-6 h-6" />
                        </div>
                        <CardTitle>Galeria & Quadros</CardTitle>
                        <CardDescription>Para visualização em grid e lupas.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Tamanho Ideal</span>
                                <span className="text-sm font-bold text-blue-600">1080 x 1080 px</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Proporção</span>
                                <span className="text-sm font-bold text-gray-900">1:1 (Quadrada)</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Peso Máx.</span>
                                <span className="text-sm font-bold text-gray-900">500 KB</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="bg-purple-50/50">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                            <Zap className="text-white w-6 h-6" />
                        </div>
                        <CardTitle>Banners Publicidade</CardTitle>
                        <CardDescription>Destaques laterais e topo.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Horizontal (Topo)</span>
                                <span className="text-sm font-bold text-purple-600">970 x 250 px</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Lateral (Sidebar)</span>
                                <span className="text-sm font-bold text-gray-900">300 x 600 px</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b">
                                <span className="text-sm font-medium text-gray-600">Mobile</span>
                                <span className="text-sm font-bold text-gray-900">320 x 100 px</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dicas de Boas Práticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Boas Práticas para Posts
                    </h2>
                    <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Texto Justificado</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    O editor já aplica a formatação ideal por padrão, mas evite blocos de texto muito longos. Use parágrafos de 3 a 5 linhas.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Títulos (H1, H2, H3)</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Use títulos para organizar a leitura. Isso ajuda tanto o usuário quanto o SEO do Google.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-gray-900">Nomes de Arquivos</h4>
                                <p className="text-sm text-gray-600 mt-1">
                                    Evite nomes como "IMG_001.jpg". Use "titulo-da-materia.jpg" para melhorar as buscas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        Otimização para SEO
                    </h2>
                    <div className="bg-white rounded-xl border p-6 space-y-4 shadow-sm">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-bold text-blue-900 text-sm italic mb-2">Dica de Ouro:</h4>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Em cada post, certifique-se de preencher a <strong>Descrição SEO</strong> nas configurações. Ela é o texto que aparece quando você compartilha o link no WhatsApp ou Facebook.
                            </p>
                        </div>
                        <ul className="space-y-2">
                            <li className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                URL Amigável: Curta e com palavras-chave.
                            </li>
                            <li className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                Tags: Use de 3 a 5 tags por post.
                            </li>
                            <li className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                Newsletter: Mantenha sua base engajada com resumos semanais.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer de Suporte */}
            <div className="bg-gray-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div>
                    <h3 className="text-xl font-bold">Precisa de ajuda técnica?</h3>
                    <p className="text-gray-400 mt-1 text-sm">Entre em contato com a equipe de desenvolvimento para suporte especializado.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 font-mono">VERSÃO DO SISTEMA: 3.0+</span>
                </div>
            </div>
        </div>
    )
}
