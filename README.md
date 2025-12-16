# EdaShow - Portal de Notícias

*Website moderno com CMS integrado*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/marcos-projects-05ce9093/v0-website-ui-recreation)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/vuFAxfHrMHc)
[![PayloadCMS](https://img.shields.io/badge/CMS-PayloadCMS-black?style=for-the-badge)](https://payloadcms.com)

## 📋 Sobre o Projeto

Portal de notícias moderno construído com Next.js 16, React 19 e integrado com PayloadCMS para gerenciamento de conteúdo.

## ✨ Características

- 🎨 Interface moderna e responsiva
- 📝 CMS headless integrado (PayloadCMS)
- 🔐 Sistema de autenticação completo
- 📰 Gerenciamento de posts, eventos e colunistas
- 🖼️ Upload e processamento automático de imagens
- 🌐 API REST completa
- 📱 Totalmente responsivo
- ⚡ Performance otimizada com Next.js 16

## 🚀 Integração PayloadCMS

Este projeto está totalmente integrado com o PayloadCMS! Acesse a documentação completa:

- **[INTEGRACAO_PAYLOAD.md](./INTEGRACAO_PAYLOAD.md)** - Resumo da integração
- **[PAYLOAD_README.md](./PAYLOAD_README.md)** - Documentação completa de uso

### Quick Start com PayloadCMS

```bash
# 1. Instalar MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# 2. Configurar ambiente
cp .env.example .env
# Edite o .env com suas configurações

# 3. Instalar dependências
pnpm install

# 4. Iniciar servidor
pnpm dev

# 5. Acessar o admin
# http://localhost:3000/admin
```

### Collections Disponíveis

- ✅ **Posts** - Notícias e artigos
- ✅ **Events** - Eventos e conferências
- ✅ **Columnists** - Colunistas e autores
- ✅ **Media** - Biblioteca de mídia
- ✅ **Users** - Usuários e autenticação

### Globals (Configurações)

- ✅ **Site Settings** - Configurações gerais
- ✅ **Header** - Navegação principal
- ✅ **Footer** - Rodapé do site

## 📚 Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/marcos-projects-05ce9093/v0-website-ui-recreation](https://vercel.com/marcos-projects-05ce9093/v0-website-ui-recreation)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/vuFAxfHrMHc](https://v0.app/chat/vuFAxfHrMHc)**

## 🛠️ Tecnologias

- **Framework**: Next.js 16.0.10
- **React**: 19.2.0
- **CMS**: PayloadCMS 3.68.5
- **Database**: MongoDB
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **TypeScript**: 5.0.2
- **Package Manager**: pnpm

## 📦 Estrutura do Projeto

```
edashow-1/
├── app/                    # Páginas e rotas Next.js
│   ├── api/               # API routes (PayloadCMS)
│   ├── cms-example/       # Página de exemplo do CMS
│   └── ...
├── components/            # Componentes React
│   └── ui/               # Componentes UI reutilizáveis
├── lib/                  # Utilitários e helpers
│   └── payload/          # Funções do PayloadCMS
├── public/               # Arquivos estáticos
│   └── uploads/          # Uploads do CMS
├── scripts/              # Scripts auxiliares
├── payload.config.ts     # Configuração do PayloadCMS
├── next.config.mjs       # Configuração do Next.js
└── tsconfig.json         # Configuração TypeScript
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento

# Build
pnpm build            # Cria build de produção
pnpm start            # Inicia servidor de produção

# Linting
pnpm lint             # Executa ESLint

# Setup
./scripts/setup-payload.sh  # Script de setup do PayloadCMS

# Ingestão de Conteúdo
pnpm ts-node scripts/scrape-conexao-saude.ts  # Importa notícias do Conexão Saúde
```

### 📥 Script de Ingestão do Conexão Saúde

O projeto inclui um script para importar notícias automaticamente do site Conexão Saúde:

```bash
# Configurar variáveis de ambiente
export PAYLOAD_SERVER_URL=http://localhost:3000
export PAYLOAD_API_TOKEN=seu-token

# Executar importação
pnpm ts-node scripts/scrape-conexao-saude.ts
```

**Documentação completa:** [SCRAPE_CONEXAO_SAUDE.md](./SCRAPE_CONEXAO_SAUDE.md)

## 🌐 Endpoints da API

O PayloadCMS expõe automaticamente uma API REST completa:

```bash
# Posts
GET    /api/posts              # Listar posts
GET    /api/posts/:id          # Obter post
POST   /api/posts              # Criar post
PATCH  /api/posts/:id          # Atualizar post
DELETE /api/posts/:id          # Deletar post

# Eventos
GET    /api/events             # Listar eventos
GET    /api/events/:id         # Obter evento

# Colunistas
GET    /api/columnists         # Listar colunistas
GET    /api/columnists/:id     # Obter colunista

# Globals
GET    /api/globals/site-settings
GET    /api/globals/header
GET    /api/globals/footer
```

## 🔐 Autenticação

```bash
# Login
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password"
}

# Usar token nas requisições
Authorization: JWT <token>
```

## 📝 Variáveis de Ambiente

```env
# PayloadCMS
PAYLOAD_SECRET=your-secret-key
DATABASE_URI=mongodb://localhost:27017/edashow

# Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## 🚢 Deploy

### Vercel (Recomendado)

1. Configure MongoDB Atlas (gratuito)
2. Configure as variáveis de ambiente no Vercel
3. Deploy automático via Git

### Outras Plataformas

Consulte a [documentação do PayloadCMS](https://payloadcms.com/docs/production/deployment) para outras opções de deploy.

## 🚀 Como Começar (3 Passos Rápidos)

### 1. Iniciar MongoDB
```bash
brew services start mongodb-community
```

### 2. Iniciar o Servidor
```bash
pnpm dev
```

### 3. Acessar e Criar Conteúdo
- **Admin**: http://localhost:3000/admin (crie seu usuário)
- **Home**: http://localhost:3000
- **Exemplo CMS**: http://localhost:3000/cms-example

## ✅ Implementação Completa

### 🎯 Componentes Integrados com CMS
- ✅ **Latest News** - Busca posts reais do PayloadCMS
- ✅ **Events** - Busca eventos reais do PayloadCMS
- ✅ **Columnists** - Busca colunistas reais do PayloadCMS

### 📄 Páginas Dinâmicas Criadas
- ✅ `/posts/[slug]` - Página individual de posts com SEO
- ✅ `/events/[slug]` - Página individual de eventos com SEO
- ✅ `/columnists/[slug]` - Página de colunistas com artigos
- ✅ `/posts` - Lista completa de todos os posts
- ✅ `/events` - Lista completa de todos os eventos

### ⚡ Features Implementadas
- ✅ Integração completa com PayloadCMS
- ✅ Geração estática de páginas (SSG)
- ✅ SEO otimizado (metadados + Open Graph)
- ✅ Otimização de imagens (Next.js Image)
- ✅ Fallback inteligente para dados estáticos
- ✅ Formatação de datas em português (pt-BR)
- ✅ Layout 100% responsivo
- ✅ Navegação intuitiva com breadcrumbs

## 📖 Documentação Completa

### Guias de Início
- **[COMO_COMECAR.md](./COMO_COMECAR.md)** ⚡ - Guia rápido de 3 passos
- **[IMPLEMENTACAO_COMPLETA.md](./IMPLEMENTACAO_COMPLETA.md)** 📋 - Tudo que foi implementado

### Documentação Técnica
- **[INTEGRACAO_PAYLOAD.md](./INTEGRACAO_PAYLOAD.md)** 🔧 - Resumo da integração
- **[PAYLOAD_README.md](./PAYLOAD_README.md)** 📚 - Guia completo do CMS
- **[EXEMPLOS_USO.md](./EXEMPLOS_USO.md)** 💻 - Exemplos práticos de código
- **[ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)** 🗂️ - Estrutura visual

### Referências Externas
- [PayloadCMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar um PR.

## 📄 Licença

Este projeto é privado e proprietário.

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

**Desenvolvido com ❤️ usando Next.js e PayloadCMS**