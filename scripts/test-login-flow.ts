import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Hardcoded values to match previous success and avoid env issues
const supabaseUrl = 'https://exeuuqbgyfaxgbwygfuu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZXV1cWJneWZheGdid3lnZnV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzg3MjMsImV4cCI6MjA4MTkxNDcyM30.AqoMOlv-7oRl3X6-q9qmufnqY3pw_lUpJ_Onuv26Sq0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const TARGET_EMAIL = 'admin@edashow.com.br'
const TARGET_PASSWORD = '@Admin2025'

async function main() {
    console.log(`Attempting login for: ${TARGET_EMAIL}...`)

    const { data, error } = await supabase.auth.signInWithPassword({
        email: TARGET_EMAIL,
        password: TARGET_PASSWORD
    })

    if (error) {
        console.error('Login failed:', error.message)
        process.exit(1)
    }

    const user = data.user
    console.log('Login successful! User ID:', user.id)

    // Verify RLS: Try to read user role
    console.log('Attempting to read user_roles with logged in user...')

    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (roleError) {
        console.error('Error reading user role (RLS check failed?):', roleError)
        process.exit(1)
    }

    console.log('Role read successfully:', roleData)

    if (roleData.role !== 'admin') {
        console.error(`Unexpected role: ${roleData.role}`)
        process.exit(1)
    }

    console.log('SUCCESS: User can login and read their admin role.')
}

main().catch(err => {
    console.error('Global error:', err)
    process.exit(1)
})
