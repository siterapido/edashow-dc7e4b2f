"use client"

import { usePathname } from "next/navigation"
import MaintenancePage from "./maintenance-page"

export function MaintenanceClientGate({
    children,
    enabled,
    message
}: {
    children: React.ReactNode,
    enabled: boolean,
    message?: string
}) {
    const pathname = usePathname()

    // Se a manutenção está desativada, mostra o conteúdo normalmente
    if (!enabled) return <>{children}</>

    // Se o usuário está no CMS ou na página de login, permite o acesso
    const isPublicRoute = !pathname.includes('/cms') && !pathname.includes('/login')

    if (isPublicRoute) {
        return <MaintenancePage message={message} />
    }

    return <>{children}</>
}
