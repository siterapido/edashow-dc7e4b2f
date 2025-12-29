import { Client } from 'pg'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Use the connection string from env or hardcoded fallback if needed
const connectionString = process.env.DATABASE_URI?.trim() || 'postgresql://postgres.exeuuqbgyfaxgbwygfuu:Gi1hnQuYVo0zr7Eo@aws-1-sa-east-1.pooler.supabase.com:5432/postgres'

const client = new Client({
    connectionString,
})

async function main() {
    try {
        await client.connect()
        console.log('Connected to database.')

        // 1. List current policies
        console.log('Fetching current policies on user_roles...')
        const res = await client.query(`
      SELECT policyname, cmd, qual, with_check 
      FROM pg_policies 
      WHERE tablename = 'user_roles';
    `)

        console.log('Current policies:', res.rows)

        // 2. Drop problematic policies
        // We'll drop everything on user_roles to be safe and start fresh with a working baseline
        console.log('Dropping existing policies on user_roles...')
        for (const row of res.rows) {
            const dropQuery = `DROP POLICY "${row.policyname}" ON public.user_roles;`
            console.log(`Executing: ${dropQuery}`)
            await client.query(dropQuery)
        }

        // 3. Create Safe Policy
        // Allow users to see ONLY their own role. This avoids recursion.
        // If we need admins to see other roles, we should use a different mechanism later (e.g. view or function)
        const createPolicyQuery = `
      CREATE POLICY "Users can read own role" 
      ON public.user_roles 
      FOR SELECT 
      USING (auth.uid() = user_id);
    `
        console.log(`Creating new policy: ${createPolicyQuery}`)
        await client.query(createPolicyQuery)

        // Ensure RLS is enabled
        await client.query(`ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`)

        console.log('RLS fixed successfully.')

    } catch (err) {
        console.error('Error executing RLS fix:', err)
        process.exit(1)
    } finally {
        await client.end()
    }
}

main()
