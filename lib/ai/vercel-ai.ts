import { createOpenAI } from '@ai-sdk/openai';

/**
 * OpenRouter Provider for Vercel AI SDK
 * OpenRouter is compatible with the OpenAI SDK
 */
export const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'EDA Show CMS',
  },
});

/**
 * Default model for generations
 */
export const DEFAULT_MODEL = 'deepseek/deepseek-chat'; // DeepSeek V3 - Excellent for writing & code
export const PREMIUM_MODEL = 'deepseek/deepseek-chat';
