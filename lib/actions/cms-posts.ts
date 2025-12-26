'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPost(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('posts')
        .select('*, categories(*), columnists(*)')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function savePost(data: any) {
    const supabase = await createClient()
    const { id, categories, columnists, ...postData } = data

    let result
    if (id === 'new' || !id) {
        result = await supabase.from('posts').insert([postData]).select().single()
    } else {
        result = await supabase.from('posts').update(postData).eq('id', id).select().single()
    }

    if (result.error) throw result.error

    revalidatePath('/cms/posts')
    revalidatePath('/')
    revalidatePath(`/posts/${result.data.slug}`)
    return result.data
}

export async function autoSavePost(data: any) {
    const supabase = await createClient()
    const { id, categories, columnists, ...postData } = data

    if (!id || id === 'new') return null // Can't auto-save a new post without ID

    const { data: result, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return result
}


export async function deletePost(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/cms/posts')
    revalidatePath('/')
}

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data
}

export async function getColumnists() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('columnists').select('*').order('name')
    if (error) throw error
    return data
}
