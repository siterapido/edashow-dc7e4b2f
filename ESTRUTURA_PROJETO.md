# 🗂️ Estrutura do Projeto EdaShow

## 📋 Visão Geral da Estrutura

```
edashow-1/
│
├── 📱 app/                          # Aplicação Next.js (App Router)
│   ├── api/                         # Rotas da API
│   │   └── [...slug]/              
│   │       └── route.ts             # ✅ Rotas REST do PayloadCMS
│   ├── cms-example/                 # ✅ Página de exemplo do CMS
│   │   └── page.tsx
│   ├── globals.css                  # Estilos globais
│   ├── layout.tsx                   # Layout raiz
│   └── page.tsx                     # Página inicial
│
├── 🎨 components/                   # Componentes React
│   ├── ui/                          # Componentes UI (shadcn/ui)
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── ad-banners.tsx
│   ├── columnists.tsx
│   ├── events.tsx
│   ├── footer.tsx
│   ├── header.tsx
│   ├── hero-section.tsx
│   ├── latest-news.tsx
│   ├── news-grid.tsx
│   ├── newsletter.tsx
│   └── theme-provider.tsx
│
├── 🛠️ lib/                         # Utilitários e Helpers
│   ├── payload/                     # ✅ Utilitários do PayloadCMS
│   │   ├── api.ts                   # Funções para buscar dados
│   │   └── types.ts                 # Tipos TypeScript auxiliares
│   └── utils.ts                     # Utilitários gerais
│
├── 📁 public/                       # Arquivos estáticos
│   ├── uploads/                     # ✅ Uploads do CMS (gitignored)
│   ├── *.jpg                        # Imagens do site
│   ├── *.png                        # Ícones e logos
│   └── *.svg                        # Gráficos vetoriais
│
├── 🔧 scripts/                      # Scripts auxiliares
│   └── setup-payload.sh             # ✅ Script de setup do PayloadCMS
│
├── 📄 Arquivos de Configuração
│   ├── .env                         # ✅ Variáveis de ambiente (gitignored)
│   ├── .env.example                 # ✅ Template de variáveis
│   ├── .gitignore                   # ✅ Atualizado para PayloadCMS
│   ├── components.json              # Configuração shadcn/ui
│   ├── next.config.mjs              # ✅ Configuração Next.js + Payload
│   ├── package.json                 # Dependências do projeto
│   ├── payload.config.ts            # ✅ Configuração do PayloadCMS
│   ├── pnpm-lock.yaml              # Lock file do pnpm
│   ├── postcss.config.mjs          # Configuração PostCSS
│   ├── tsconfig.json                # ✅ Configuração TypeScript
│   └── README.md                    # ✅ README principal
│
└── 📚 Documentação
    ├── INTEGRACAO_PAYLOAD.md        # ✅ Resumo da integração
    ├── PAYLOAD_README.md            # ✅ Documentação completa
    ├── EXEMPLOS_USO.md              # ✅ Exemplos práticos
    └── ESTRUTURA_PROJETO.md         # ✅ Este arquivo
```

## 🎯 Arquivos Principais

### Configuração do PayloadCMS

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `payload.config.ts` | Configuração principal do CMS | ✅ Criado |
| `app/api/[...slug]/route.ts` | Rotas REST automáticas | ✅ Criado |
| `.env` | Variáveis de ambiente | ✅ Criado |
| `tsconfig.json` | Alias @payload-config | ✅ Configurado |
| `next.config.mjs` | Integração withPayload | ✅ Configurado |

### Utilitários

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `lib/payload/api.ts` | Funções para buscar dados | ✅ Criado |
| `lib/payload/types.ts` | Tipos TypeScript | ✅ Criado |
| `scripts/setup-payload.sh` | Script de setup | ✅ Criado |

### Documentação

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `INTEGRACAO_PAYLOAD.md` | Resumo da integração | ✅ Criado |
| `PAYLOAD_README.md` | Guia completo de uso | ✅ Criado |
| `EXEMPLOS_USO.md` | Exemplos práticos | ✅ Criado |
| `ESTRUTURA_PROJETO.md` | Estrutura do projeto | ✅ Criado |
| `README.md` | README principal | ✅ Atualizado |

## 📦 Collections do PayloadCMS

### Collections de Conteúdo

```
Collections/
├── 📝 Posts (posts)
│   ├── Título, slug, resumo
│   ├── Conteúdo rico (Lexical)
│   ├── Imagem destacada
│   ├── Categoria, tags
│   ├── Autor (relacionamento)
│   ├── Status, data de publicação
│   └── Opção de destaque
│
├── 📅 Events (events)
│   ├── Título, slug, descrição
│   ├── Imagem
│   ├── Datas (início/término)
│   ├── Local, tipo
│   ├── URL de inscrição
│   └── Status
│
├── 👤 Columnists (columnists)
│   ├── Nome, slug, biografia
│   ├── Foto, cargo
│   └── Redes sociais
│
├── 🖼️ Media (media)
│   ├── Upload de imagens
│   ├── Processamento automático
│   ├── Tamanhos: thumbnail, card, tablet
│   └── Alt text, legenda
│
└── 👥 Users (users)
    ├── Sistema de autenticação
    ├── Nome, email, senha
    └── Roles: admin, editor, autor
```

### Globals (Dados Únicos)

```
Globals/
├── ⚙️ Site Settings (site-settings)
│   ├── Nome e descrição do site
│   ├── Logo e favicon
│   └── Redes sociais
│
├── 📋 Header (header)
│   └── Navegação principal
│
└── 📄 Footer (footer)
    ├── Copyright
    └── Links do rodapé
```

## 🌐 Rotas da API

### Endpoints Automáticos

```
API Routes/
├── /api/posts
│   ├── GET     - Listar posts
│   ├── POST    - Criar post
│   ├── GET     /:id - Obter post
│   ├── PATCH   /:id - Atualizar post
│   └── DELETE  /:id - Deletar post
│
├── /api/events
│   ├── GET     - Listar eventos
│   ├── POST    - Criar evento
│   ├── GET     /:id - Obter evento
│   ├── PATCH   /:id - Atualizar evento
│   └── DELETE  /:id - Deletar evento
│
├── /api/columnists
│   ├── GET     - Listar colunistas
│   ├── POST    - Criar colunista
│   ├── GET     /:id - Obter colunista
│   ├── PATCH   /:id - Atualizar colunista
│   └── DELETE  /:id - Deletar colunista
│
├── /api/media
│   ├── GET     - Listar mídia
│   ├── POST    - Upload de arquivo
│   ├── GET     /:id - Obter mídia
│   ├── PATCH   /:id - Atualizar mídia
│   └── DELETE  /:id - Deletar mídia
│
├── /api/users
│   ├── POST    /login - Login
│   ├── POST    /logout - Logout
│   └── GET     /me - Usuário atual
│
└── /api/globals
    ├── GET     /site-settings
    ├── GET     /header
    └── GET     /footer
```

## 🎨 Componentes UI

### Componentes shadcn/ui

```
components/ui/
├── accordion.tsx
├── alert-dialog.tsx
├── aspect-ratio.tsx
├── avatar.tsx          ✅ Usado
├── button.tsx          ✅ Usado
├── card.tsx            ✅ Usado
├── checkbox.tsx
├── collapsible.tsx
├── context-menu.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── hover-card.tsx
├── input.tsx           ✅ Usado
├── label.tsx
├── menubar.tsx
├── navigation-menu.tsx
├── popover.tsx
├── progress.tsx
├── radio-group.tsx
├── scroll-area.tsx
├── select.tsx
├── separator.tsx
├── slider.tsx
├── switch.tsx
├── tabs.tsx
├── toast.tsx
├── toggle.tsx
└── tooltip.tsx
```

### Componentes Customizados

```
components/
├── ad-banners.tsx       - Banners de publicidade
├── columnists.tsx       - Grid de colunistas
├── events.tsx           - Lista de eventos
├── footer.tsx           - Rodapé do site
├── header.tsx           - Cabeçalho/navegação
├── hero-section.tsx     - Seção hero
├── latest-news.tsx      - Últimas notícias
├── news-grid.tsx        - Grid de notícias
├── newsletter.tsx       - Formulário de newsletter
└── theme-provider.tsx   - Provider de tema
```

## 📊 Fluxo de Dados

```
┌─────────────────┐
│   MongoDB       │
│   Database      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  PayloadCMS     │
│  (Backend)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   REST API      │
│  /api/...       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ lib/payload/    │
│   api.ts        │ ← Funções helper
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Next.js Pages  │
│  & Components   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Frontend      │
│   (Browser)     │
└─────────────────┘
```

## 🔐 Controle de Acesso

```
Permissões/
├── Leitura Pública
│   ├── Posts publicados
│   ├── Eventos
│   ├── Colunistas
│   ├── Mídia
│   └── Globals
│
├── Autenticado (Editor/Autor)
│   ├── Criar posts
│   ├── Editar posts
│   ├── Criar eventos
│   └── Upload de mídia
│
└── Admin
    ├── Todas as permissões acima
    ├── Deletar qualquer conteúdo
    ├── Gerenciar usuários
    └── Editar globals
```

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Iniciar servidor dev
pnpm build                  # Build de produção
pnpm start                  # Iniciar servidor prod

# MongoDB
brew services start mongodb-community    # Iniciar MongoDB
brew services stop mongodb-community     # Parar MongoDB
brew services restart mongodb-community  # Reiniciar MongoDB

# Setup
./scripts/setup-payload.sh  # Script de setup automático

# Linting
pnpm lint                   # Executar ESLint
```

## 📝 Variáveis de Ambiente

```env
# PayloadCMS
PAYLOAD_SECRET=             # Secret para JWT
DATABASE_URI=               # String de conexão MongoDB

# Next.js
NEXT_PUBLIC_SERVER_URL=     # URL do servidor
```

## 🔗 Links Importantes

- **Admin Panel**: http://localhost:3000/admin
- **API Docs**: http://localhost:3000/api
- **Exemplo CMS**: http://localhost:3000/cms-example
- **Frontend**: http://localhost:3000

---

**📚 Para mais informações, consulte:**
- [INTEGRACAO_PAYLOAD.md](./INTEGRACAO_PAYLOAD.md)
- [PAYLOAD_README.md](./PAYLOAD_README.md)
- [EXEMPLOS_USO.md](./EXEMPLOS_USO.md)
