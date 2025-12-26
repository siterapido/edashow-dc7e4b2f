'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { login } from '@/lib/actions/cms-auth'

export default function CMSLoginPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showPassword, setShowPassword] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        setErrorMsg(null)

        startTransition(async () => {
            const result = await login({ email, password })

            if (result && 'message' in result) {
                setErrorMsg(result.message)
            } else {
                router.push('/cms/dashboard')
            }
        })
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 ring-4 ring-blue-900/50">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">EDAShow CMS</h1>
                    <p className="text-slate-400">Painel de Administração</p>
                </div>

                <Card className="shadow-2xl border-slate-800 bg-slate-800 text-slate-100">
                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-xl text-center">Acessar Sistema</CardTitle>
                        <CardDescription className="text-center text-slate-400">
                            Digite suas credenciais administrativas
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-300">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@edashow.com.br"
                                        required
                                        disabled={isPending}
                                        className="pl-10 h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:ring-blue-500"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-300">
                                    Senha
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        required
                                        disabled={isPending}
                                        className="pl-10 pr-10 h-11 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:ring-blue-500"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        disabled={isPending}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-3 rounded-md bg-red-900/50 border border-red-800 text-sm text-red-200">
                                    {errorMsg}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg active:scale-95"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Autenticando...
                                    </div>
                                ) : (
                                    'Entrar no Painel'
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
                            <Link href="/" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                                ← Voltar para o site
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
