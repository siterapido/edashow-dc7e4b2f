/**
 * Teste da função de normalização de conteúdo
 */

function normalizePostContent(html: string): string {
  if (!html) return ''

  // Remove espaços em branco do início e fim
  const trimmed = html.trim()

  // Verifica se TODO o conteúdo está dentro de um único blockquote
  // Padrão: <blockquote>conteúdo</blockquote> (sem <p> antes ou depois)
  const entireContentInBlockquote = /^<blockquote>([\s\S]*)<\/blockquote>$/.test(trimmed)

  if (entireContentInBlockquote) {
    // Extrai o conteúdo dentro do blockquote
    const content = trimmed.match(/^<blockquote>([\s\S]*)<\/blockquote>$/)?.[1] || ''

    // Converte para parágrafo normal
    // Se o conteúdo já tem tags <p>, mantém
    // Se não, envolve em <p>
    if (content.includes('<p>')) {
      return content
    } else {
      // Divide por quebras de linha e cria parágrafos
      const paragraphs = content
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join('\n')
      return paragraphs
    }
  }

  // Caso contrário, retorna o HTML original (citações legítimas são preservadas)
  return trimmed
}

// Testes
console.log('🧪 Testando função de normalização...\n')

// Teste 1: Conteúdo todo em blockquote (sem <p> dentro)
const test1 = '<blockquote>Este é um post que está todo em citação.\n\nDeveria ser convertido para parágrafos normais.</blockquote>'
console.log('Teste 1 - Conteúdo todo em blockquote:')
console.log('Entrada:', test1.substring(0, 80) + '...')
console.log('Saída:', normalizePostContent(test1))
console.log()

// Teste 2: Conteúdo todo em blockquote (com <p> dentro)
const test2 = '<blockquote><p>Primeiro parágrafo</p><p>Segundo parágrafo</p></blockquote>'
console.log('Teste 2 - Blockquote com <p> dentro:')
console.log('Entrada:', test2)
console.log('Saída:', normalizePostContent(test2))
console.log()

// Teste 3: Conteúdo normal (sem blockquote envolvendo tudo)
const test3 = '<p>Primeiro parágrafo normal</p><p>Segundo parágrafo normal</p>'
console.log('Teste 3 - Conteúdo normal:')
console.log('Entrada:', test3)
console.log('Saída:', normalizePostContent(test3))
console.log()

// Teste 4: Citação legítima (com parágrafos antes e depois)
const test4 = '<p>Introdução normal</p><blockquote><p>Esta é uma citação legítima</p></blockquote><p>Conclusão normal</p>'
console.log('Teste 4 - Citação legítima (não deve ser alterada):')
console.log('Entrada:', test4)
console.log('Saída:', normalizePostContent(test4))
console.log()

// Teste 5: HTML vazio
const test5 = ''
console.log('Teste 5 - HTML vazio:')
console.log('Entrada:', '(vazio)')
console.log('Saída:', normalizePostContent(test5))
console.log()

console.log('✨ Todos os testes concluídos!')
