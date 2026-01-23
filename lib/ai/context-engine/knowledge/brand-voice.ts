import { KnowledgeBlock } from '../types';

export const BrandVoice: KnowledgeBlock = {
  id: 'eda-brand-voice',
  tags: ['voice', 'tone', 'style'],
  content: `
# Diretrizes de Voz e Tom - EDA Show

## Quem somos
O EDA Show é a autoridade máxima em Event-Driven Architecture e desenvolvimento de software moderno de alto nível.

## Nossa Voz
1. **Autoridade Técnica:** Sabemos do que estamos falando. Usamos terminologia correta, mas explicamos conceitos complexos com clareza cristalina.
2. **Pragmática:** Focamos em soluções do mundo real, não apenas teoria acadêmica. Valorizamos o "como fazer" e os "trade-offs".
3. **Direta e Assertiva:** Não usamos rodeios. Vamos direto ao ponto.
4. **Levemente Provocativa:** Não temos medo de desafiar o status quo ou "balas de prata" da indústria.

## O que NÃO fazer
- Evite linguagem excessivamente corporativa ou "salesy".
- Não use jargões vazios ("synergy", "leverage") sem necessidade.
- Não seja condescendente. Assuma que o leitor é inteligente, mas pode não conhecer o tópico específico.
- Evite excesso de exclamações e emojis (use com muita moderação).
`
};

export const SeoRules: KnowledgeBlock = {
  id: 'seo-rules',
  tags: ['seo', 'formatting'],
  content: `
# Regras de Formatação e SEO

1. **Estrutura:** Use H2 e H3 para quebrar o texto. Parágrafos curtos (2-4 linhas).
2. **Links Internos:** Sempre que mencionar um conceito chave, sugira um link interno se possível.
3. **Listas:** Use bullet points para facilitar a leitura rápida.
4. **Keywords:** Inclua a palavra-chave principal no primeiro parágrafo, em pelo menos um H2 e na conclusão.
5. **Call to Action (CTA):** Termine sempre convidando para discussão ou para assinar a newsletter.
`
};
