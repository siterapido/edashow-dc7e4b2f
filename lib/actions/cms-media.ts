'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getMedia() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function uploadMedia(formData: FormData) {
    const supabase = await createClient()
    const file = formData.get('file') as File
    const filename = `${Date.now()}-${file.name}`

    // 1. Upload file to storage
    const { data: storageData, error: storageError } = await supabase.storage
        .from('edashow-media')
        .upload(filename, file)

    if (storageError) throw storageError

    // 2. Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('edashow-media')
        .getPublicUrl(filename)

    // 3. Save reference in media table
    const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert([
            {
                filename,
                url: publicUrl,
                mime_type: file.type,
                filesize: file.size,
                title: file.name
            }
        ])
        .select()
        .single()

    if (mediaError) throw mediaError

    revalidatePath('/cms/media')
    return mediaData
}

export async function deleteMedia(id: string, filename: string) {
    const supabase = await createClient()

    // 1. Delete from storage
    const { error: storageError } = await supabase.storage
        .from('edashow-media')
        .remove([filename])

    if (storageError) throw storageError

    // 2. Delete from database
    const { error: dbError } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

    if (dbError) throw dbError

    revalidatePath('/cms/media')
}
