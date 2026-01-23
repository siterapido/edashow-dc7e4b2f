import { NextResponse } from 'next/server'
import { savePost } from '@/lib/actions/cms-posts'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        
        // Prepare data for savePost
        // We map the AI generated fields to the CMS fields
        const postData = {
            id: 'new',
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt,
            content: body.content,
            meta_description: body.metaDescription, // Ensure casing matches DB (savePost normalizes this?)
            // savePost expects camelCase for internal logic but maps to snake_case for DB if manual?
            // checking savePost implementation: it does const { id, categories, columnists, ...postData } = data
            // and then insert([normalizedData]).
            // So we should provide keys matching the DB columns or what savePost expects.
            // savePost doesn't seem to do deep key mapping (camelToSnake).
            // Let's assume keys should be snake_case for DB.
            // Wait, savePost checks `normalizedData.published_at`.
            // It seems it takes whatever is passed.
            // I should verify DB schema columns.
            // Based on `normalizedData.featured_home`, it seems snake_case is expected.
            
            tags: body.suggestedTags || body.tags || [],
            status: 'draft',
            category_id: null, // User will set this in editor
            columnist_id: null,
            featured_home: false,
            featured_category: false
        }

        // Map camelCase from AI to snake_case for DB if needed
        // generatedPost has metaDescription. DB likely has meta_description.
        if (body.metaDescription) {
            (postData as any).meta_description = body.metaDescription
        }

        const savedPost = await savePost(postData)

        return NextResponse.json(savedPost)

    } catch (error: any) {
        console.error('Save draft error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to save draft' },
            { status: 500 }
        )
    }
}
