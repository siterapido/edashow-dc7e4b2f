/**
 * Audio Transcription Service
 * Uses Groq Whisper for high-quality FREE transcription
 */

export interface TranscriptionResult {
  text: string
  duration?: number
  language?: string
  segments?: TranscriptionSegment[]
}

export interface TranscriptionSegment {
  id: number
  start: number
  end: number
  text: string
}

export interface ProcessedTranscription {
  title: string
  excerpt: string
  content: string
  rawText: string
  duration?: number
}

// Groq API for free Whisper
const GROQ_API_URL = 'https://api.groq.com/openai/v1'

/**
 * Transcribe audio file using Groq Whisper (FREE)
 */
export async function transcribeAudio(
  audioFile: File | Blob,
  options: {
    language?: string
    prompt?: string
  } = {}
): Promise<TranscriptionResult> {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured. Get a free key at https://console.groq.com')
  }

  const formData = new FormData()
  formData.append('file', audioFile)
  formData.append('model', 'whisper-large-v3-turbo') // Fast and accurate
  formData.append('response_format', 'verbose_json')

  if (options.language) {
    formData.append('language', options.language)
  }

  if (options.prompt) {
    formData.append('prompt', options.prompt)
  }

  const response = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    },
    body: formData
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `Transcription failed: ${response.statusText}`)
  }

  const data = await response.json()

  return {
    text: data.text,
    duration: data.duration,
    language: data.language,
    segments: data.segments?.map((seg: any) => ({
      id: seg.id,
      start: seg.start,
      end: seg.end,
      text: seg.text
    }))
  }
}

/**
 * Process transcription into structured content
 * - Cleans up text
 * - Divides into paragraphs
 * - Generates title and excerpt
 */
export async function processTranscription(
  transcription: TranscriptionResult
): Promise<ProcessedTranscription> {
  const { openrouter } = await import('./openrouter')

  const rawText = transcription.text

  // If OpenRouter is not configured, do basic processing
  if (!openrouter.isConfigured()) {
    return basicProcessing(rawText, transcription.duration)
  }

  const prompt = `Process this transcribed audio into a well-structured blog post.

TRANSCRIPTION:
${rawText}

INSTRUCTIONS:
1. Remove filler words (um, uh, you know, etc) and repetitions
2. Fix grammar and punctuation
3. Divide into logical paragraphs with proper HTML formatting
4. Create a compelling title
5. Write a brief excerpt (2-3 sentences)
6. Format content with proper headings (h2, h3) where appropriate

Return JSON in this exact format:
{
  "title": "The article title",
  "excerpt": "Brief summary of the content",
  "content": "<p>First paragraph...</p><p>Second paragraph...</p>"
}

Important: Return ONLY valid JSON, no markdown code blocks.`

  try {
    const result = await openrouter.generateJSON<{
      title: string
      excerpt: string
      content: string
    }>(prompt, {
      temperature: 0.3,
      maxTokens: 4000
    })

    return {
      title: result.title,
      excerpt: result.excerpt,
      content: result.content,
      rawText,
      duration: transcription.duration
    }
  } catch (error) {
    console.error('AI processing failed, using basic processing:', error)
    return basicProcessing(rawText, transcription.duration)
  }
}

/**
 * Basic text processing without AI
 */
function basicProcessing(text: string, duration?: number): ProcessedTranscription {
  // Clean up text
  const cleaned = text
    .replace(/\b(um|uh|er|ah|you know|like|basically|actually)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Split into sentences
  const sentences = cleaned.split(/(?<=[.!?])\s+/)

  // Group sentences into paragraphs (roughly 3-4 sentences each)
  const paragraphs: string[] = []
  let currentParagraph: string[] = []

  sentences.forEach((sentence, i) => {
    currentParagraph.push(sentence)
    if (currentParagraph.length >= 4 || i === sentences.length - 1) {
      paragraphs.push(currentParagraph.join(' '))
      currentParagraph = []
    }
  })

  // Generate title from first sentence
  const firstSentence = sentences[0] || 'Untitled'
  const title = firstSentence.length > 60
    ? firstSentence.slice(0, 57) + '...'
    : firstSentence.replace(/[.!?]$/, '')

  // Generate excerpt from first paragraph
  const excerpt = paragraphs[0]?.slice(0, 200) || ''

  // Format content as HTML
  const content = paragraphs
    .map(p => `<p>${p}</p>`)
    .join('\n')

  return {
    title,
    excerpt,
    content,
    rawText: text,
    duration
  }
}

/**
 * Check if transcription service is available
 */
export function isTranscriptionAvailable(): boolean {
  return !!process.env.GROQ_API_KEY
}

/**
 * Get supported audio formats
 */
export function getSupportedFormats(): string[] {
  return ['mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm']
}

/**
 * Validate audio file
 */
export function validateAudioFile(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 25 * 1024 * 1024 // 25MB (Whisper limit)
  const supportedTypes = [
    'audio/mp3',
    'audio/mpeg',
    'audio/mp4',
    'audio/m4a',
    'audio/wav',
    'audio/webm',
    'audio/x-m4a',
    'video/mp4',
    'video/webm'
  ]

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is 25MB, your file is ${(file.size / 1024 / 1024).toFixed(1)}MB`
    }
  }

  const isSupported = supportedTypes.some(type =>
    file.type.includes(type.split('/')[1])
  ) || /\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i.test(file.name)

  if (!isSupported) {
    return {
      valid: false,
      error: `Unsupported format. Please use: ${getSupportedFormats().join(', ')}`
    }
  }

  return { valid: true }
}
