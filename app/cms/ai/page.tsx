import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AIDashboard } from './AIDashboard'

export const metadata: Metadata = {
    title: 'AI Studio | EDA CMS',
    description: 'Ferramentas de IA para criação de conteúdo'
}

export default async function AIPage() {
    const supabase = await createClient()

    // Get AI usage stats
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: generations } = await supabase
        .from('ai_generations')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10)

    // Get scheduled posts
    const { data: scheduledPosts } = await supabase
        .from('scheduled_posts')
        .select(`
            id,
            scheduled_for,
            status,
            posts (id, title, slug, cover_image_url)
        `)
        .eq('status', 'pending')
        .order('scheduled_for', { ascending: true })
        .limit(5)

    // Get recent AI-generated posts
    const { data: recentPosts } = await supabase
        .from('posts')
        .select('id, title, slug, status, created_at, cover_image_url')
        .order('created_at', { ascending: false })
        .limit(5)

    // Calculate stats
    const stats = {
        totalGenerations: generations?.length || 0,
        totalTokens: generations?.reduce((sum, g) => sum + (g.tokens_used || 0), 0) || 0,
        totalCost: generations?.reduce((sum, g) => sum + parseFloat(g.cost_usd || '0'), 0) || 0,
        scheduledCount: scheduledPosts?.length || 0
    }

    return (
        <AIDashboard
            stats={stats}
            recentGenerations={generations || []}
            scheduledPosts={scheduledPosts || []}
            recentPosts={recentPosts || []}
        />
    )
}
