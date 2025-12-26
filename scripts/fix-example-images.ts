
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const updates = [
    { slug: 'reajuste-medio-planos-saude-2024', image: '/healthcare-operators-increase.jpg' },
    { slug: 'healthtechs-investimentos-2024', image: '/modern-healthcare-building.jpg' },
    { slug: 'fusoes-aquisicoes-saude-2024', image: '/business-executive-professional.jpg' },
    { slug: 'avancos-na-telemedicina-no-brasil', image: '/smartphone-health-app.jpg' },
    { slug: 'nova-regulacao-ans-2026', image: '/ans-building-court.jpg' },
    { slug: 'evento-gestao-hospitalar-sp', image: '/conference-healthcare-panel.jpg' },
    { slug: 'inteligencia-artificial-diagnostico', image: '/modern-healthcare-building.jpg' },
    { slug: 'dicas-lideranca-medicos', image: '/professional-man.jpg' },
    { slug: 'vacinacao-o-que-muda-este-ano', image: '/healthcare-launch-event.jpg' },
    { slug: 'wearables-monitoramento-remoto', image: '/smartphone-health-app.jpg' },
]

async function fixImages() {
    console.log('🔧 Fixing post images...')

    for (const update of updates) {
        const { error } = await supabase
            .from('posts')
            .update({ cover_image_url: update.image })
            .eq('slug', update.slug)

        if (error) {
            console.error(`❌ Error updating ${update.slug}:`, error)
        } else {
            console.log(`✅ Updated ${update.slug} to ${update.image}`)
        }
    }
}

fixImages()
