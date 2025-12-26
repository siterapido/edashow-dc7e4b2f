import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true })
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true })

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\s/g, '')

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createAdmin(email: string, pass: string) {
    console.log(`👤 Creating admin user: ${email}...`)

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: pass,
        email_confirm: true,
        user_metadata: { role: 'admin' }
    })

    if (error) {
        if (error.status === 422) {
            console.log('  ℹ️ User already exists.')
        } else {
            console.error('  ❌ Error creating user:', error)
        }
    } else {
        console.log('  ✅ Admin user created successfully!')
    }
}

const email = process.argv[2] || 'admin@edashow.com.br'
const password = process.argv[3] || '@Admin2026'

createAdmin(email, password)
