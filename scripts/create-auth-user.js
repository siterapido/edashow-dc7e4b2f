// Script para criar usuário via Supabase Management API
// Este script usa curl via fetch para criar o usuário

import { exec } from 'child_process'

const SUPABASE_URL = 'https://exeuuqbgyfaxgbwygfuu.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4ZXV1cWJneWZheGdid3lnZnV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjMzODcyMywiZXhwIjoyMDgxOTE0NzIzfQ.J5mkzxBP2XNq_I5cqo7TeY1HxpqCbR38qnXg1eyL2PI'

async function createUser() {
  const email = 'eda@edashow.com.br'
  const password = '@Edashow2026#'

  const curlCommand = `curl -X POST '${SUPABASE_URL}/auth/v1/admin/users' \
    -H "apikey: ${SERVICE_ROLE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "${email}",
      "password": "${password}",
      "email_confirm": true,
      "user_metadata": {
        "name": "EDA Show"
      }
    }'`

  console.log('🚀 Criando usuário de autenticação...\n')
  console.log('Email:', email)
  console.log('Senha: ********\n')

  return new Promise((resolve, reject) => {
    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Erro:', error.message)
        console.error('stderr:', stderr)
        reject(error)
        return
      }

      try {
        const result = JSON.parse(stdout)
        console.log('✅ Usuário criado com sucesso!')
        console.log('ID:', result.id)
        console.log('Email:', result.email)

        // Agora adicionar role de admin
        console.log('\n📝 Adicionando role de admin...')

        const addRoleCommand = `psql "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-1-sa-east-1.pooler.supabase.com:5432/postgres" -c "INSERT INTO user_roles (user_id, role, created_at, updated_at) VALUES ('${result.id}', 'admin', NOW(), NOW()) ON CONFLICT (user_id) DO UPDATE SET role = 'admin', updated_at = NOW();"`

        exec(addRoleCommand, (roleError, roleStdout, roleStderr) => {
          if (roleError) {
            console.error('⚠️  Erro ao adicionar role (adicione manualmente):', roleError.message)
          } else {
            console.log('✅ Role de admin adicionado!')
          }
          console.log('\n🎉 Processo concluído!')
          resolve(result)
        })
      } catch (parseError) {
        console.error('Resposta:', stdout)
        console.error('stderr:', stderr)
        reject(parseError)
      }
    })
  })
}

createUser().catch(console.error)
