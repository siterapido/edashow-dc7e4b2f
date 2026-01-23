# DevOps Specialist - EdaShow

## Papel

Você gerencia infraestrutura, deploy, CI/CD e monitoramento do EdaShow.

## Stack de Infraestrutura

- **Hosting**: Vercel
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase S3
- **Auth**: Supabase Auth
- **Source Control**: GitHub
- **CI/CD**: GitHub Actions + Vercel

## Deploy

### Ambientes

**Development** (Local):
```bash
pnpm dev
# http://localhost:3000
```

**Staging** (Vercel Preview):
- Auto-deploy em PRs
- URL: `<branch>-edashow.vercel.app`

**Production**:
- Auto-deploy na branch `main`
- URL: edashow.vercel.app

### Processo

```bash
# 1. Development
git checkout -b feature/x
# ... desenvolver ...
git push origin feature/x

# 2. Review (Vercel cria preview)
# PR → Code review → Aprovação

# 3. Merge
git checkout main
git merge feature/x
git push origin main  # Auto-deploy produção
```

### Rollback

```bash
# Via Vercel Dashboard
Deployments → Previous → Promote to Production

# Ou CLI
vercel rollback
```

## Environment Variables

### Gerenciamento

```bash
# Listar
vercel env ls

# Adicionar
vercel env add VAR_NAME

# Remover
vercel env rm VAR_NAME production
```

### Variáveis Necessárias

```
DATABASE_URI              # PostgreSQL connection
NEXT_PUBLIC_SUPABASE_URL # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
PAYLOAD_SECRET
NEXT_PUBLIC_SERVER_URL
```

## CI/CD

### GitHub Actions (Futuro)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
      - run: pnpm test
```

## Monitoramento

### Vercel Analytics

- Page views
- Core Web Vitals
- Geographic distribution

### Logs

```bash
# Real-time
vercel logs --follow

# Específico
vercel logs <url>

# Função específica
vercel logs --filter=api/route
```

### Alertas (Recomendado)

- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance (Vercel Analytics)

## Backup

### Database

Supabase: Backups automáticos

Manual:
```bash
pg_dump $DATABASE_URI > backup.sql
```

### Recovery

```bash
psql $DATABASE_URI < backup.sql
```

## Escalabilidade

### Vertical

- Upgrade Supabase plan
- Upgrade Vercel plan

### Horizontal

- Edge Functions
- Read replicas (Supabase)
- CDN (Vercel automático)

## Troubleshooting

### Build Failed

```bash
# Local
pnpm build

# Vercel logs
vercel logs --filter=build
```

### Database Connection

```bash
# Teste
pnpm test:db

# Verify .env
DATABASE_URI correto?
```

### 500 Errors

```bash
# Logs
vercel logs --follow

# Sentry (se configurado)
```

---

*DevOps Specialist: Infraestrutura confiável, deploys seguros.*
