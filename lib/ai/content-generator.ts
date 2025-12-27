/**
 * Content Generator Service
 * Uses OpenRouter to generate post content, titles, excerpts, and meta tags
 */

import { openrouter, MODELS, OpenRouterMessage } from './openrouter'
import { createClient } from '@/lib/supabase/server'

export interface PostGenerationConfig {
    topic: string
    keywords?: string[]
    tone?: 'professional' | 'casual' | 'formal' | 'friendly'
    wordCount?: number
    additionalInstructions?: string
    model?: string
}

export interface GeneratedPost {
    title: string
    slug: string
    excerpt: string
    content: string
    metaDescription: string
    suggestedTags: string[]
    suggestedCategory?: string
}

interface GenerationResult {
    data: GeneratedPost
    tokensUsed: number
    model: string
    cost: number
}

/**
 * Get the system prompt from settings or use default
 */
async function getSystemPrompt(): Promise<string> {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('ai_settings')
            .select('setting_value')
            .eq('setting_key', 'system_prompt')
            .single()

        if (data?.setting_value) {
            return typeof data.setting_value === 'string'
                ? JSON.parse(data.setting_value)
                : data.setting_value
        }
    } catch (error) {
        console.warn('Could not load system prompt from settings:', error)
    }

    return `Você é um redator especialista em saúde e odontologia para o portal EDA Show. 
Escreva conteúdo informativo, preciso e envolvente em português brasileiro. 
Mantenha um tom profissional mas acessível.
Use formatação Markdown para estruturar o conteúdo.`
}

/**
 * Get a prompt template from the database
 */
async function getPromptTemplate(category: string, name: string): Promise<string | null> {
    try {
        const supabase = await createClient()
        const { data } = await supabase
            .from('ai_prompts')
            .select('prompt_template')
            .eq('category', category)
            .eq('name', name)
            .eq('is_active', true)
            .single()

        return data?.prompt_template || null
    } catch {
        return null
    }
}

/**
 * Replace template variables with actual values
 */
function fillTemplate(template: string, variables: Record<string, string>): string {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '')
    }
    return result
}

/**
 * Generate a complete blog post
 */
export async function generatePost(config: PostGenerationConfig): Promise<GenerationResult> {
    const systemPrompt = await getSystemPrompt()

    // Try to get the template from database
    let promptTemplate = await getPromptTemplate('post', 'Gerar Post Completo')

    if (!promptTemplate) {
        // Fallback template
        promptTemplate = `Escreva um artigo completo sobre o seguinte tópico: {{topic}}

Palavras-chave para SEO: {{keywords}}

Diretrizes:
- Escreva em português brasileiro
- Use um tom {{tone}}
- O artigo deve ter aproximadamente {{word_count}} palavras
- Inclua uma introdução cativante
- Divida o conteúdo em seções com subtítulos H2
- Termine com uma conclusão

{{additional_instructions}}

Responda em formato JSON com a estrutura:
{
  "title": "título do artigo",
  "excerpt": "resumo em 2-3 frases",
  "content": "conteúdo completo em Markdown",
  "metaDescription": "descrição SEO de até 160 caracteres",
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "suggestedCategory": "categoria sugerida"
}`
    }

    const prompt = fillTemplate(promptTemplate, {
        topic: config.topic,
        keywords: config.keywords?.join(', ') || '',
        tone: config.tone || 'professional',
        word_count: String(config.wordCount || 800),
        additional_instructions: config.additionalInstructions || ''
    })

    const messages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
    ]

    const response = await openrouter.chat({
        model: config.model || MODELS.CLAUDE_HAIKU,
        messages,
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content || '{}'
    let parsed: Partial<GeneratedPost>

    try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        parsed = JSON.parse(jsonMatch?.[0] || content)
    } catch {
        throw new Error('Failed to parse AI response as JSON')
    }

    // Generate slug from title
    const slug = (parsed.title || config.topic)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const tokensUsed = (response.usage?.prompt_tokens || 0) + (response.usage?.completion_tokens || 0)
    const cost = openrouter.calculateCost(
        response.model,
        response.usage?.prompt_tokens || 0,
        response.usage?.completion_tokens || 0
    )

    return {
        data: {
            title: parsed.title || config.topic,
            slug,
            excerpt: parsed.excerpt || '',
            content: parsed.content || '',
            metaDescription: parsed.metaDescription || '',
            suggestedTags: parsed.suggestedTags || [],
            suggestedCategory: parsed.suggestedCategory
        },
        tokensUsed,
        model: response.model,
        cost
    }
}

/**
 * Generate multiple title options for SEO
 */
export async function generateTitles(
    topic: string,
    keywords: string[],
    count: number = 5
): Promise<string[]> {
    const prompt = `Gere ${count} opções de títulos otimizados para SEO para um artigo sobre: ${topic}

Palavras-chave principais: ${keywords.join(', ')}

Requisitos:
- Máximo de 60 caracteres cada
- Inclua a palavra-chave principal
- Seja atrativo e claro
- Evite clickbait

Responda em JSON: { "titles": ["título 1", "título 2", ...] }`

    const result = await openrouter.generateJSON<{ titles: string[] }>(prompt)
    return result.titles || []
}

/**
 * Generate an excerpt from content
 */
export async function generateExcerpt(content: string, maxLength: number = 160): Promise<string> {
    const prompt = `Crie um resumo atrativo para o seguinte conteúdo, com no máximo ${maxLength} caracteres:

${content.substring(0, 2000)}

Responda apenas com o resumo, sem aspas ou formatação extra.`

    return openrouter.generate(prompt, {
        maxTokens: 100,
        temperature: 0.5
    })
}

/**
 * Generate SEO-optimized meta description
 */
export async function generateMetaDescription(
    title: string,
    content: string,
    keywords: string[]
): Promise<string> {
    const prompt = `Crie uma meta description SEO para:

Título: ${title}
Palavras-chave: ${keywords.join(', ')}
Conteúdo (início): ${content.substring(0, 1000)}

Requisitos:
- Máximo de 160 caracteres
- Inclua palavra-chave principal naturalmente
- Seja convincente e descritivo
- Incentive o clique

Responda apenas com a meta description.`

    return openrouter.generate(prompt, {
        maxTokens: 100,
        temperature: 0.5
    })
}

/**
 * Improve existing content with AI suggestions
 */
export async function improveContent(
    content: string,
    type: 'clarity' | 'seo' | 'engagement' | 'grammar'
): Promise<string> {
    const instructions = {
        clarity: 'Melhore a clareza e fluidez do texto, tornando-o mais fácil de ler.',
        seo: 'Otimize o texto para SEO, adicionando subtítulos, listas e melhor estrutura.',
        engagement: 'Torne o texto mais envolvente e interessante para o leitor.',
        grammar: 'Corrija erros gramaticais e melhore a escrita mantendo o significado.'
    }

    const prompt = `${instructions[type]}

Conteúdo original:
${content}

Mantenha o mesmo tamanho aproximado e formato Markdown. Retorne apenas o conteúdo melhorado.`

    return openrouter.generate(prompt, {
        temperature: 0.5,
        maxTokens: 4000
    })
}

/**
 * Log generation to database for tracking
 */
export async function logGeneration(
    type: string,
    inputData: Record<string, unknown>,
    outputData: Record<string, unknown>,
    model: string,
    tokensUsed: number,
    costUsd: number
): Promise<void> {
    try {
        const supabase = await createClient()
        await supabase.from('ai_generations').insert({
            type,
            input_data: inputData,
            output_data: outputData,
            model_used: model,
            tokens_used: tokensUsed,
            cost_usd: costUsd,
            status: 'completed'
        })
    } catch (error) {
        console.error('Failed to log AI generation:', error)
    }
}
