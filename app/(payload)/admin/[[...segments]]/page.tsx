import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import type { Metadata } from 'next'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

import { importMap } from '../../importMap'

/**
 * Gera os metadados da página admin do Payload CMS
 * Esta função é chamada pelo Next.js para gerar os metadados da página
 */
export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  try {
    return await generatePageMetadata({ config: configPromise, params, searchParams })
  } catch (error) {
    console.error('[Admin Page] Error generating metadata:', error)
    // Retorna metadados padrão em caso de erro
    return {
      title: 'Admin - Payload CMS',
      description: 'Painel administrativo',
    }
  }
}

/**
 * Página principal do painel administrativo do Payload CMS
 * Esta página renderiza toda a interface admin do Payload
 */
const Page = async ({ params, searchParams }: Args) => {
  return <RootPage config={configPromise} params={params} searchParams={searchParams} importMap={importMap} />
}

export default Page
