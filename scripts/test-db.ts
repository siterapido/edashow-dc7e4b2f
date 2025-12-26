import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('Testing connection to:', process.env.DATABASE_URI?.replace(/:([^@]+)@/, ':****@'))

async function test() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URI,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        await client.connect()
        console.log('✅ Connected successfully!')
        const res = await client.query(`
            SELECT table_name, column_name 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name IN ('theme_settings', 'home_settings', 'profiles', 'user_roles')
            ORDER BY table_name, column_name;
        `)
        console.log('--- Columns Analysis ---')
        const tables: Record<string, string[]> = {}
        res.rows.forEach(row => {
            if (!tables[row.table_name]) tables[row.table_name] = []
            tables[row.table_name].push(row.column_name)
        })
        console.log(JSON.stringify(tables, null, 2))
        await client.end()
    } catch (err) {
        console.error('❌ Connection failed:', err)
        process.exit(1)
    }
}

test()
