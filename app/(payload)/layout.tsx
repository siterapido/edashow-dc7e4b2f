import { RootLayout } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { importMap } from './importMap'
import { serverFunction } from './admin-actions'
import '@payloadcms/next/css'
import '@/lib/payload/css/admin-theme.css'
import '@/lib/payload/css/custom-editor.css'

type Args = {
  children: React.ReactNode
}

/**
 * Layout do grupo de rotas (payload)
 * Este layout é aplicado a todas as páginas do Payload CMS (admin, API, GraphQL)
 * Usa o RootLayout oficial do Payload para garantir compatibilidade total
 */
export default function PayloadLayout({ children }: Args) {
  return (
    <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}






