# Visão Geral do Projeto EdaShow

## Resumo Executivo

**EdaShow** é uma plataforma moderna e completa para gerenciamento e divulgação de eventos odontológicos, desenvolvida com tecnologias de ponta e focada em oferecer uma experiência premium aos usuários. A plataforma integra um sistema CMS robusto (Payload CMS), banco de dados PostgreSQL (Supabase), e uma interface rica construída com Next.js 15 e React 19.

### Propósito
Criar uma solução all-in-one para gestão de eventos odontológicos, permitindo:
- Publicação e gerenciamento de conteúdo editorial
- Sistema de agentes especializados em odontologia usando IA
- Dashboard interativo com chat inteligente
- Análise e processamento de imagens odontológicas
- Pesquisa científica e materiais de estudo

### Público-alvo
- Profissionais de odontologia
- Clínicas e consultórios
- Organizadores de eventos e congressos
- Empresas do setor odontológico

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4.1.9
- **Component Library**: Radix UI (conjunto completo)
- **Animations**: Framer Motion 12.23.11
- **Forms**: React Hook Form + Zod
- **Rich Text Editor**: TipTap (com extensões completas)
- **Theme**: Next-themes (dark mode support)

### Backend
- **CMS**: Payload CMS 3.x
- **Database**: PostgreSQL via Supabase
- **Storage**: Supabase S3
- **Authentication**: Supabase Auth
- **ORM**: Payload CMS + pg driver

### IA e Inteligência
- **Agentes**: Sistema Agno para agentes especializados
- **Chat**: CopilotKit MCP integration
- **Processamento**: OpenRouter para modelos de IA
- **Análise**: Agentes especializados (Science, Imaging, Odonto GPT)

### Serviços Externos
- **YouTube Integration**: API para gerenciamento de vídeos
- **Image Services**: Unsplash e Pexels
- **Analytics**: Vercel Analytics
- **Deploy**: Vercel Platform

## Arquitetura do Sistema

### Camadas Arquiteturais

```
┌─────────────────────────────────────────────┐
│          Apresentação (Frontend)             │
│  Next.js 15 + React 19 + Tailwind CSS       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│           Camada de Aplicação                │
│  - App Router (rotas públicas e admin)       │
│  - Server Actions                            │
│  - API Routes                                │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│          Camada de Serviços                  │
│  - Agentes IA (Agno Service)                 │
│  - Image Processing                          │
│  - SEO Optimizer                             │
│  - Newsletter Generator                      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────┴──────────────────────────┐
│         Camada de Dados                      │
│  - Payload CMS (Content Management)          │
│  - Supabase PostgreSQL (Database)            │
│  - Supabase Storage (Media Files)            │
└─────────────────────────────────────────────┘
```

### Principais Componentes

#### 1. **Sistema de Conteúdo (CMS)**
- **Localização**: `/payload/collections/`
- **Responsabilidades**:
  - Gerenciamento de posts e páginas
  - Sistema de usuários e permissões
  - Upload e otimização de mídia
  - Versionamento de conteúdo
  - SEO e metadados

#### 2. **Dashboard Interativo**
- **Localização**: `/app/dashboard/`
- **Responsabilidades**:
  - Interface administrativa moderna
  - Chat com agentes especializados
  - Visualização de artefatos (pesquisas, imagens, notas)
  - Pipeline de trabalho
  - Sistema de notificações

#### 3. **Sistema de Agentes IA**
- **Localização**: `/odonto-gpt-agno-service/`
- **Agentes Disponíveis**:
  - **Science Agent**: Pesquisa científica e análise de estudos
  - **Imaging Agent**: Análise de radiografias e imagens odontológicas
  - **Odonto GPT**: Assistente geral para odontologia
  - **Planning Agent**: Planejamento de tratamentos
  - **Teaching Agent**: Material educacional

#### 4. **Sistema de Artefatos**
- **Tipos**:
  - **Pesquisas Científicas**: Análise e resumo de artigos
  - **Análises de Imagem**: Processamento de radiografias
  - **Notas**: Sistema de anotações persistentes
  - **Materiais de Estudo**: Conteúdo educacional
- **Funcionalidades**:
  - Chat contextual por artefato
  - Sidebar persistente e independente
  - Sugestões inteligentes baseadas em contexto

#### 5. **Frontend Público**
- **Landing Page**: Design moderno com animações Framer Motion
- **Blog/Posts**: Sistema de publicação de conteúdo
- **Páginas de Evento**: Detalhamento de eventos
- **YouTube Integration**: Galeria de vídeos

## Fluxo de Dados

### 1. Criação de Conteúdo
```
Usuário Admin → Payload CMS → Validação → PostgreSQL → Storage (se mídia)
```

### 2. Interação com Agentes
```
Usuário → Chat UI → Agno Service → Modelo IA → Resposta + Artefatos → PostgreSQL
```

### 3. Análise de Imagens
```
Upload → Supabase Storage → Imaging Agent → Análise → Artefato salvo → Notificação
```

## Dependências Principais

### Core (20+ dependências)
- Next.js 15.5.9
- React 19.2.3
- Payload CMS 3.x (configuração custom)
- Supabase (@supabase/supabase-js, @supabase/ssr)

### UI Components (30+ componentes Radix)
- Dialog, Dropdown, Tooltip, Popover
- Select, Tabs, Accordion, Collapsible
- Form controls completos

### Rich Text & Images
- TipTap (8+ extensões)
- Sharp (otimização de imagens)
- Cheerio (web scraping)

### Utilities
- Zod (validação)
- Date-fns (datas)
- Framer Motion (animações)
- Lucide React (ícones)

## Estrutura de Diretórios

```
edashow-1/
├── app/                          # Next.js App Router
│   ├── (frontend)/              # Rotas públicas
│   │   ├── page.tsx             # Landing page
│   │   ├── posts/               # Blog
│   │   └── youtube/             # Galeria de vídeos
│   ├── dashboard/               # Dashboard admin
│   │   ├── pesquisas/           # Artefatos de pesquisa
│   │   ├── imagens/             # Análises de imagem
│   │   ├── materiais/           # Materiais de estudo
│   │   └── pipeline/            # Pipeline de trabalho
│   ├── admin/                   # Payload Admin
│   └── api/                     # API Routes
├── components/                   # Componentes React
│   ├── ui/                      # UI primitives (shadcn)
│   ├── cms/                     # Componentes CMS
│   ├── dashboard/               # Componentes dashboard
│   ├── chat/                    # Sistema de chat
│   └── agno-chat/               # Chat com agentes
├── lib/                         # Bibliotecas e utils
│   ├── actions/                 # Server Actions
│   ├── ai/                      # Integrações IA
│   ├── images/                  # Serviços de imagem
│   └── supabase/                # Cliente Supabase
├── payload/                     # Configuração Payload CMS
│   ├── collections/             # Schemas de dados
│   └── payload.config.ts        # Config principal
├── odonto-gpt-agno-service/    # Serviço Python de agentes
│   ├── app/
│   │   ├── agents/              # Definição dos agentes
│   │   └── api.py               # API FastAPI
│   └── requirements.txt
└── public/                      # Assets estáticos
```

## Integrações Principais

### 1. Supabase
- **Database**: PostgreSQL para todos os dados
- **Storage**: Bucket 'media' para uploads
- **Auth**: Sistema de autenticação
- **Políticas RLS**: Segurança em nível de linha

### 2. Payload CMS
- **Collections**: Posts, Users, Media, Pages
- **Admin Panel**: Interface customizada
- **API**: REST e GraphQL automáticas
- **Hooks**: Validação e transformação de dados

### 3. Agno (Python Service)
- **FastAPI**: API RESTful para agentes
- **Agentes**: Múltiplos agentes especializados
- **Streaming**: Respostas em tempo real
- **Artefatos**: Criação automática de documentos

### 4. CopilotKit
- **Chat Interface**: UI de chat integrada
- **MCP Integration**: Conexão com serviços externos
- **Context Management**: Gerenciamento de contexto

## Recursos e Funcionalidades

### ✅ Sistema de Publicação
- Editor rich text com TipTap
- Upload de imagens otimizado
- SEO automático
- Preview em tempo real
- Auto-save
- Versionamento

### ✅ Dashboard Inteligente
- Chat com múltiplos agentes especializados
- Criação e gerenciamento de artefatos
- Sidebar persistente com histórico
- Sugestões contextuais
- Notificações em tempo real

### ✅ Análise de Imagens
- Upload de radiografias
- Análise automática com IA
- Relatórios detalhados
- Armazenamento seguro
- Histórico de análises

### ✅ Pesquisa Científica
- Busca e análise de artigos
- Resumos automatizados
- Referências bibliográficas
- Material de estudo personalizado

### ✅ Design e UX
- Dark mode support
- Animações fluidas
- Responsive design
- Acessibilidade (Radix UI)
- Performance otimizada

## Configuração e Deploy

### Desenvolvimento Local
```bash
pnpm install
cp .env.example .env
# Configurar variáveis de ambiente
pnpm dev
```

### Produção (Vercel)
- Deploy automático via GitHub
- Variáveis de ambiente no Vercel
- Edge Functions habilitadas
- Analytics integrado

### Variáveis Essenciais
- `DATABASE_URI`: Connection string PostgreSQL
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave admin Supabase
- `PAYLOAD_SECRET`: Secret para Payload CMS
- `NEXT_PUBLIC_SERVER_URL`: URL da aplicação

## Próximos Passos e Roadmap

### Em Desenvolvimento
- [ ] Sistema de notas melhorado
- [ ] Mais agentes especializados
- [ ] Integração com WhatsApp
- [ ] Sistema de notificações avançado
- [ ] Dashboard de analytics

### Planejado
- [ ] Mobile app (React Native)
- [ ] API pública documentada
- [ ] Marketplace de templates
- [ ] Integração com mais plataformas
- [ ] Sistema de pagamentos

## Métricas do Projeto

- **Total de Arquivos**: 881
- **Símbolos Totais**: 745
- **Símbolos Exportados**: 333
- **Componentes**: 364
- **Utilitários**: 251
- **Linguagem Principal**: TypeScript
- **Package Manager**: pnpm
- **Framework**: Next.js

---

*Documentação gerada automaticamente e enriquecida com análise de contexto. Última atualização: 2026-01-16*
