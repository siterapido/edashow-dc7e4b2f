---
status: draft
generated: 2026-01-28
priority: high
agents:
  - type: "feature-developer"
    role: "Implementar novas funcionalidades de IA no editor"
  - type: "frontend-specialist"
    role: "UI/UX dos componentes de IA inline"
  - type: "architect-specialist"
    role: "Design de APIs e integrações de terceiros"
phases:
  - id: "phase-1"
    name: "Extensão da Infraestrutura IA"
    prevc: "P"
  - id: "phase-2"
    name: "Funcionalidades Core"
    prevc: "E"
  - id: "phase-3"
    name: "IA Inline no Editor"
    prevc: "E"
  - id: "phase-4"
    name: "Funcionalidades Avançadas"
    prevc: "E"
  - id: "phase-5"
    name: "Validação & Deploy"
    prevc: "V"
---

# Integração Avançada de IA ao Editor de Posts

> Expandir a integração de IA existente com funcionalidades diretamente no editor: geração de capas, transcrição de áudio, IA inline, sugestões em tempo real e ferramentas de produtividade.

## Visão Geral

### O que JÁ EXISTE (não implementar novamente)
- ✅ Integração OpenRouter com múltiplos modelos LLM (GLM-4.7-Flash padrão)
- ✅ Geração completa de posts via wizard em `/cms/ia`
- ✅ Reescrita de conteúdo (URL, texto, post existente)
- ✅ Análise e otimização SEO
- ✅ Auto-categorização de conteúdo
- ✅ Geração de tags automáticas
- ✅ Sistema de personas customizáveis
- ✅ Knowledge blocks e brand voice
- ✅ Logging de gerações (tokens, custos)

### O que FALTA implementar
1. **Geração de Capas com IA** - imagens geradas ou buscadas automaticamente
2. **Transcrição de Áudio** - áudio → texto → post formatado
3. **IA Inline no Editor** - assistente dentro do TipTap
4. **Sugestões em Tempo Real** - melhorias enquanto escreve
5. **Tradução Automática** - multi-idioma
6. **Verificação de Originalidade** - detecção de plágio/similaridade
7. **Análise de Tom em Tempo Real** - feedback de tom de voz
8. **Geração de Imagens Internas** - ilustrações para o corpo do post
9. **Resumo Automático** - criar excerpt e meta description on-the-fly
10. **Fact-checking Assistido** - verificação de fatos e fontes

---

## Task Snapshot

- **Primary goal:** Transformar o editor de posts em um ambiente de criação assistida por IA, onde o editor pode acessar todas as ferramentas de IA sem sair da página de edição.
- **Success signal:** Editor consegue criar um post completo (com capa, SEO, conteúdo otimizado) usando apenas as ferramentas inline do editor, sem navegar para `/cms/ia`.
- **Key references:**
  - Editor atual: `components/cms/PostEditor.tsx`
  - IA atual: `lib/ai/` e `lib/actions/ai-posts.ts`
  - Rich text: `components/cms/UnifiedMediumEditor.tsx` (TipTap)

---

## Arquitetura Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│ PostEditor.tsx (componente principal)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AI Toolbar (nova)                                        │   │
│  │ [🖼️ Gerar Capa] [🎙️ Áudio→Post] [✨ Melhorar] [🔍 SEO]   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ UnifiedMediumEditor (TipTap)                             │   │
│  │                                                          │   │
│  │  [Texto selecionado]  ← AI Bubble Menu (nova)            │   │
│  │  ├─ Reescrever                                          │   │
│  │  ├─ Expandir                                            │   │
│  │  ├─ Resumir                                             │   │
│  │  ├─ Traduzir                                            │   │
│  │  ├─ Ajustar Tom                                         │   │
│  │  └─ Gerar Imagem                                        │   │
│  │                                                          │   │
│  │  Parágrafo atual ← AI Suggestions Panel (nova)          │   │
│  │  └─ "💡 Sugestão: adicione dados para credibilidade"    │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AI Sidebar (nova) - drawer lateral                       │   │
│  │ ├─ SEO Score em tempo real                               │   │
│  │ ├─ Análise de tom                                        │   │
│  │ ├─ Sugestões de keywords                                 │   │
│  │ ├─ Histórico de alterações IA                            │   │
│  │ └─ Chat assistente                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Funcionalidades Detalhadas

### 1. 🖼️ Geração de Capas com IA

**Objetivo:** Gerar ou buscar imagens de capa automaticamente baseado no conteúdo do post.

**Opções de implementação:**
| Opção | Provider | Custo | Qualidade | Complexidade |
|-------|----------|-------|-----------|--------------|
| A | Pexels/Unsplash API (busca) | Grátis | Média | Baixa |
| B | DALL-E 3 via OpenAI | ~$0.04/img | Alta | Média |
| C | Stable Diffusion via Replicate | ~$0.01/img | Alta | Média |
| D | Ideogram API | ~$0.02/img | Alta | Média |
| E | Flux via Replicate | ~$0.02/img | Muito Alta | Média |

**Fluxo:**
```
1. Analisar título e conteúdo → Extrair keywords visuais
2. Gerar prompt de imagem otimizado
3. Buscar/Gerar imagem via API escolhida
4. Mostrar 4 opções ao usuário
5. Upload da selecionada → Supabase Storage
```

**Componentes:**
- `components/cms/ai/CoverImageGenerator.tsx` (novo)
- `lib/ai/image-generator.ts` (novo)
- `lib/actions/ai-images.ts` (novo)

---

### 2. 🎙️ Transcrição de Áudio para Post

**Objetivo:** Permitir gravação ou upload de áudio que será convertido em post formatado.

**Fluxo:**
```
1. Upload de áudio (mp3, wav, m4a) ou gravação in-browser
2. Transcrição via Whisper (OpenAI) ou AssemblyAI
3. Processamento do texto:
   - Dividir em parágrafos
   - Identificar tópicos/headings
   - Remover hesitações/repetições
4. Gerar título e excerpt
5. Inserir no editor para refinamento
```

**Providers de transcrição:**
| Provider | Custo | Qualidade PT-BR | Latência |
|----------|-------|-----------------|----------|
| OpenAI Whisper | $0.006/min | Excelente | Rápida |
| AssemblyAI | $0.002/min | Muito boa | Média |
| Deepgram | $0.008/min | Boa | Muito rápida |

**Componentes:**
- `components/cms/ai/AudioTranscriber.tsx` (novo)
- `components/cms/ai/AudioRecorder.tsx` (novo)
- `lib/ai/transcription.ts` (novo)
- `lib/actions/ai-audio.ts` (novo)

---

### 3. ✨ IA Inline no Editor TipTap

**Objetivo:** Menu de IA que aparece ao selecionar texto, similar ao Notion AI.

**Extensão TipTap personalizada:**
```typescript
// lib/tiptap/ai-extension.ts
import { Extension } from '@tiptap/core'

export const AIExtension = Extension.create({
  name: 'ai-assistant',

  addOptions() {
    return {
      onAIRequest: async (type, text) => { ... }
    }
  },

  addCommands() {
    return {
      rewriteSelection: () => ...,
      expandSelection: () => ...,
      summarizeSelection: () => ...,
      translateSelection: (lang) => ...,
      adjustTone: (tone) => ...,
    }
  }
})
```

**Bubble Menu de IA:**
```
┌─────────────────────────────────────────┐
│ [Reescrever ▼] [Expandir] [Resumir]     │
│ [Traduzir ▼]  [Tom ▼]    [Imagem]       │
└─────────────────────────────────────────┘
    ↓ Submenu Reescrever
    ├─ Mais formal
    ├─ Mais casual
    ├─ Mais conciso
    ├─ Mais detalhado
    └─ Corrigir gramática
```

**Componentes:**
- `components/cms/ai/AIBubbleMenu.tsx` (novo)
- `lib/tiptap/ai-extension.ts` (novo)
- `lib/ai/inline-operations.ts` (novo)

---

### 4. 📊 Painel de Análise em Tempo Real

**Objetivo:** Sidebar com métricas e sugestões atualizadas conforme o usuário escreve.

**Métricas exibidas:**
- SEO Score (0-100) com breakdown
- Readability Score (Flesch-Kincaid adaptado PT-BR)
- Análise de tom (formal/casual/técnico/emocional)
- Keyword density
- Heading structure analysis
- Word count / Reading time (já existe)
- Sugestões de melhoria em tempo real

**Componentes:**
- `components/cms/ai/AIAnalysisPanel.tsx` (novo)
- `lib/ai/realtime-analysis.ts` (novo)
- Hook: `useRealtimeAnalysis(content)` (novo)

---

### 5. 🌐 Tradução Automática

**Objetivo:** Traduzir posts para múltiplos idiomas mantendo tom e estilo.

**Idiomas suportados:**
- PT-BR ↔ EN-US
- PT-BR ↔ ES
- PT-BR → outras variantes de português

**Fluxo:**
```
1. Selecionar idioma de destino
2. Traduzir via LLM (mantém contexto melhor que API de tradução)
3. Review side-by-side
4. Opção de salvar como novo post ou substituir
```

---

### 6. 🔎 Verificação de Originalidade

**Objetivo:** Verificar se o conteúdo é original e não plagiado.

**Implementação:**
- Comparar com posts existentes no banco (similarity search)
- API externa opcional (Copyscape, Originality.ai)
- Mostrar % de similaridade e trechos suspeitos

---

### 7. 💬 Chat Assistente Contextual

**Objetivo:** Assistente de IA que conhece o contexto do post atual.

**Funcionalidades:**
- "Me ajude a melhorar a introdução"
- "Sugira 3 maneiras de concluir este post"
- "Quais dados/estatísticas posso adicionar?"
- "Revise a gramática e ortografia"
- "Crie uma lista de pontos-chave"

**Componente:**
- `components/cms/ai/AIChat.tsx` (novo)

---

## Priorização de Features

| Feature | Impacto | Complexidade | Prioridade |
|---------|---------|--------------|------------|
| IA Inline (Bubble Menu) | Alto | Média | 🔴 P1 |
| Geração de Capas | Alto | Média | 🔴 P1 |
| Transcrição de Áudio | Alto | Alta | 🟡 P2 |
| Análise em Tempo Real | Médio | Média | 🟡 P2 |
| Chat Assistente | Médio | Baixa | 🟡 P2 |
| Tradução Automática | Médio | Baixa | 🟢 P3 |
| Verificação Originalidade | Baixo | Alta | 🟢 P3 |

---

## Fases de Implementação

### Phase 1 — Extensão da Infraestrutura (P)

**Objetivo:** Preparar a base para as novas funcionalidades.

**Steps:**
1. Criar estrutura de diretórios `components/cms/ai/`
2. Configurar APIs de imagem (Pexels já tem key, adicionar DALL-E ou Replicate)
3. Configurar API de transcrição (Whisper via OpenRouter ou OpenAI direta)
4. Criar types e interfaces para novas funcionalidades
5. Adicionar migrations para novas tabelas se necessário

**Arquivos a criar:**
```
lib/ai/
├── image-generator.ts      # Abstração para múltiplos providers de imagem
├── transcription.ts        # Abstração para transcrição de áudio
├── inline-operations.ts    # Operações inline (rewrite, expand, etc)
└── realtime-analysis.ts    # Análise em tempo real

lib/actions/
├── ai-images.ts            # Server actions para imagens
└── ai-audio.ts             # Server actions para áudio

components/cms/ai/
├── index.ts                # Exports
├── AIToolbar.tsx           # Toolbar principal
├── CoverImageGenerator.tsx # Gerador de capas
├── AudioTranscriber.tsx    # Transcritor de áudio
├── AudioRecorder.tsx       # Gravador in-browser
├── AIBubbleMenu.tsx        # Menu inline TipTap
├── AIAnalysisPanel.tsx     # Painel lateral
└── AIChat.tsx              # Chat assistente
```

---

### Phase 2 — Funcionalidades Core (E)

**Objetivo:** Implementar geração de capas e transcrição de áudio.

**Steps:**

#### 2.1 Geração de Capas
1. Implementar `lib/ai/image-generator.ts` com suporte a:
   - Pexels API (busca por keywords)
   - DALL-E 3 (geração)
   - Replicate/Flux (geração alternativa)
2. Criar componente `CoverImageGenerator.tsx`
3. Integrar ao `PostEditor.tsx` com botão na toolbar
4. Implementar grid de seleção de imagens
5. Upload automático para Supabase Storage

#### 2.2 Transcrição de Áudio
1. Implementar `lib/ai/transcription.ts` com Whisper
2. Criar `AudioRecorder.tsx` para gravação in-browser
3. Criar `AudioTranscriber.tsx` para upload de arquivos
4. Implementar processamento pós-transcrição:
   - Limpeza de texto
   - Estruturação em parágrafos
   - Geração de título e excerpt
5. Integrar ao `PostEditor.tsx`

---

### Phase 3 — IA Inline no Editor (E)

**Objetivo:** Implementar o assistente de IA dentro do editor TipTap.

**Steps:**
1. Criar extensão TipTap `ai-extension.ts`
2. Implementar `AIBubbleMenu.tsx` com comandos:
   - Reescrever (múltiplos estilos)
   - Expandir texto
   - Resumir texto
   - Traduzir
   - Ajustar tom
   - Gerar imagem para trecho
3. Integrar ao `UnifiedMediumEditor.tsx`
4. Adicionar loading states e streaming de resposta
5. Implementar undo/redo para operações de IA

---

### Phase 4 — Funcionalidades Avançadas (E)

**Objetivo:** Implementar análise em tempo real e chat assistente.

**Steps:**

#### 4.1 Análise em Tempo Real
1. Criar hook `useRealtimeAnalysis(content)`
2. Implementar `AIAnalysisPanel.tsx`
3. Métricas a calcular:
   - SEO Score (reutilizar `analyzPostSEO`)
   - Readability (implementar Flesch-Kincaid PT-BR)
   - Tom de voz (classificação via LLM)
   - Keyword density
4. Debounce para não sobrecarregar API

#### 4.2 Chat Assistente
1. Criar `AIChat.tsx` com interface conversacional
2. Contexto do chat inclui:
   - Título atual
   - Conteúdo atual
   - Categoria selecionada
   - Histórico de sugestões
3. Comandos rápidos com `/`

---

### Phase 5 — Validação & Deploy (V)

**Steps:**
1. Testes de integração de todas as features
2. Validação de custos de API
3. Rate limiting para evitar abuse
4. Documentação de uso para editores
5. Deploy gradual (feature flags se necessário)

---

## APIs e Custos Estimados

| Serviço | Uso Estimado/Mês | Custo Estimado |
|---------|-----------------|----------------|
| OpenRouter (LLM) | 500k tokens | ~$5-15 |
| OpenAI Whisper | 100 min áudio | ~$0.60 |
| DALL-E 3 | 100 imagens | ~$4 |
| Pexels/Unsplash | Ilimitado | Grátis |

**Total estimado:** $10-20/mês para uso moderado

---

## Variáveis de Ambiente Necessárias

```env
# Já existentes
OPENROUTER_API_KEY=sk_...
PEXELS_API_KEY=...

# Novas (opcionais baseado na escolha)
OPENAI_API_KEY=sk_...           # Para Whisper e DALL-E direto
REPLICATE_API_TOKEN=...         # Para Flux/Stable Diffusion
ASSEMBLYAI_API_KEY=...          # Alternativa para transcrição
```

---

## Decisões de Arquitetura

### ADR-001: Provider de Imagens
**Decisão:** Usar Pexels como padrão (grátis), DALL-E como opção premium.
**Alternativas:** Replicate/Flux, Ideogram
**Motivo:** Balancear custo vs. qualidade, Pexels já configurado.

### ADR-002: Provider de Transcrição
**Decisão:** OpenAI Whisper via API direta.
**Alternativas:** AssemblyAI, Deepgram, Whisper local
**Motivo:** Melhor qualidade PT-BR, preço acessível.

### ADR-003: Arquitetura de Streaming
**Decisão:** Usar Vercel AI SDK streams para operações inline.
**Motivo:** Já integrado no projeto, boa UX com streaming.

---

## Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Custos de API elevados | Média | Alto | Rate limiting, cache, uso de modelos gratuitos como fallback |
| Latência alta em operações inline | Média | Médio | Streaming, loading states, operações otimistas |
| Conflito com TipTap existente | Baixa | Alto | Testes extensivos, extensão isolada |
| Upload de áudio grande | Média | Médio | Limite de tamanho (50MB), compressão client-side |

---

## Critérios de Sucesso

- [ ] Editor consegue gerar capa com IA em menos de 10 segundos
- [ ] Transcrição de 5 minutos de áudio em menos de 30 segundos
- [ ] Operações inline respondem em menos de 3 segundos
- [ ] SEO Score atualiza em tempo real (debounce 2s)
- [ ] Zero regressões no editor atual
- [ ] Custo mensal de APIs abaixo de $25

---

## Próximos Passos Imediatos

1. **Aprovar este plano** com stakeholders
2. **Escolher providers** (imagem e áudio)
3. **Configurar chaves de API** necessárias
4. **Iniciar Phase 1** - estrutura base
5. **Criar branch** `feature/ai-editor-integration`
