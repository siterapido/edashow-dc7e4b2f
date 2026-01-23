export type ToneOfVoice = 'professional' | 'casual' | 'didactic' | 'provocative';

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  basePrompt: string; // O "System Prompt" core dessa persona
  preferredTone: ToneOfVoice;
}

export interface KnowledgeBlock {
  id: string;
  content: string;
  tags: string[];
}

export interface ContextConfig {
  personaId: string;
  includeBrandVoice?: boolean;
  includeSeoRules?: boolean;
  customInstructions?: string;
}
