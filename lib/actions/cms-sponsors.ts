'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Sponsors
export async function saveSponsor(data: any) {
    const supabase = await createClient()
    const { id, ...sponsorData } = data

    let result
    if (id === 'new') {
        result = await supabase.from('sponsors').insert([sponsorData]).select().single()
    } else {
        result = await supabase.from('sponsors').update(sponsorData).eq('id', id).select().single()
    }

    if (result.error) throw result.error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
    return result.data
}

export async function deleteSponsor(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('sponsors').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

// Newsletter
export async function getNewsletterSubscribers() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function toggleSubscriberStatus(id: string, active: boolean) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ active })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/cms/newsletter')
}
