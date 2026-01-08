'use server'

import { createClient, createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Sponsors
export async function saveSponsor(data: any) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
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

export async function getSponsor(id: string) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function deleteSponsor(id: string) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { error } = await supabase.from('sponsors').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

export async function toggleSponsorActive(id: string, active: boolean) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('sponsors')
        .update({ active })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

export async function updateSponsorOrder(sponsors: Array<{ id: string; display_order: number }>) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()

    // Update each sponsor's order
    const updates = sponsors.map(s =>
        supabase.from('sponsors').update({ display_order: s.display_order }).eq('id', s.id)
    )

    await Promise.all(updates)
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

export async function bulkDeleteSponsors(ids: string[]) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { error } = await supabase.from('sponsors').delete().in('id', ids)

    if (error) throw error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

export async function bulkToggleSponsorActive(ids: string[], active: boolean) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('sponsors')
        .update({ active })
        .in('id', ids)

    if (error) throw error
    revalidatePath('/cms/sponsors')
    revalidatePath('/')
}

export async function uploadSponsorLogo(formData: FormData) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const file = formData.get('file') as File

    if (!file) {
        throw new Error('No file provided')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = fileName

    const { data, error } = await supabase.storage
        .from('sponsors')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        })

    if (error) throw error

    const { data: publicUrlData } = supabase.storage
        .from('sponsors')
        .getPublicUrl(filePath)

    return publicUrlData.publicUrl
}

// Newsletter
export async function getNewsletterSubscribers() {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function toggleSubscriberStatus(id: string, active: boolean) {
    // Use admin client to bypass RLS
    const supabase = await createAdminClient()
    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ active })
        .eq('id', id)

    if (error) throw error
    revalidatePath('/cms/newsletter')
}
