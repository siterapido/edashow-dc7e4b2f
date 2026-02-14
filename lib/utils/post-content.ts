/**
 * Normaliza o HTML do conteudo do post
 * Remove TODAS as tags blockquote e converte o conteudo para paragrafos normais
 */
export function normalizePostContent(html: string): string {
  if (!html) return ''

  // Remove espacos em branco do inicio e fim
  let content = html.trim()

  // Remove TODAS as tags de abertura e fechamento de blockquote
  // Isso garante que nenhum blockquote seja renderizado como citacao
  content = content.replace(/<\/?blockquote[^>]*>/gi, '')

  // Remove espacos extras que possam ter sobrado
  content = content.trim()

  // Se o conteudo resultante estiver vazio, retorna string vazia
  if (!content) return ''

  // Se o conteudo nao tem tags <p>, envolve em paragrafos
  if (!content.includes('<p>') && !content.includes('<h1>') && !content.includes('<h2>') &&
    !content.includes('<h3>') && !content.includes('<ul>') && !content.includes('<ol>')) {
    // Divide por quebras de linha e cria paragrafos
    const paragraphs = content
      .split(/\n\n+/)
      .filter(p => p.trim())
      .map(p => `<p>${p.trim()}</p>`)
      .join('\n')
    return paragraphs
  }

  return content
}
