---
status: in_progress
generated: 2026-01-21
agents:
  - type: "feature-developer"
    role: "Implement backend actions and frontend components for the IA tab"
  - type: "frontend-specialist"
    role: "Design and implement the UI for AI tools in the CMS"
  - type: "architect-specialist"
    role: "Configure Vercel AI SDK integration with OpenRouter"
docs:
  - ".context/docs/architecture.md"
  - "README.md"
phases:
  - id: "phase-1"
    name: "Setup & Infrastructure"
    prevc: "P"
    steps:
      - "Install Vercel AI SDK and necessary providers (pnpm add ai @ai-sdk/openai)"
      - "Refactor OpenRouter client to use Vercel AI SDK patterns (lib/ai/vercel-ai.ts)"
      - "Define writing style constants and SEO prompt templates in lib/ai/prompts.ts"
  - id: "phase-2"
    name: "AI Tab UI Development"
    prevc: "E"
    steps:
      - "Add 'IA' item to CMS sidebar navigation in app/cms/layout.tsx using Sparkles icon"
      - "Create main AI dashboard at app/cms/ai/page.tsx with tool cards"
      - "Implement Post Generator UI in app/cms/ai/generator/page.tsx"
      - "Implement Article Rewriter UI in app/cms/ai/rewriter/page.tsx"
  - id: "phase-3"
    name: "Feature Integration & Polishing"
    prevc: "E"
    steps:
      - "Integrate image generation/selection into the post generation flow using lib/actions/ai-images.ts"
      - "Connect auto-categorization and tag suggestions (lib/ai/categorizer.ts)"
      - "Add SEO analysis preview for generated content (lib/ai/seo-optimizer.ts)"
      - "Implement 'Push to Editor' functionality to transfer AI content to the main post editor"
  - id: "phase-4"
    name: "Validation"
    prevc: "V"
    steps:
      - "Test end-to-end flow for post generation from topic to draft"
      - "Verify OpenRouter API usage, token counts and cost logging"
      - "Ensure generated posts are correctly saved to Supabase with all metadata"
---

# Plano de Integração da Aba de IA no Admin

Este plano detalha a implementação de uma nova seção de Inteligência Artificial no painel administrativo (CMS), focada em aumentar a produtividade editorial através de geração de conteúdo otimizado para SEO e reescrita de matérias.

## Task Snapshot
- **Primary goal:** Entregar uma interface funcional no admin que permita gerar posts completos e reescrever matérias externas usando IA de forma integrada ao sistema atual.
- **Success signal:** O usuário consegue gerar um post com título, conteúdo SEO, meta descrição, tags, categoria e imagem em menos de 2 minutos, tudo dentro da nova aba "IA".
- **Key references:**
  - [OpenRouter API Documentation](https://openrouter.ai/docs)
  - [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)

## Codebase Context
- **Framework:** Next.js (App Router)
- **CMS Path:** `app/cms/`
- **AI Logic:** `lib/ai/` and `lib/actions/ai-posts.ts`
- **Database:** Supabase (PostgreSQL)
- **Current UI:** Tailwind CSS + Radix UI (shadcn/ui)

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Dependência da API OpenRouter | Média | Alta | Implementar timeouts e fallbacks para modelos gratuitos |
| Qualidade da raspagem de URLs | Média | Média | Usar Cheerio com seletores flexíveis e permitir edição manual do conteúdo bruto |
| Custos de API elevados | Baixa | Média | Implementar log de custos e limite de tokens por geração |

## Working Phases

### Phase 1 — Setup & Infrastructure (P)
**Objective:** Preparar o ambiente técnico para a nova stack de IA.

**Steps**
1. **Dependencies:** Executar `pnpm add ai @ai-sdk/openai` para habilitar o Vercel AI SDK.
2. **Provider Config:** Criar `lib/ai/vercel-ai.ts` configurando o provider OpenAI para apontar para `https://openrouter.ai/api/v1` usando a `OPENROUTER_API_KEY`.
3. **Prompt Engineering:** Centralizar os prompts de "Estilo de Escrita" (Eda Show Tone) e "Otimização SEO" em `lib/ai/prompts.ts` para garantir consistência.

**Commit Checkpoint**
- `feat(ai): setup vercel ai sdk with openrouter provider and base prompts`

### Phase 2 — AI Tab UI Development (E)
**Objective:** Criar a interface de usuário no painel administrativo.

**Steps**
1. **Sidebar:** Modificar `app/cms/layout.tsx` para incluir a aba "IA" com o ícone `Sparkles`.
2. **Dashboard:** Criar `app/cms/ai/page.tsx` servindo como hub para as ferramentas de IA.
3. **Generator Page:** Criar `app/cms/ai/generator/page.tsx` com formulário para entrada de tópicos e palavras-chave.
4. **Rewriter Page:** Criar `app/cms/ai/rewriter/page.tsx` com suporte a colagem de links e visualização do conteúdo original vs. reescrito.

**Commit Checkpoint**
- `feat(cms): implement ai tab navigation and dashboard interface`

### Phase 3 — Feature Integration & Polishing (E)
**Objective:** Conectar a UI às ações do servidor e integrar com os sistemas existentes de mídia e taxonomia.

**Steps**
1. **Logic Update:** Atualizar `lib/actions/ai-posts.ts` para utilizar o `vercel-ai.ts` (Phase 1) em vez de fetches puros.
2. **Media Integration:** Integrar a busca de imagens (Pexels/Unsplash) diretamente no fluxo de geração do post.
3. **Taxonomy Integration:** Usar `categorizeContent` para sugerir categorias automaticamente com base no texto gerado.
4. **Editor Bridge:** Implementar a função para salvar o resultado da IA como um rascunho de post (`posts` table) e redirecionar para o editor.

**Commit Checkpoint**
- `feat(ai): integrate generation logic with cms media and taxonomy`

### Phase 4 — Validation (V)
**Objective:** Garantir qualidade e funcionalidade.

**Steps**
1. **Functional Testing:** Validar o fluxo completo: Entrada de URL -> Raspagem -> Reescrita -> Salvamento como Post.
2. **SEO Audit:** Verificar se o conteúdo gerado realmente inclui as palavras-chave solicitadas e segue as melhores práticas de SEO.
3. **UI/UX Review:** Garantir que o feedback de carregamento (streaming) esteja funcionando corretamente para uma melhor experiência do usuário.

**Commit Checkpoint**
- `test(ai): finalize validation of ai integration and seo quality`
