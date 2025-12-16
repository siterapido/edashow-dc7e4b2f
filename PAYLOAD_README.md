# Integração PayloadCMS - EdaShow

## 📋 Visão Geral

Este projeto foi integrado com o PayloadCMS, um CMS headless moderno e poderoso construído com TypeScript e Next.js.

## 🚀 Instalação e Configuração

### Pré-requisitos

1. **MongoDB**: Você precisa ter o MongoDB instalado e rodando localmente, ou usar o MongoDB Atlas (cloud).

#### Instalar MongoDB localmente (macOS):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Ou usar MongoDB Atlas:
- Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crie um cluster
- Obtenha a string de conexão e atualize no arquivo `.env`

### Configuração

1. **Copie o arquivo de exemplo de variáveis de ambiente:**
```bash
cp .env.example .env
```

2. **Edite o arquivo `.env` com suas configurações:**
```env
PAYLOAD_SECRET=your-secret-key-here-change-this-in-production
DATABASE_URI=mongodb://localhost:27017/edashow
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

3. **Instale as dependências (se ainda não instalou):**
```bash
pnpm install
```

4. **Inicie o servidor de desenvolvimento:**
```bash
pnpm dev
```

## 🎯 Acessando o CMS

Após iniciar o servidor, você pode acessar:

- **Frontend**: http://localhost:3000
- **Painel Admin do PayloadCMS**: http://localhost:3000/admin

Na primeira vez que acessar o painel admin, você será solicitado a criar um usuário administrador.

## 📚 Collections Criadas

O CMS foi configurado com as seguintes collections:

### 1. **Users** (Usuários)
- Gerenciamento de usuários do CMS
- Autenticação integrada
- Roles: Admin, Editor, Autor

### 2. **Posts** (Notícias/Artigos)
- Título, slug, resumo
- Conteúdo rico (Lexical Editor)
- Imagem destacada
- Categorias: Notícias, Análises, Entrevistas, Opinião
- Tags
- Autor (relacionamento com Colunistas)
- Status: Rascunho, Publicado, Arquivado
- Data de publicação
- Opção de destaque

### 3. **Columnists** (Colunistas)
- Nome, slug
- Biografia
- Foto
- Cargo/Função
- Redes sociais (Twitter, LinkedIn, Instagram)

### 4. **Events** (Eventos)
- Título, slug
- Descrição
- Imagem
- Data de início e término
- Local
- Tipo: Presencial, Online, Híbrido
- URL de inscrição
- Status: Próximo, Em Andamento, Finalizado, Cancelado

### 5. **Media** (Mídia)
- Upload de imagens
- Processamento automático de tamanhos (thumbnail, card, tablet)
- Texto alternativo e legenda

## 🌐 Globals (Dados Singleton)

### 1. **Site Settings** (Configurações do Site)
- Nome e descrição do site
- Logo e favicon
- Redes sociais

### 2. **Header** (Cabeçalho)
- Navegação principal

### 3. **Footer** (Rodapé)
- Copyright
- Links do rodapé

## 🔌 API REST

O PayloadCMS expõe automaticamente uma API REST completa para todas as collections:

### Exemplos de Endpoints:

```bash
# Listar posts publicados
GET /api/posts?where[status][equals]=published&limit=10

# Obter um post específico
GET /api/posts/:id

# Criar um novo post (requer autenticação)
POST /api/posts

# Atualizar um post (requer autenticação)
PATCH /api/posts/:id

# Deletar um post (requer autenticação e role admin)
DELETE /api/posts/:id

# Obter configurações do site
GET /api/globals/site-settings

# Listar eventos
GET /api/events?where[status][equals]=upcoming
```

### Autenticação

Para fazer requisições autenticadas, você precisa:

1. Fazer login:
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "seu-email@example.com",
  "password": "sua-senha"
}
```

2. Usar o token retornado nas próximas requisições:
```bash
GET /api/posts
Authorization: JWT seu-token-aqui
```

## 💻 Usando no Frontend

### Exemplo de como buscar posts no frontend:

```typescript
// app/page.tsx ou qualquer componente
async function getPosts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?where[status][equals]=published&limit=10`,
    {
      next: { revalidate: 60 } // Revalidar a cada 60 segundos
    }
  )
  
  const data = await response.json()
  return data.docs
}

export default async function HomePage() {
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

### Exemplo com TypeScript (tipos gerados automaticamente):

```typescript
import type { Post } from '@/payload-types'

async function getPosts(): Promise<Post[]> {
  const response = await fetch('/api/posts?where[status][equals]=published')
  const data = await response.json()
  return data.docs
}
```

## 🎨 Customização

### Adicionar novos campos a uma collection:

Edite o arquivo `payload.config.ts` e adicione campos à collection desejada:

```typescript
{
  slug: 'posts',
  fields: [
    // ... campos existentes
    {
      name: 'viewCount',
      type: 'number',
      label: 'Visualizações',
      defaultValue: 0,
    },
  ],
}
```

### Criar uma nova collection:

Adicione ao array `collections` no `payload.config.ts`:

```typescript
{
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
```

## 🔒 Controle de Acesso

O controle de acesso já está configurado:

- **Leitura pública**: Qualquer pessoa pode ler posts, eventos, colunistas
- **Criação/Edição**: Requer autenticação
- **Exclusão**: Apenas administradores

Para customizar, edite a propriedade `access` em cada collection.

## 📖 Recursos Adicionais

- [Documentação oficial do PayloadCMS](https://payloadcms.com/docs)
- [API Reference](https://payloadcms.com/docs/rest-api/overview)
- [Exemplos de código](https://github.com/payloadcms/payload/tree/main/examples)

## 🐛 Troubleshooting

### Erro de conexão com MongoDB:
- Verifique se o MongoDB está rodando: `brew services list`
- Verifique a string de conexão no `.env`

### Erro de permissão ao fazer upload:
- Verifique se o diretório `public/uploads` existe e tem permissões de escrita

### Tipos TypeScript não atualizados:
- Os tipos são gerados automaticamente em `payload-types.ts`
- Se não estiverem atualizados, reinicie o servidor de desenvolvimento

## 📝 Próximos Passos

1. Acesse o painel admin e crie seu primeiro usuário
2. Crie alguns posts, eventos e colunistas de teste
3. Integre os dados do CMS nos componentes do frontend
4. Configure as variáveis de ambiente para produção
5. Considere usar MongoDB Atlas para produção
