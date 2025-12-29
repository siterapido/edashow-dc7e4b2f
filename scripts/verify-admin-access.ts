import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
    process.exit(1)
}

// Hardcoded values from .env.local to avoid environment issues
const supabaseUrl = 'https://exeuuqbgyfaxgbwygfuu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZXV1cWJneWZheGdid3lnZnV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzODcyMywiZXhwIjoyMDgxOTE0NzIzfQ.J5mkzxBP2XNq_I5cqo7TeY1HxpqCbR38qnXg1eyL2PI'
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TARGET_EMAIL = 'admin@edashow.com.br'
const TARGET_PASSWORD = '@Admin2025'

async function main() {
    console.log(`Checking user: ${TARGET_EMAIL}...`)

    // 1. Check if user exists (using getUser wouldn't work easily for admin check without looping, 
    // so we rely on admin.listUsers or just try to sign in / create)
    // Cleaner approach with admin api:
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('Error listing users:', listError)
        process.exit(1)
    }

    let user = users.find(u => u.email === TARGET_EMAIL)

    if (!user) {
        console.log('User not found. Creating...')
        const { data, error: createError } = await supabase.auth.admin.createUser({
            email: TARGET_EMAIL,
            password: TARGET_PASSWORD,
            email_confirm: true
        })

        if (createError) {
            console.error('Error creating user:', createError)
            process.exit(1)
        }
        user = data.user
        console.log('User created successfully:', user.id)
    } else {
        console.log('User found:', user.id)
        console.log('Updating password...')
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password: TARGET_PASSWORD }
        )
        if (updateError) {
            console.error('Error updating password:', updateError)
            process.exit(1)
        }
        console.log('Password updated successfully.')
    }

    // 2. Check Role
    console.log('Checking user role...')
    const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "one row expected" (not found if using single)
        console.error('Error fetching role:', roleError)
        // Don't exit, might just need to insert
    }

    if (!roleData || roleData.role !== 'admin') {
        console.log(`Role is currently: ${roleData?.role || 'null'}. Setting to 'admin'...`)

        // Upsert role
        const { error: upsertError } = await supabase
            .from('user_roles')
            .upsert({
                user_id: user.id,
                role: 'admin'
            }, { onConflict: 'user_id' })

        if (upsertError) {
            console.error('Error setting admin role:', upsertError)
            process.exit(1)
        }
        console.log('Role set to admin successfully.')
    } else {
        console.log('User already has admin role.')
    }

    console.log('Verification complete. You should be able to login now.')
}

main().catch(err => {
    console.error('Global error:', err)
    process.exit(1)
})
