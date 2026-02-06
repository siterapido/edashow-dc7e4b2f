import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getPublicSupabaseClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        console.warn('Supabase env vars not available (build time?). Returning null client.')
        return null
    }

    return createClient(url, key)
}
