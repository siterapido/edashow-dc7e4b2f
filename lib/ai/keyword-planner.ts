/**
 * Keyword Planner Service
 * Suggests keywords and analyzes topics for SEO optimization
 */

import { openrouter, MODELS } from './openrouter'

export interface KeywordSuggestion {
    primary: string[]
    secondary: string[]
    longTail: string[]
}

export interface TopicAnalysis {
    mainTopic: string
    relatedTopics: string[]
    searchIntent: 'informational' | 'navigational' | 'transactional' | 'commercial'
    difficulty: 'low' | 'medium' | 'high'
    suggestedAngle: string
}

export interface ContentIdea {
    title: string
    description: string
    keywords: string[]
    type: 'article' | 'guide' | 'listicle' | 'how-to' | 'news'
}

/**
 * Suggest keywords for a topic
 */
export async function suggestKeywords(
    topic: string,
    context?: string
): Promise<KeywordSuggestion> {
    const prompt = `Analise o seguinte tópico e sugira palavras-chave relevantes para SEO em português brasileiro:

Tópico: ${topic}
${context ? `Contexto: ${context}` : ''}

Considere:
- Palavras-chave que pessoas buscariam no Google
- Variações e sinônimos
- Palavras-chave de cauda longa (long-tail) mais específicas
- Termos relacionados à saúde e odontologia

Responda em JSON:
{
  "primary": ["até 3 palavras-chave principais de alto volume"],
  "secondary": ["até 5 palavras-chave secundárias"],
  "longTail": ["até 5 palavras-chave de cauda longa específicas"]
}`

    const result = await openrouter.generateJSON<KeywordSuggestion>(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.5
    })

    return {
        primary: result.primary || [],
        secondary: result.secondary || [],
        longTail: result.longTail || []
    }
}

/**
 * Analyze a topic for content strategy
 */
export async function analyzeTopic(topic: string): Promise<TopicAnalysis> {
    const prompt = `Analise o seguinte tópico para estratégia de conteúdo:

Tópico: ${topic}

Responda em JSON:
{
  "mainTopic": "tema principal refinado",
  "relatedTopics": ["até 5 tópicos relacionados"],
  "searchIntent": "informational ou navigational ou transactional ou commercial",
  "difficulty": "low ou medium ou high (dificuldade de rankeamento)",
  "suggestedAngle": "ângulo único sugerido para abordar o tema"
}`

    return openrouter.generateJSON<TopicAnalysis>(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.5
    })
}

/**
 * Generate content ideas based on a main topic
 */
export async function generateContentIdeas(
    topic: string,
    count: number = 5
): Promise<ContentIdea[]> {
    const prompt = `Gere ${count} ideias de conteúdo para o portal EDA Show sobre:

Tópico: ${topic}

Para cada ideia, considere:
- Diferentes formatos (artigo, guia, lista, tutorial, notícia)
- Ângulos únicos e interessantes
- Potencial de busca orgânica

Responda em JSON:
{
  "ideas": [
    {
      "title": "título sugerido",
      "description": "breve descrição do conteúdo",
      "keywords": ["palavra-chave 1", "palavra-chave 2"],
      "type": "article ou guide ou listicle ou how-to ou news"
    }
  ]
}`

    const result = await openrouter.generateJSON<{ ideas: ContentIdea[] }>(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.7
    })

    return result.ideas || []
}

/**
 * Analyze competition for keywords (simulated analysis)
 */
export async function analyzeKeywordCompetition(
    keywords: string[]
): Promise<Record<string, { competition: 'low' | 'medium' | 'high'; suggestion: string }>> {
    const prompt = `Analise a competitividade estimada destas palavras-chave para SEO no Brasil:

Palavras-chave: ${keywords.join(', ')}

Para cada palavra-chave, avalie:
- Nível de competição estimado (low/medium/high)
- Sugestão de como abordar

Responda em JSON:
{
  "${keywords[0]}": {
    "competition": "low ou medium ou high",
    "suggestion": "sugestão de abordagem"
  },
  ...
}`

    return openrouter.generateJSON(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.3
    })
}

/**
 * Suggest related topics for internal linking
 */
export async function suggestRelatedTopics(
    currentTopic: string,
    existingTopics?: string[]
): Promise<string[]> {
    const prompt = `Sugira tópicos relacionados para link interno:

Tópico atual: ${currentTopic}
${existingTopics?.length ? `Tópicos existentes no site: ${existingTopics.join(', ')}` : ''}

Sugira até 5 tópicos relacionados que poderiam ser linkados ou criados.

Responda em JSON: { "topics": ["tópico 1", "tópico 2", ...] }`

    const result = await openrouter.generateJSON<{ topics: string[] }>(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.5
    })

    return result.topics || []
}

/**
 * Extract keywords from existing content
 */
export async function extractKeywords(content: string): Promise<string[]> {
    const prompt = `Extraia as palavras-chave mais relevantes deste conteúdo:

${content.substring(0, 2000)}

Identifique até 10 palavras-chave que representam o tema principal.

Responda em JSON: { "keywords": ["keyword1", "keyword2", ...] }`

    const result = await openrouter.generateJSON<{ keywords: string[] }>(prompt, {
        model: MODELS.CLAUDE_HAIKU,
        temperature: 0.3
    })

    return result.keywords || []
}
