import dotenv from 'dotenv'
import { readFileSync } from 'fs'

console.log('=== DEBUG ENV VARIABLES ===\n')

// Carregar .env
dotenv.config()

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('URL:', url)
console.log('KEY length:', key?.length)
console.log('KEY (first 100 chars):', key?.substring(0, 100))

// Ler arquivo diretamente
try {
  const envContent = readFileSync('.env', 'utf-8')
  const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)
  if (match) {
    console.log('\n=== DIRETO DO ARQUIVO .env ===')
    console.log('KEY from file:', match[1].substring(0, 100))
  }
} catch (e) {
  console.log('Erro ao ler .env:', e)
}
