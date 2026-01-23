# Workflow de Desenvolvimento - EdaShow

## Visão Geral

Este documento descreve o processo completo de desenvolvimento no projeto EdaShow, desde a criação de uma feature até o deploy em produção.

## Ambiente de Desenvolvimento

### Configuração Inicial

```bash
# 1. Clone o repositório
git clone <repo-url>
cd edashow-1

# 2. Instale as dependências
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 4. Inicie o servidor de desenvolvimento
pnpm dev
```

###Acessos Locais
- **Frontend**: http://localhost:3000
- **Admin (Payload)**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard

## Estrutura de Branches

```
main              # Produção (protegida)
├── develop       # Desenvolvimento (integração)
├── feature/*     # Novas features
├── fix/*         # Correções de bugs
├── hotfix/*      # Correções urgentes
└── refactor/*    # Refatorações
```

### Nomenclatura de Branches

```bash
feature/nome-da-feature    # Nova funcionalidade
fix/descricao-do-bug       # Correção de bug
hotfix/problema-critico    # Correção urgente
refactor/componente-x      # Refatoração
```

## Processo de Desenvolvimento

### 1. **Planning (Planejamento)**

#### Antes de começar:
- [ ] Entenda completamente o requisito
- [ ] Leia a documentação relevante em `.context/docs/`
- [ ] Consulte o playbook apropriado em `.context/agents/`
- [ ] Identifique arquivos que serão modificados
- [ ] Liste dependências e integrações

#### Crie um branch:
```bash
git checkout -b feature/nome-da-feature
```

#### Documente o plano (opcional, para features complexas):
```markdown
# Feature: Nome da Feature

## Objetivo
Descrição clara do que será implementado

## Arquivos Afetados
- app/...
- components/...
- lib/...

## Dependências
- Biblioteca X
- API Y

## Testes Necessários
- Teste unitário de...
- Teste de integração de...
```

### 2. **Execution (Execução)**

#### Padrões de Código

**TypeScript Strict**:
```typescript
// ✅ BOM - Tipos explícitos
interface Props {
  title: string
  onSubmit: (data: FormData) => Promise<void>
}

// ❌ MAL - any ou tipos implícitos
const handleClick = (e: any) => { }
```

**Server Components por padrão**:
```typescript
// ✅ BOM - Server Component (sem 'use client')
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// ⚠️ Somente use 'use client' quando necessário
'use client'
export function InteractiveComponent() { }
```

**Server Actions**:
```typescript
// lib/actions/my-action.ts
'use server'

export async function createItem(formData: FormData) {
  const data = {
    title: formData.get('title'),
    // ...
  }
  // Validação com Zod
  const validated = schema.parse(data)
  
  // Salvado no banco
  await supabase.from('items').insert(validated)
  
  // Revalidate cache
  revalidatePath('/items')
}
```

**Componentes**:
```typescript
// components/my-component.tsx
import { cn } from '@/lib/utils'

interface MyComponentProps {
  className?: string
  children: React.ReactNode
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  )
}
```

#### Estrutura de Pastas

**Novos componentes**:
```
components/
├── ui/                    # Primitives (shadcn)
├── dashboard/             # Dashboard específicos
├── agno-chat/             # Chat relacionados
└── [feature]/             # Componentes de feature
    ├── index.tsx          # Export barrel
    ├── component-a.tsx
    └── component-b.tsx
```

**Server Actions**:
```
lib/
└── actions/
    ├── artifacts.ts       # Artefatos
    ├── posts.ts           # Posts
    └── [feature].ts       # Nova feature
```

**Novas rotas**:
```
app/
├── (frontend)/            # Públicas
│   └── [nova-rota]/
│       └── page.tsx
└── dashboard/             # Protegidas
    └── [nova-rota]/
        └── page.tsx
```

#### Durante o Desenvolvimento

**Commits frequentes**:
```bash
git add .
git commit -m "feat: adiciona componente X"
```

**Mensagens de commit (Conventional Commits)**:
```
feat: nova funcionalidade
fix: correção de bug
docs: mudança na documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição ou modificação de testes
chore: mudanças no build, CI, etc
```

### 3. **Review (Revisão)**

#### Auto-Review Checklist

Antes de abrir PR:
- [ ] Código segue os padrões do projeto
- [ ] TypeScript sem erros (`pnpm build`)
- [ ] Linter satisfeito (`pnpm lint`)
- [ ] Testes passando (quando aplicável)
- [ ] Sem console.logs desnecessários
- [ ] Comentários úteis onde necessário
- [ ] Documentação atualizada (se aplicável)

#### Code Review

**Abra um Pull Request**:
```markdown
## Descrição
Breve descrição da mudança

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Testado localmente
- [ ] TypeScript build OK
- [ ] Linter OK
- [ ] Documentação atualizada

## Screenshots (se UI)
![screenshot](url)
```

**Reviewer Checklist**:
- [ ] Código é claro e legível
- [ ] Lógica está correta
- [ ] Não há código duplicado
- [ ] Performance está OK
- [ ] Segurança não foi comprometida
- [ ] Testes cobrem casos importantes
- [ ] Documentação está clara

### 4. **Validation (Validação)**

#### Testes Locais

**Build de produção**:
```bash
pnpm build
pnpm start
```

**Checklist de Validação**:
- [ ] Build sem erros
- [ ] Página carrega corretamente
- [ ] Features funcionam como esperado
- [ ] Não há erros no console
- [ ] Performance está boa (Lighthouse)
- [ ] Responsivo em mobile
- [ ] Dark mode funciona (se aplicável)

#### Testes em Staging (Vercel Preview)

```bash
# Push para branch
git push origin feature/nome-da-feature

# Vercel cria preview automaticamente
# Acesse: <branch-name>-edashow.vercel.app
```

**Validação em Preview**:
- [ ] Variáveis de ambiente corretas
- [ ] Database connection OK
- [ ] Storage uploads funcionando
- [ ] Auth funcionando
- [ ] Performance aceitável

### 5. **Confirmation (Confirmação)**

#### Merge para Main

```bash
# Após aprovação do PR
git checkout main
git pull origin main
git merge --no-ff feature/nome-da-feature
git push origin main
```

#### Deploy Automático

Vercel detecta push na `main` e faz deploy automático.

**Smoke Tests em Produção**:
- [ ] Site acessível
- [ ] Login funciona
- [ ] Feature nova funciona
- [ ] Sem erros críticos

#### Rollback (se necessário)

```bash
# No Vercel Dashboard
# Deployments → Encontre deploy anterior → Promote to Production

# Ou via CLI
vercel rollback
```

## Scripts Úteis

```bash
# Desenvolvimento
pnpm dev              # Servidor local
pnpm build            # Build de produção
pnpm start            # Servir build
pnpm lint             # Lint código
pnpm lint:fix         # Fix automático

# Database
pnpm seed:posts       # Popular posts exemplo
pnpm test:db          # Testar conexão DB
pnpm reset:admin      # Reset admin user

# Migrações (legado)
pnpm export:mongodb   # Exportar MongoDB
pnpm import:postgres  # Importar para Postgres
pnpm migrate:images   # Migrar para Supabase
```

## Debugging

### Next.js

**Server-side**:
```typescript
// app/page.tsx (Server Component)
export default async function Page() {
  const data = await getData()
  console.log('Server:', data) // Aparece no terminal
  return <div>...</div>
}
```

**Client-side**:
```typescript
'use client'
export function Component() {
  console.log('Client:', data) // Aparece no browser console
}
```

### Payload CMS

**Logs do Payload**:
- Admin em: `http://localhost:3000/admin`
- Logs no terminal onde `pnpm dev` está rodando

### Supabase

**Database**:
```bash
# Via Supabase Dashboard
# Table Editor → Visualizar dados

# Ou via SQL Editor
SELECT * FROM payload_posts LIMIT 10;
```

**Storage**:
```bash
# Via Supabase Dashboard
# Storage → Buckets → media → Browse files
```

## Ambientes

### Development (Local)
- URL: http://localhost:3000
- Database: Supabase dev project
- Storage: Supabase dev bucket
- Env: `.env.local`

### Staging (Vercel Preview)
- URL: `<branch>-edashow.vercel.app`
- Database: Supabase dev/staging project
- Storage: Supabase dev/staging bucket
- Env: Vercel Preview Environment Variables

### Production (Vercel)
- URL: edashow.vercel.app (ou domínio custom)
- Database: Supabase production project
- Storage: Supabase production bucket
- Env: Vercel Production Environment Variables

## Boas Práticas

### Performance

1. **Use Server Components** quando possível
2. **Dynamic imports** para componentes pesados:
   ```typescript
   const HeavyComponent = dynamic(() => import('./HeavyComponent'))
   ```
3. **Image optimization** com Next/Image
4. **Minimize client-side JavaScript**

### Segurança

1. **Nunca commite secrets** (.env no .gitignore)
2. **Valide inputs** com Zod
3. **Use Server Actions** para mutações
4. **RLS no Supabase** para proteção de dados
5. **Sanitize user content** antes de renderizar

### Acessibilidade

1. **Use Radix UI** (acessível por padrão)
2. **Labels em inputs**
3. **Alt text em imagens**
4. **Contraste adequado** (WCAG AA)
5. **Navegação por teclado**

### SEO

1. **Metadata em cada página**:
   ```typescript
   export const metadata = {
     title: 'Título',
     description: 'Descrição',
   }
   ```
2. **Semantic HTML** (h1, article, section)
3. **Sitemap e robots.txt**
4. **Open Graph tags**

## Troubleshooting

### Build falhando

```bash
# Limpar cache
rm -rf .next node_modules
pnpm install
pnpm build
```

### Database connection error

```bash
# Verificar .env
pnpm check:env

# Testar conexão
pnpm test:db
```

### Supabase upload falhando

```bash
# Verificar:
# 1. Bucket existe e tem nome correto
# 2. Políticas de acesso configuradas
# 3. Credenciais S3 corretas no .env
```

### Vercel deploy falhando

```bash
# Verificar:
# 1. Build local funciona (pnpm build)
# 2. Variáveis de ambiente no Vercel
# 3. Logs no Vercel Dashboard
```

## Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Payload Docs](https://payloadcms.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)

---

*Atualizado em 2026-01-16. Sujeito a mudanças conforme evolução do projeto.*
