export type BannerLocation =
    | 'home_hero'
    | 'home_sidebar'
    | 'home_footer'
    | 'article_top'
    | 'article_sidebar'
    | 'article_content'
    | 'site_header'

export interface Banner {
    id: string
    title: string
    image_path: string
    link_url: string
    location: BannerLocation
    width: number
    height: number
    start_date: string
    end_date: string | null
    is_active: boolean
    display_order: number
    created_at: string
    updated_at: string
}

export interface BannerFormData {
    title: string
    image?: File
    link_url: string
    location: BannerLocation
    start_date: string
    end_date: string | null
    is_active: boolean
    display_order: number
}

export const BANNER_LOCATIONS: { value: BannerLocation; label: string; dimensions: { width: number; height: number } }[] = [
    { value: 'home_hero', label: 'Home - Banner Hero (Topo)', dimensions: { width: 1920, height: 400 } },
    { value: 'home_sidebar', label: 'Home - Sidebar Lateral', dimensions: { width: 300, height: 600 } },
    { value: 'home_footer', label: 'Home - Rodapé', dimensions: { width: 728, height: 90 } },
    { value: 'article_top', label: 'Artigos - Topo', dimensions: { width: 728, height: 90 } },
    { value: 'article_sidebar', label: 'Artigos - Sidebar', dimensions: { width: 300, height: 250 } },
    { value: 'article_content', label: 'Artigos - Entre Conteúdo', dimensions: { width: 336, height: 280 } },
    { value: 'site_header', label: 'Site - Topo Fixo (Todas Páginas)', dimensions: { width: 970, height: 90 } },
]
