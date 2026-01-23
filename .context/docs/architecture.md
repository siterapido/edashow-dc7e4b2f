# Arquitetura do Sistema EdaShow

## Visão Geral Arquitetural

O EdaShow segue uma arquitetura **modular em camadas** (Layered Architecture) combinada com princípios de **microsserviços** para o sistema de agentes IA. A aplicação é construída sobre Next.js 15 com App Router, utilizando React Server Components e Server Actions para uma experiência otimizada.

## Diagrama de Alto Nível

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃              CAMADA DE APRESENTAÇÃO              ┃
┃  ┌──────────────┐  ┌──────────────┐             ┃
┃  │  Landing Page │  │  Dashboard   │             ┃
┃  │  (Frontend)   │  │  (Admin)     │             ┃
┃  └──────────────┘  └──────────────┘             ┃
┃  ┌──────────────────────────────────┐            ┃
┃  │  React 19 + Tailwind CSS + Radix │            ┃
┃  │  Framer Motion + TipTap Editor   │            ┃
┃  └──────────────────────────────────┘            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                        │
                        ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃            CAMADA DE APLICAÇÃO (Next.js)         ┃
┃  ┌────────────┐  ┌────────────┐  ┌────────────┐ ┃
┃  │ App Router │  │   Server   │  │ API Routes │ ┃
┃  │  (Routes)  │  │  Actions   │  │   (REST)   │ ┃
┃  └────────────┘  └────────────┘  └────────────┘ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┏━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━┓  ┏━━━━━━━━━━━━┓
┃   Payload  ┃  ┃   Agno     ┃  ┃  External  ┃
┃    CMS     ┃  ┃  Service   ┃  ┃  Services  ┃
┃ (Content)  ┃  ┃ (AI Agents)┃  ┃  (APIs)    ┃
┗━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━┛  ┗━━━━━━━━━━━━┛
        │               │               │
        └───────────────┼───────────────┘
                        ▼
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃               CAMADA DE DADOS                    ┃
┃  ┌──────────────────┐  ┌──────────────────┐     ┃
┃  │    Supabase      │  │   Supabase       │     ┃
┃  │   PostgreSQL     │  │    Storage       │     ┃
┃  │   (Database)     │  │  (S3-compatible) │     ┃
┃  └──────────────────┘  └──────────────────┘     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

## Camadas Detalhadas

### 1. Camada de Apresentação

#### **Frontend Público**
**Localização**: `app/(frontend)/`

**Componentes Principais**:
- **Landing Page** (`app/page.tsx`): 
  - Hero section com animações Framer Motion
  - Demonstração de agentes especializados
  - Seções de features e workflows
  - CTA para cadastro/login
  
- **Sistema de Posts** (`app/posts/`):
  - Listagem paginada de artigos
  - Visualização individual com rich content
  - Sistema de categorias
  - SEO otimizado
  
- **YouTube Gallery** (`app/youtube/`):
  - Integração com API do YouTube
  - Player embedado
  - Organização por canais

**Tecnologias**:
- React 19 Server Components
- Tailwind CSS 4 (utility-first)
- Framer Motion (animações declarativas)
- Radix UI (components acessíveis)

#### **Dashboard Administrativo**
**Localização**: `app/dashboard/`

**Módulos**:
1. **Chat Interface** (`components/agno-chat/`):
   - Sistema de mensagens em tempo real
   - Seleção de agentes especializados
   - Sugestões contextuais
   - Markdown rendering

2. **Artefatos** (`app/dashboard/*/[id]/`):
   - Pesquisas científicas
   - Análises de imagem
   - Notas persistentes
   - Materiais de estudo

3. **Pipeline** (`app/dashboard/pipeline/`):
   - Visualização de tarefas
   - Status tracking
   - Priorização automática

**Padrões de Design**:
- **Sidebar persistente**: Mantém contexto durante navegação
- **Layout composicional**: `artifact-page-layout.tsx`
- **Estado global**: Context API + hooks customizados

### 2. Camada de Aplicação

#### **App Router (Next.js 15)**
```
app/
├── (frontend)/        # Rotas públicas (sem layout admin)
├── dashboard/         # Rotas protegidas (require auth)
├── admin/            # Payload CMS admin
└── api/              # API endpoints
```

**Decisões Arquiteturais**:
- **Route Groups**: Organização lógica sem afetar URLs
- **Parallel Routes**: Loading states independentes
- **Server Components por padrão**: Performance otimizada

#### **Server Actions**
**Localização**: `lib/actions/`

**Ações Principais**:
```typescript
// artifacts.ts
- createResearchArtifact()
- createImageAnalysisArtifact()
- saveNote()
- getArtifactById()

// supabase.ts
- uploadToSupabase()
- deleteFromSupabase()
- getPublicUrl()
```

**Benefícios**:
- Eliminam necessidade de API routes para mutações simples
- Type-safe end-to-end
- Automatically serialized
- Progressive enhancement

#### **API Routes**
**Localização**: `app/api/`

**Endpoints Principais**:
```
POST /api/agno/chat              # Enviar mensagem para agente
POST /api/agno/create-research   # Criar artefato de pesquisa
POST /api/agno/create-image      # Criar análise de imagem
GET  /api/health                 # Health check
```

### 3. Camada de Serviços

#### **Payload CMS**
**Localização**: `payload/`

**Arquitetura de Collections**:

```typescript
Collections = {
  posts: {
    fields: [title, slug, content, coverImage, author, category],
    hooks: [beforeChange, afterChange],
    access: [read: public, create/update: authenticated]
  },
  users: {
    auth: true,
    fields: [email, name, role],
    access: role-based
  },
  media: {
    upload: true,
    storage: Supabase S3,
    transforms: Sharp optimization
  }
}
```

**Padrões Implementados**:
- **Hooks System**: Validação e transformação de dados
- **Access Control**: Granular permission system
- **Relationships**: Posts → Users, Posts → Media
- **Versioning**: Track changes over time

#### **Agno Service (Python/FastAPI)**
**Localização**: `odonto-gpt-agno-service/`

**Arquitetura de Agentes**:

```python
AgentSystem
├── ScienceAgent        # Pesquisa científica
├── ImagingAgent        # Análise de imagens
├── OdontoGPTAgent      # Assistente geral
├── PlanningAgent       # Planejamento de casos
└── TeachingAgent       # Material educacional
```

**Flow de Processamento**:
```
User Message → FastAPI Endpoint → Agent Selector 
→ Specific Agent → LLM (OpenRouter) → Response + Artifacts
→ Save to Supabase → Return to Frontend
```

**Design Patterns**:
- **Strategy Pattern**: Seleção dinâmica de agentes
- **Factory Pattern**: Criação de artefatos
- **Observer Pattern**: Streaming de respostas
- **Repository Pattern**: Acesso a dados

#### **Serviços Auxiliares**

**Image Services** (`lib/images/`):
```typescript
ImageService {
  providers: [Unsplash, Pexels],
  methods: {
    search(), 
    download(), 
    optimize()
  }
}
```

**AI Services** (`lib/ai/`):
```typescript
- SEOOptimizer: Análise e otimização de metadados
- ContentRewriter: Reescrita inteligente
- NewsletterGenerator: Geração de newsletters
- OpenRouterClient: Interface com modelos LLM
```

### 4. Camada de Dados

#### **Supabase PostgreSQL**

**Schema Principal**:

```sql
-- Posts (gerenciado pelo Payload)
payload_posts {
  id, title, slug, content, 
  cover_image, author_id, category,
  created_at, updated_at
}

-- Artefatos
research_artifacts {
  id, title, content, metadata,
  user_id, chat_id, created_at
}

image_analysis_artifacts {
  id, image_url, analysis_report,
  user_id, chat_id, created_at
}

notes {
  id, title, content, artifact_type,
  user_id, created_at
}

-- Chat e Mensagens
chat_sessions {
  id, user_id, agent_type, created_at
}

chat_messages {
  id, session_id, role, content,
  artifacts, created_at
}
```

**Políticas RLS (Row Level Security)**:
```sql
-- Usuários só veem seus próprios artefatos
CREATE POLICY user_artifacts ON artifacts
  FOR ALL USING (auth.uid() = user_id);

-- Posts públicos para leitura
CREATE POLICY public_posts ON payload_posts
  FOR SELECT USING (true);
```

#### **Supabase Storage**

**Estrutura de Buckets**:
```
media/
├── posts/           # Imagens de posts
├── user-uploads/    # Uploads de usuários
├── analyzed-images/ # Imagens analisadas
└── temp/           # Arquivos temporários
```

**Políticas de Acesso**:
- Public read para `posts/`
- Authenticated write para `user-uploads/`
- Role-based para `analyzed-images/`

## Fluxos de Dados Principais

### 1. Criação de Post (CMS)

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌──────────┐
│  Admin  │────▶│ Payload  │────▶│  Hooks  │────▶│ Postgres │
│   UI    │     │   API    │     │Validate │     │          │
└─────────┘     └──────────┘     └─────────┘     └──────────┘
                     │                                  │
                     ▼                                  │
              ┌──────────┐                             │
              │ Supabase │◀────────────────────────────┘
              │ Storage  │ Upload de imagem
              └──────────┘
```

### 2. Interação com Agente IA

```
┌──────┐   ┌─────────┐   ┌────────┐   ┌──────┐   ┌──────────┐
│ User │──▶│ Chat UI │──▶│ FastAPI│──▶│ Agent│──▶│OpenRouter│
└──────┘   └─────────┘   └────────┘   └──────┘   └──────────┘
                                          │              │
                                          ▼              ▼
                                     ┌─────────┐   ┌─────────┐
                                     │Artifacts│   │Response │
                                     └─────────┘   └─────────┘
                                          │              │
                                          ▼              ▼
                                     ┌──────────────────────┐
                                     │   Supabase DB        │
                                     └──────────────────────┘
```

### 3. Análise de Imagem

```
┌──────┐   ┌────────┐   ┌──────────┐   ┌────────┐   ┌────────┐
│Upload│──▶│Storage │──▶│  Imaging │──▶│   AI   │──▶│Artifact│
│ UI   │   │  S3    │   │  Agent   │   │  Model │   │  Save  │
└──────┘   └────────┘   └──────────┘   └────────┘   └────────┘
                             │                            │
                             ▼                            ▼
                        ┌─────────┐              ┌────────────┐
                        │Analysis │              │Notification│
                        │ Report  │              └────────────┘
                        └─────────┘
```

## Design Patterns Utilizados

### **1. Repository Pattern**
```typescript
// lib/supabase/repository.ts
class ArtifactRepository {
  async create(artifact: Artifact): Promise<Artifact>
  async findById(id: string): Promise<Artifact | null>
  async update(id: string, data: Partial<Artifact>): Promise<Artifact>
  async delete(id: string): Promise<void>
}
```

**Benefícios**:
- Abstração da camada de dados
- Facilita testes
- Mudança de ORM/database transparente

### **2. Factory Pattern**
```typescript
// Criação de artefatos
class ArtifactFactory {
  static create(type: ArtifactType, data: any): Artifact {
    switch(type) {
      case 'research': return new ResearchArtifact(data)
      case 'image': return new ImageArtifact(data)
      case 'note': return new NoteArtifact(data)
    }
  }
}
```

### **3. HOC e Composition**
```typescript
// components/dashboard/artifact-page-layout.tsx
export function withArtifactLayout<T>(Component: React.ComponentType<T>) {
  return (props: T) => (
    <ArtifactLayout>
      <ChatSidebar />
      <Component {...props} />
    </ArtifactLayout>
  )
}
```

### **4. Custom Hooks**
```typescript
// lib/hooks/useAgnoChat.ts
export function useAgnoChat(agentType: AgentType) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  const sendMessage = async (content: string) => {
    // Lógica de chat
  }
  
  return { messages, isLoading, sendMessage }
}
```

## Decisões Arquiteturais e Trade-offs

### **1. React Server Components**
✅ **Escolhido**: Server Components por padrão
❌ **Alternativa**: Client Components everywhere

**Razão**: 
- Reduz bundle size em ~70%
- Melhora SEO e performance inicial
- Acesso direto a database

**Trade-off**: 
- Curva de aprendizado
- Hydration complexities

### **2. Monorepo vs Multirepo**
✅ **Escolhido**: Monorepo com serviço Python separado
❌ **Alternativa**: Multirepo completo

**Razão**:
- Compartilhamento de types/utils
- Deploy simplificado
- Agno service em Python (ecossistema ML melhor)

**Trade-off**:
- Build mais complexo
- Gerenciamento de dependências

### **3. Payload CMS**
✅ **Escolhido**: Payload CMS 3.x
❌ **Alternativa**: Contentful, Strapi, Sanity

**Razão**:
- Code-first approach
- TypeScript nativo
- Supabase integration
- Self-hosted

**Trade-off**:
- Menos plugins third-party
- Config mais manual

### **4. Supabase**
✅ **Escolhido**: Supabase (PostgreSQL + Storage + Auth)
❌ **Alternativa**: Firebase, AWS, MongoDB

**Razão**:
- PostgreSQL (relacional + JSONB)
- RLS built-in
- Storage S3-compatible
- Free tier generoso

**Trade-off**:
- Vendor lock-in (mitigado por ser Postgres)
- Escalabilidade limitada no free tier

## Performance e Otimizações

### **Estratégias de Caching**
```typescript
// Next.js Cache Strategies
export const dynamic = 'force-static'  // Static pages
export const revalidate = 3600          // ISR (1 hour)
export const fetchCache = 'default-cache'
```

### **Image Optimization**
- Next.js Image component (automático)
- Sharp para transformações
- WebP generation
- Lazy loading

### **Code Splitting**
- Dynamic imports para componentes pesados
- Route-based splitting automático
- Vendor chunking strategy

### **Database Optimization**
- Índices em campos frequentemente consultados
- Materialized views para queries complexas
- Connection pooling (PgBouncer)

## Segurança

### **Autenticação e Autorização**
- Supabase Auth (JWT-based)
- Row Level Security (RLS)
- Role-based access control (RBAC)
- Payload CMS permissions

### **Input Validation**
- Zod schemas em todos os forms
- Server-side validation
- SQL injection prevention (prepared statements)
- XSS protection (React escaping + sanitization)

### **Secrets Management**
- Environment variables
- Vercel/GitHub Secrets
- Nunca commit credentials
- Rotating keys strategy

## Monitoramento e Observability

### **Logging**
- Server Actions logs
- Payload CMS audit logs
- Agno service logs (FastAPI)

### **Analytics**
- Vercel Analytics
- Custom events tracking
- Performance monitoring

### **Error Tracking**
- Try/catch em critical paths
- Error boundaries (React)
- Graceful degradation

---

*Arquitetura documentada e validada em 2026-01-16. Sujeita a evolução conforme novos requisitos.*
