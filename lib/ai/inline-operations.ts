/**
 * AI Inline Operations for Editor
 * Operations that can be performed on selected text
 */

import { openrouter } from './openrouter'

export type InlineOperationType =
  | 'rewrite'
  | 'expand'
  | 'summarize'
  | 'translate'
  | 'adjust_tone'
  | 'fix_grammar'
  | 'simplify'

export type ToneType =
  | 'formal'
  | 'casual'
  | 'professional'
  | 'friendly'
  | 'academic'

export type TranslateLanguage =
  | 'en'
  | 'es'
  | 'pt'
  | 'fr'
  | 'de'

export interface InlineOperationResult {
  original: string
  result: string
  operation: InlineOperationType
  metadata?: Record<string, any>
}

/**
 * Rewrite text with different styles
 */
export async function rewriteText(
  text: string,
  style: 'more_formal' | 'more_casual' | 'more_concise' | 'more_detailed' | 'different'
): Promise<InlineOperationResult> {
  const styleInstructions: Record<typeof style, string> = {
    more_formal: 'Rewrite in a more formal, professional tone. Use proper grammar and sophisticated vocabulary.',
    more_casual: 'Rewrite in a more casual, conversational tone. Make it friendly and approachable.',
    more_concise: 'Rewrite to be more concise. Remove unnecessary words while keeping the meaning.',
    more_detailed: 'Expand with more details and explanations. Add context and examples.',
    different: 'Rewrite completely using different words and sentence structure, but keep the same meaning.'
  }

  const prompt = `${styleInstructions[style]}

TEXT TO REWRITE:
${text}

Return ONLY the rewritten text, nothing else.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.7,
    maxTokens: Math.max(text.length * 2, 500)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'rewrite',
    metadata: { style }
  }
}

/**
 * Expand text with more details
 */
export async function expandText(
  text: string,
  context?: string
): Promise<InlineOperationResult> {
  const prompt = `Expand this text with more details, examples, and explanations.
${context ? `Context: ${context}` : ''}

TEXT TO EXPAND:
${text}

Return the expanded text in the same style and format. Add 2-3 more sentences or a short paragraph.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.7,
    maxTokens: Math.max(text.length * 3, 800)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'expand'
  }
}

/**
 * Summarize text
 */
export async function summarizeText(
  text: string,
  maxLength?: number
): Promise<InlineOperationResult> {
  const prompt = `Summarize this text concisely${maxLength ? ` in about ${maxLength} characters` : ''}.
Keep the main points and important information.

TEXT TO SUMMARIZE:
${text}

Return ONLY the summary, nothing else.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.3,
    maxTokens: maxLength ? Math.ceil(maxLength / 3) : 300
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'summarize'
  }
}

/**
 * Translate text
 */
export async function translateText(
  text: string,
  targetLanguage: TranslateLanguage,
  sourceLanguage?: string
): Promise<InlineOperationResult> {
  const languageNames: Record<TranslateLanguage, string> = {
    en: 'English',
    es: 'Spanish',
    pt: 'Portuguese (Brazilian)',
    fr: 'French',
    de: 'German'
  }

  const prompt = `Translate this text to ${languageNames[targetLanguage]}.
Maintain the same tone, style, and formatting.

TEXT TO TRANSLATE:
${text}

Return ONLY the translated text, nothing else.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.3,
    maxTokens: Math.max(text.length * 2, 500)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'translate',
    metadata: { targetLanguage, sourceLanguage }
  }
}

/**
 * Adjust tone of text
 */
export async function adjustTone(
  text: string,
  targetTone: ToneType
): Promise<InlineOperationResult> {
  const toneDescriptions: Record<ToneType, string> = {
    formal: 'formal and professional, suitable for business communication',
    casual: 'casual and conversational, like talking to a friend',
    professional: 'professional but approachable, balancing expertise with accessibility',
    friendly: 'warm and friendly, engaging and personable',
    academic: 'academic and scholarly, precise and well-referenced'
  }

  const prompt = `Rewrite this text to have a ${toneDescriptions[targetTone]} tone.
Keep the same information and meaning.

TEXT:
${text}

Return ONLY the rewritten text, nothing else.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.6,
    maxTokens: Math.max(text.length * 1.5, 500)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'adjust_tone',
    metadata: { targetTone }
  }
}

/**
 * Fix grammar and spelling
 */
export async function fixGrammar(text: string): Promise<InlineOperationResult> {
  const prompt = `Fix any grammar, spelling, and punctuation errors in this text.
Keep the original meaning and style. Only fix errors, don't rewrite.

TEXT:
${text}

Return ONLY the corrected text, nothing else. If there are no errors, return the original text.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.1,
    maxTokens: Math.max(text.length * 1.2, 300)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'fix_grammar'
  }
}

/**
 * Simplify complex text
 */
export async function simplifyText(text: string): Promise<InlineOperationResult> {
  const prompt = `Simplify this text to make it easier to understand.
Use simpler words and shorter sentences. Maintain the core meaning.

TEXT:
${text}

Return ONLY the simplified text, nothing else.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.5,
    maxTokens: Math.max(text.length * 1.2, 400)
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'simplify'
  }
}

/**
 * Continue writing from text
 */
export async function continueWriting(
  text: string,
  context?: string,
  style?: string
): Promise<InlineOperationResult> {
  const prompt = `Continue writing from where this text ends.
${context ? `Context: ${context}` : ''}
${style ? `Style: ${style}` : 'Match the existing style and tone.'}

TEXT:
${text}

Write a natural continuation (1-2 paragraphs). Return ONLY the continuation, not the original text.`

  const result = await openrouter.generate(prompt, {
    temperature: 0.8,
    maxTokens: 500
  })

  return {
    original: text,
    result: result.trim(),
    operation: 'expand',
    metadata: { type: 'continue' }
  }
}

/**
 * Generate alternative versions
 */
export async function generateAlternatives(
  text: string,
  count: number = 3
): Promise<string[]> {
  const prompt = `Generate ${count} alternative versions of this text.
Each version should convey the same meaning but with different wording.

TEXT:
${text}

Return a JSON array of ${count} alternative texts:
["alternative 1", "alternative 2", "alternative 3"]`

  const result = await openrouter.generate(prompt, {
    temperature: 0.8,
    maxTokens: text.length * count * 1.5
  })

  try {
    const match = result.match(/\[[\s\S]*\]/)
    if (match) {
      return JSON.parse(match[0])
    }
  } catch {
    // If parsing fails, return single result
  }

  return [result.trim()]
}

/**
 * Check if AI operations are available
 */
export function isAIAvailable(): boolean {
  return openrouter.isConfigured()
}
