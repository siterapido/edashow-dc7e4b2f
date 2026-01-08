/**
 * Script de diagnóstico para verificar o HTML dos posts
 * Uso: npx tsx lib/scripts/check-posts-html.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias')
  console.error('   Verifique se o arquivo .env.local existe e contém essas variáveis.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPostsHTML() {
  console.log('🔍 Verificando HTML dos posts publicados...\n')

  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, content')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('❌ Erro ao buscar posts:', error)
    return
  }

  if (!posts || posts.length === 0) {
    console.log('ℹ️  Nenhum post encontrado')
    return
  }

  posts.forEach((post, index) => {
    const contentStart = post.content?.substring(0, 200) || ''
    const hasBlockquote = contentStart.trim().startsWith('<blockquote>')
    const hasParagraph = contentStart.trim().startsWith('<p>')

    console.log(`\n${index + 1}. **${post.title}** (ID: ${post.id})`)
    console.log(`   URL: /posts/${post.id}`)
    console.log(`   Início do HTML:`)
    console.log(`   ${contentStart}`)

    if (hasBlockquote) {
      console.log(`   ⚠️  COMEÇA COM <blockquote> - Problema confirmado!`)
    } else if (hasParagraph) {
      console.log(`   ✅ COMEÇA COM <p> - HTML correto`)
    } else {
      console.log(`   ❓ Formato desconhecido`)
    }

    // Conta quantos blockquotes e parágrafos tem
    const blockquoteCount = (post.content?.match(/<blockquote>/g) || []).length
    const paragraphCount = (post.content?.match(/<p>/g) || []).length

    console.log(`   Estatísticas: ${paragraphCount} <p>, ${blockquoteCount} <blockquote>`)
  })

  console.log('\n---')
  console.log('✨ Verificação concluída!')
}

checkPostsHTML().catch(console.error)
