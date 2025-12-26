import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">404 - Página não encontrada</h1>
            <p className="text-slate-400 mb-8 max-w-md">
                Desculpe, a página que você está procurando não existe ou foi movida.
            </p>
            <Link href="/">
                <Button className="bg-orange-500 hover:bg-orange-400 text-white">
                    Voltar para a Home
                </Button>
            </Link>
        </div>
    )
}
