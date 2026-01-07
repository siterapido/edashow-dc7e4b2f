/**
 * Script para criar usuário EDA e atualizar todos os posts
 * Uso: pnpm tsx scripts/create-eda-user-and-update-posts.ts
 */

import dotenv from 'dotenv'
import { createAdminClient } from '../lib/supabase/admin.js'

// Carregar variáveis de ambiente APENAS do .env (não do .env.local)
dotenv.config({ path: '.env' })

// Criar cliente admin (já remove whitespace/newlines da chave)
const supabase = createAdminClient()

async function main() {
  console.log('🚀 Iniciando criação de usuário EDA e atualização de posts...\n')

  // 1. Criar usuário de autenticação
  console.log('📧 Criando usuário de autenticação...')
  const email = 'eda@edashow.com.br'
  const password = '@Edashow2026#'
  const name = 'EDA Show'

  try {
    // Verificar se usuário já existe
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single()

    let userId: string

    if (existingUser && !checkError) {
      console.log('   ℹ️  Usuário já existe, usando ID existente:', existingUser.id)
      userId = existingUser.id
    } else {
      // Gerar UUID para o novo usuário
      const newUserId = crypto.randomUUID()

      // Inserir diretamente na tabela auth.users (requer service role)
      // Hash da senha (bcrypt)
      // NOTA: Vamos criar apenas o profile e user_roles por enquanto
      // e depois criar o auth user via SQL

      // Criar profile primeiro
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: newUserId,
          email,
          name
        })

      if (profileError) {
        console.error('   ❌ Erro ao criar profile:', profileError.message)
        throw profileError
      }

      userId = newUserId
      console.log('   ✅ Profile criado:', userId)
      console.log('   ⚠️  Nota: Será necessário criar o auth.user via SQL manualmente')
      console.log('   ⚠️  Execute: INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)')
      console.log('   ⚠️  Ou use o painel do Supabase para criar o usuário com senha')
    }

    // Criar role de admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'admin'
      })

    if (roleError) {
      console.error('   ❌ Erro ao criar role:', roleError.message)
      throw roleError
    }

    console.log('   ✅ Role de admin atribuída\n')
  } catch (error: any) {
    console.error('❌ Erro na criação do usuário:', error.message)
    throw error
  }

  // 2. Criar colunista "Redação EDA Show"
  console.log('✍️  Criando/buscando colunista...')
  const columnistName = 'Redação EDA Show'
  const columnistSlug = 'redacao-eda-show'

  try {
    // Verificar se colunista já existe
    const { data: existingColumnist, error: checkColumnistError } = await supabase
      .from('columnists')
      .select('id')
      .eq('slug', columnistSlug)
      .single()

    let columnistId: string

    if (existingColumnist && !checkColumnistError) {
      columnistId = existingColumnist.id
      console.log('   ℹ️  Colunista já existe, usando ID existente:', columnistId)
    } else {
      // Criar novo colunista
      const { data: newColumnist, error: createColumnistError } = await supabase
        .from('columnists')
        .insert({
          name: columnistName,
          slug: columnistSlug,
          bio: 'Redação oficial do portal EDA Show',
          photo_url: '/eda-show-logo.png'
        })
        .select('id')
        .single()

      if (createColumnistError) {
        console.error('   ❌ Erro ao criar colunista:', createColumnistError.message)
        throw createColumnistError
      }

      columnistId = newColumnist.id
      console.log('   ✅ Colunista criado:', columnistId)
    }

    console.log('')

    // 3. Atualizar todos os posts
    console.log('📝 Atualizando todos os posts para o novo colunista...')

    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, columnist_id')

    if (fetchError) {
      console.error('   ❌ Erro ao buscar posts:', fetchError.message)
      throw fetchError
    }

    if (!posts || posts.length === 0) {
      console.log('   ℹ️  Nenhum post encontrado para atualizar\n')
      return
    }

    console.log(`   📊 Encontrados ${posts.length} posts\n`)

    // Atualizar cada post
    let successCount = 0
    let errorCount = 0

    for (const post of posts) {
      try {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ columnist_id: columnistId })
          .eq('id', post.id)

        if (updateError) {
          console.error(`   ❌ Erro ao atualizar post "${post.title}":`, updateError.message)
          errorCount++
        } else {
          console.log(`   ✅ Post atualizado: "${post.title}"`)
          successCount++
        }
      } catch (error: any) {
        console.error(`   ❌ Erro ao atualizar post "${post.title}":`, error.message)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('✨ Processo concluído!')
    console.log('='.repeat(50))
    console.log(`\n📊 Resumo:`)
    console.log(`   ✅ Usuário criado: ${email}`)
    console.log(`   ✅ Colunista: ${columnistName}`)
    console.log(`   📝 Posts atualizados: ${successCount}`)
    if (errorCount > 0) {
      console.log(`   ❌ Erros: ${errorCount}`)
    }
    console.log('\n🎉 Operação finalizada!\n')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    throw error
  }
}

main().catch(console.error)
