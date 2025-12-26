import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Try direct connection instead of pooler
const projectRef = 'exeuuqbgyfaxgbwygfuu'
const password = 'Gi1hnQuYVo0zr7Eo'
const directUri = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`

console.log('Testing DIRECT connection to:', directUri.replace(/:([^@]+)@/, ':****@'))

async function test() {
    const client = new pg.Client({
        connectionString: directUri,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        await client.connect()
        console.log('✅ DIRECT connection successful!')
        await client.end()
    } catch (err) {
        console.error('❌ DIRECT connection failed:', err)
        process.exit(1)
    }
}

test()
