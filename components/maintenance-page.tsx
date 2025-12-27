import { LayoutDashboard, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MaintenancePage({ message }: { message?: string }) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Lock className="w-12 h-12 text-orange-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Em Manutenção
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        {message || "No momento, estamos realizando melhorias em nosso portal para oferecer uma experiência ainda melhor. Voltaremos em breve!"}
                    </p>
                </div>

                <div className="pt-8 border-t border-slate-200">
                    <p className="text-sm text-slate-500 mb-4">
                        Acesso exclusivo para administradores
                    </p>
                    <Button variant="outline" asChild className="gap-2">
                        <Link href="/cms/login">
                            <LayoutDashboard className="w-4 h-4" />
                            Acessar Painel Admin
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
