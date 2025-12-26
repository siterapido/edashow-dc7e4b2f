import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { fallbackPostsFull, fallbackEvents, fallbackSponsors } from '../lib/fallback-data'
import { categoryMap } from '../lib/categories'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'
import slugify from 'slugify'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\s/g, '')

console.log(`🔍 DEBUG: URL="${supabaseUrl}"`)
console.log(`🔍 DEBUG: Key="${supabaseServiceKey.substring(0, 20)}...${supabaseServiceKey.substring(supabaseServiceKey.length - 10)}"`)

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createSupabaseClient(supabaseUrl, supabaseServiceKey)

async function migrateCategories() {
    console.log('📂 Migrating categories...')
    const categories = Object.entries(categoryMap)
    for (const [key, info] of categories) {
        const { error } = await supabase
            .from('categories')
            .upsert({
                slug: info.slug,
                name: info.label,
                description: info.description,
                display_order: 0
            }, { onConflict: 'slug' })
        if (error) console.error(`  ❌ Error migrating category ${info.slug}:`, error)
        else console.log(`  ✅ ${info.slug} done`)
    }
}

async function migrateSponsors() {
    console.log('🏢 Migrating sponsors...')
    for (const s of fallbackSponsors) {
        // Check if sponsor already exists by name
        const { data: existing } = await supabase
            .from('sponsors')
            .select('id')
            .eq('name', s.name)
            .single()

        if (existing) {
            const { error } = await supabase
                .from('sponsors')
                .update({
                    website: s.website,
                    active: s.active
                })
                .eq('id', existing.id)
            if (error) console.error(`  ❌ Error updating sponsor ${s.name}:`, error)
            else console.log(`  ✅ ${s.name} updated`)
        } else {
            const { error } = await supabase
                .from('sponsors')
                .insert({
                    name: s.name,
                    website: s.website,
                    active: s.active
                })
            if (error) console.error(`  ❌ Error inserting sponsor ${s.name}:`, error)
            else console.log(`  ✅ ${s.name} inserted`)
        }
    }
}

async function migrateEvents() {
    console.log('📅 Migrating events...')
    for (const e of fallbackEvents as any[]) {
        const { error } = await supabase
            .from('events')
            .upsert({
                slug: e.slug,
                title: e.title,
                description: e.description,
                event_date: e.startDate,
                location: e.location,
                registration_url: e.registrationUrl,
                cover_image_url: e.image,
                featured_home: e.status === 'upcoming'
            }, { onConflict: 'slug' })
        if (error) console.error(`  ❌ Error migrating event ${e.slug}:`, error)
        else console.log(`  ✅ ${e.slug} done`)
    }
}

async function migratePosts() {
    console.log('📝 Migrating posts...')
    const slugs = Object.keys(fallbackPostsFull)
    for (const slug of slugs) {
        const post = fallbackPostsFull[slug]

        // Ensure author exists
        let columnistId = null
        if (post.author) {
            const authorSlug = slugify(post.author.name, { lower: true })
            const { data: authorData } = await supabase
                .from('columnists')
                .upsert({
                    name: post.author.name,
                    slug: authorSlug,
                    bio: post.author.bio || '',
                    photo_url: '/columnists/default.jpg'
                }, { onConflict: 'slug' })
                .select('id')
                .single()

            if (authorData) columnistId = authorData.id
        }

        // Map category slug to ID
        const { data: catData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', post.category)
            .single()

        const categoryId = catData?.id

        const { error } = await supabase
            .from('posts')
            .upsert({
                slug: slug,
                title: post.title,
                subtitle: post.excerpt,
                excerpt: post.excerpt,
                content: typeof post.content === 'string' ? post.content : JSON.stringify(post.content),
                category_id: categoryId,
                columnist_id: columnistId,
                status: 'published',
                published_at: post.publishedDate,
                featured_home: post.featured || false,
                cover_image_url: post.featuredImage,
                tags: post.tags ? post.tags.map((t: any) => typeof t === 'string' ? t : (t.tag || '')) : []
            }, { onConflict: 'slug' })

        if (error) console.error(`  ❌ Error migrating post ${slug}:`, error)
        else console.log(`  ✅ ${slug} done`)
    }
}

async function main() {
    console.log('🚀 Starting Final Supabase Migration...')
    await migrateCategories()
    await migrateSponsors()
    await migrateEvents()
    await migratePosts()
    console.log('✨ All migrations finished!')
}

main()
