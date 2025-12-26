import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ docs: [] })
    }

    try {
        const supabase = await createClient()

        // Busca posts que contenham o termo no título ou resumo
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                category:categories(id, title, slug),
                author:columnists(id, name, slug, avatar_url),
                featured_image:media(id, url, alt_text)
            `)
            .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
            .eq('status', 'published')
            .limit(20)

        if (error) {
            throw error
        }

        return NextResponse.json({ docs: data || [] })
    } catch (error) {
        console.error('Erro na API de busca:', error)
        return NextResponse.json({ error: 'Erro ao processar busca' }, { status: 500 })
    }
}
