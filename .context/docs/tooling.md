# Tooling - EdaShow

## Ferramentas de Desenvolvimento

### Package Manager: pnpm

**Por quê pnpm?**
- Mais rápido que npm/yarn
- Economiza espaço em disco (hard links)
- Strict dependency resolution

```bash
# Instalar pnpm
npm install -g pnpm

# Comandos básicos
pnpm install           # Instalar dependências
pnpm add <package>     # Adicionar pacote
pnpm remove <package>  # Remover pacote
pnpm update            # Atualizar dependências
```

### TypeScript

**Configuração**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Type Checking**:
```bash
# Durante desenvolvimento
pnpm dev  # TypeScript checking automático

# Build (type check completo)
pnpm build
```

### ESLint

**Configuração**: `.eslintrc.json` (padrão Next.js)

```bash
# Lint código
pnpm lint

# Fix automático
pnpm lint:fix
```

### Git

**Comandos Úteis**:
```bash
# Status
git status

# Adicionar mudanças
git add .
git add <arquivo>

# Commit
git commit -m "feat: descrição"

# Push
git push origin <branch>

# Pull
git pull origin <branch>

# Criar branch
git checkout -b feature/nome

# Trocar branch
git checkout <branch>

# Ver diferenças
git diff
```

### VS Code (Recomendado)

**Extensões Essenciais**:
- ESLint
- TypeScript
- Tailwind CSS IntelliSense
- Prettier
- GitLens

**Settings** (.vscode/settings.json):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Ferramentas de Build

### Next.js CLI

```bash
# Desenvolvimento
pnpm dev
# Inicia servidor em http://localhost:3000

# Build produção
pnpm build
# Cria .next/ otimizado

# Start produção
pnpm start
# Serve build de produção

# Analisar bundle
ANALYZE=true pnpm build
```

### Vercel CLI

```bash
# Instalar
pnpm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs <url>

# Variáveis de ambiente
vercel env ls
vercel env add <NAME>
```

## Debugging

### React DevTools

Browser extension para inspecionar componentes React.

**Instalação**:
- Chrome: [React DevTools](https://chrome.google.com/webstore)
- Firefox: [React DevTools](https://addons.mozilla.org/firefox)

### Next.js Debugging

**Server-side**:
```typescript
// Logs aparecem no terminal
console.log('Server:', data)
```

**Client-side**:
```typescript
'use client'
// Logs aparecem no browser console
console.log('Client:', data)
```

**VS Code Debugger** (.vscode/launch.json):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Supabase Debugging

**Dashboard**:
- Table Editor: Visualizar dados
- SQL Editor: Queries manuais
- Logs: Ver logs do database

**Queries**:
```sql
-- Ver posts
SELECT * FROM payload_posts LIMIT 10;

-- Ver artefatos
SELECT * FROM research_artifacts 
WHERE user_id = '<user-id>';

-- Ver chat messages
SELECT * FROM chat_messages 
ORDER BY created_at DESC LIMIT 20;
```

## Performance

### Lighthouse

**Via Chrome DevTools**:
1. Abra DevTools (F12)
2. Tab "Lighthouse"
3. Generate report

**Métricas importantes**:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Bundle Analyzer

```bash
# Instalar
pnpm add -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(config)

# Analisar
ANALYZE=true pnpm build
```

### Web Vitals

**Core Web Vitals**:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

**Monitoramento**:
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Database Tools

### Supabase Dashboard

**Acesso**: https://supabase.com/dashboard

**Principais Seções**:
- **Table Editor**: CRUD visual
- **SQL Editor**: Queries customizadas
- **Database**: Schemas, extensions
- **Storage**: Gerenciar buckets e arquivos
- **Auth**: Usuários e configurações

### psql (PostgreSQL CLI)

```bash
# Conectar
psql '<DATABASE_URI>'

# Comandos úteis
\dt              # Listar tabelas
\d <table>       # Descrever tabela
\q               # Sair

SELECT * FROM payload_posts LIMIT 5;
```

## Scripts do Projeto

### Desenvolvimento
```bash
pnpm dev          # Servidor desenvolvimento
pnpm build        # Build produção
pnpm start        # Servir build
pnpm lint         # Lint código
```

### Database
```bash
pnpm seed:posts   # Popular posts exemplo
pnpm check:env    # Verificar .env
pnpm test:db      # Testar conexão DB
```

### Admin
```bash
pnpm reset:admin     # Resetar admin user
pnpm diagnose:admin  # Diagnosticar admin
```

### Migrações (Legado)
```bash
pnpm export:mongodb       # Exportar MongoDB
pnpm import:postgres      # Importar Postgres
pnpm migrate:images       # Migrar Supabase
pnpm migrate:fallback     # Migrar posts fallback
```

## CI/CD

### GitHub Actions

Workflow básico (.github/workflows/ci.yml):
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
```

### Vercel Integration

**Automatic Deployment**:
- Push para `main` → Deploy produção
- Push para outras branches → Preview deployment

**Environment Variables**:
- Development: `.env.local`
- Preview: Vercel Preview env
- Production: Vercel Production env

## Documentação

### ai-context MCP

```bash
# Inicializar contexto
# (via MCP tool)

# Listar agentes
# (via MCP tool)

# Criar plano
# (via MCP tool)
```

### Storybook (Futuro)

Para documentar componentes visualmente.

## Utilitários

### Image Optimization

**Sharp** (usado automaticamente por Next.js):
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Descrição"
  quality={90}
/>
```

### Date Formatting

**date-fns**:
```typescript
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

format(new Date(), "dd/MM/yyyy", { locale: ptBR })
formatDistanceToNow(date, { locale: ptBR, addSuffix: true })
```

### Form Validation

**Zod**:
```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  age: z.number().positive()
})

const result = schema.safeParse(data)
if (!result.success) {
  console.error(result.error)
}
```

---

*Ferramentas e configurações atualizadas em 2026-01-16.*
