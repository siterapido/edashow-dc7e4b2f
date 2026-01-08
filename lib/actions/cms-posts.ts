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

    // Normalize data types for PostgreSQL
    const normalizedData: any = { ...postData }

    // Convert published_at from date string (YYYY-MM-DD) to ISO timestamp if provided
    if (normalizedData.published_at) {
        const dateStr = normalizedData.published_at
        // If it's just a date string (YYYY-MM-DD), convert to timestamp
        if (dateStr.length === 10 && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Create a date at midnight UTC and convert to ISO string
            normalizedData.published_at = new Date(dateStr + 'T00:00:00.000Z').toISOString()
        } else if (typeof dateStr === 'string') {
            // If it's already a timestamp, ensure it's valid
            normalizedData.published_at = new Date(dateStr).toISOString()
        }
    }

    // Convert empty strings to null for UUID fields
    if (normalizedData.category_id === '' || normalizedData.category_id === null) {
        normalizedData.category_id = null
    }
    if (normalizedData.columnist_id === '' || normalizedData.columnist_id === null) {
        normalizedData.columnist_id = null
    }

    // Ensure tags is an array
    if (normalizedData.tags && !Array.isArray(normalizedData.tags)) {
        normalizedData.tags = []
    }

    // Ensure boolean fields are actual booleans
    if (normalizedData.featured_home !== undefined) {
        normalizedData.featured_home = Boolean(normalizedData.featured_home)
    }

    // Ensure status is valid
    if (normalizedData.status && !['draft', 'published', 'archived'].includes(normalizedData.status)) {
        normalizedData.status = 'draft'
    }

    // Ensure slug exists and is valid (generate from title if missing)
    if (!normalizedData.slug && normalizedData.title) {
        // Simple slug generation if needed
        normalizedData.slug = normalizedData.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    // Ensure required fields for new posts
    if ((id === 'new' || !id) && !normalizedData.slug) {
        throw new Error('Slug é obrigatório para criar um novo post')
    }

    let result
    if (id === 'new' || !id) {
        result = await supabase.from('posts').insert([normalizedData]).select().single()
    } else {
        result = await supabase.from('posts').update(normalizedData).eq('id', id).select().single()
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

    // Normalize data types for PostgreSQL (same as savePost)
    const normalizedData: any = { ...postData }

    // Convert published_at from date string to ISO timestamp if provided
    if (normalizedData.published_at) {
        const dateStr = normalizedData.published_at
        if (dateStr.length === 10 && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            normalizedData.published_at = new Date(dateStr + 'T00:00:00.000Z').toISOString()
        } else if (typeof dateStr === 'string') {
            normalizedData.published_at = new Date(dateStr).toISOString()
        }
    }

    // Convert empty strings to null for UUID fields
    if (normalizedData.category_id === '' || normalizedData.category_id === null) {
        normalizedData.category_id = null
    }
    if (normalizedData.columnist_id === '' || normalizedData.columnist_id === null) {
        normalizedData.columnist_id = null
    }

    // Ensure tags is an array
    if (normalizedData.tags && !Array.isArray(normalizedData.tags)) {
        normalizedData.tags = []
    }

    const { data: result, error } = await supabase
        .from('posts')
        .update(normalizedData)
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
