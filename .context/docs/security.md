# Segurança - EdaShow

## Visão Geral

Este documento descreve as práticas e controles de segurança implementados no EdaShow.

## Autenticação e Autorização

### Supabase Auth

**Sistema de Autenticação**:
- JWT-based authentication
- Tokens com expiração configurável
- Refresh tokens automáticos
- Session management

**Configuração**:
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Payload CMS Auth

**Admin Users**:
- Email/password authentication
- Role-based access control (RBAC)
- Admin, Editor, Viewer roles

**Access Control**:
```typescript
// payload/collections/Posts.ts
access: {
  read: () => true, // Público
  create: ({ req: { user } }) => !!user, // Autenticado
  update: ({ req: { user } }) => user?.role === 'admin', // Admin apenas
  delete: ({ req: { user } }) => user?.role === 'admin',
}
```

## Row Level Security (RLS)

### Políticas Supabase

**Artefatos de Usuário**:
```sql
-- research_artifacts
CREATE POLICY "Users see own artifacts"
  ON research_artifacts
  FOR ALL
  USING (auth.uid() = user_id);

-- image_analysis_artifacts
CREATE POLICY "Users see own analyses"
  ON image_analysis_artifacts
  FOR ALL
  USING (auth.uid() = user_id);

-- notes
CREATE POLICY "Users see own notes"
  ON notes
  FOR ALL
  USING (auth.uid() = user_id);
```

**Conteúdo Público**:
```sql
-- payload_posts (público para leitura)
CREATE POLICY "Public read posts"
  ON payload_posts
  FOR SELECT
  USING (true);

-- Admin write
CREATE POLICY "Admin write posts"
  ON payload_posts
  FOR INSERT
  USING (auth.role() = 'admin');
```

## Validação de Entrada

### Zod Schemas

**Todos os inputs são validados**:
```typescript
// lib/schemas/artifact.ts
import { z } from 'zod'

export const createArtifactSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(10),
  type: z.enum(['research', 'image', 'note']),
  metadata: z.record(z.unknown()).optional(),
})

// Uso em Server Action
export async function createArtifact(data: unknown) {
  // Valida e lança erro se inválido
  const validated = createArtifactSchema.parse(data)
  
  // Safe to use
  await supabase.from('artifacts').insert(validated)
}
```

### Sanitização de Conteúdo

**HTML/Markdown User Content**:
```typescript
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
}
```

**SQL Injection Prevention**:
- Uso de prepared statements (Supabase client)
- Nunca concatenar SQL strings
- Validação de tipos com Zod

**XSS Prevention**:
- React auto-escaping
- Sanitização de user content
- CSP headers (Content Security Policy)

## Secrets Management

### Environment Variables

**Nunca commitar secrets**:
```bash
# .gitignore
.env
.env.local
.env*.local
```

**Nomenclatura**:
```bash
# Público (pode ser exposto ao client)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Privado (apenas server-side)
SUPABASE_SERVICE_ROLE_KEY=...
DATABASE_URI=...
PAYLOAD_SECRET=...
```

**Rotação de Keys**:
- Supabase: Regenerar keys via dashboard
- Payload: Gerar novo secret: `openssl rand -base64 32`
- Database: Rotacionar senha regularmente

### Vercel Secrets

```bash
# Adicionar secret
vercel env add PAYLOAD_SECRET

# Listar
vercel env ls

# Remover (antiga após rotação)
vercel env rm PAYLOAD_SECRET <environment>
```

## Segurança de API

### Rate Limiting (Futuro)

**Recomendação**: Implementar rate limiting
```typescript
// middleware.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for')
  const { success } = await ratelimit.limit(ip!)
  
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
}
```

### CORS

**Next.js API Routes**:
```typescript
export async function POST(request: Request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SERVER_URL,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  
  // ... rest of handler
}
```

### CSRF Protection

**Server Actions** já têm proteção CSRF built-in do Next.js.

## Segurança de Storage

### Supabase Storage Policies

**Upload Policies**:
```sql
-- Usuários autenticados podem fazer upload
CREATE POLICY "Authenticated upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );
```

**Read Policies**:
```sql
-- Posts são públicos
CREATE POLICY "Public read posts images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media' AND folder = 'posts');

-- User uploads são privados
CREATE POLICY "User read own uploads"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'media' AND 
    folder = 'user-uploads' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### File Validation

**Tipo e Tamanho**:
```typescript
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function validateFile(file: File) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }
  
  if (file.size > MAX_SIZE) {
    throw new Error('File too large')
  }
}
```

### Scan de Malware (Recomendado)

Implementar scan antes do upload final:
- ClamAV
- VirusTotal API
- Cloud provider scanning

## Headers de Segurança

### Next.js Config

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
```

### Content Security Policy

```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
  ].join('; ')
}
```

## Logging e Monitoring

### Audit Logs

**Payload CMS**: Built-in audit logging
```typescript
// Payload automatically logs:
// - Who created/updated/deleted
// - When
// - What changed
```

**Custom Logging**:
```typescript
// lib/logger.ts
export function auditLog(action: string, userId: string, resource: string) {
  console.log({
    timestamp: new Date().toISOString(),
    action,
    userId,
    resource,
  })
  
  // Em produção, enviar para serviço de logging
  // (Sentry, LogRocket, Datadog, etc)
}
```

### Error Tracking (Recomendado)

**Sentry**:
```typescript
// app/error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'

export default function Error({ error }) {
  Sentry.captureException(error)
  return <div>Something went wrong</div>
}
```

## Dependências

### Audit de Vulnerabilidades

```bash
# Verificar vulnerabilidades
pnpm audit

# Fix automaticamente
pnpm audit --fix

# Dependabot (GitHub)
# Atualiza automaticamente dependencies vulneráveis
```

### Keep Up-to-Date

```bash
# Ver outdated packages
pnpm outdated

# Atualizar
pnpm update
```

## Backup e Recovery

### Database Backups

**Supabase**: Backups automáticos
- Point-in-time recovery
- Download manual via dashboard
- Restauração via SQL

**Processo de Backup Manual**:
```bash
# Backup via pg_dump
pg_dump -h aws-0-sa-east-1.pooler.supabase.com \
        -U postgres \
        -d postgres \
        -F c \
        -f backup-$(date +%Y%m%d).dump
```

### Disaster Recovery Plan

1. **Detectar problema**
2. **Isolar sistemas afetados**
3. **Restaurar do backup mais recente**
4. **Validar restauração**
5. **Comunicar status**

## Compliance e Privacy

### LGPD/GDPR

**Data Collection**:
- Coletar apenas dados necessários
- Consentimento explícito para tracking
- Direito de exclusão (delete account)
- Direito de exportação (download data)

**Implementar**:
```typescript
// Server Action para deletar conta
export async function deleteAccount(userId: string) {
  // Deletar dados do usuário
  await supabase.from('users').delete().eq('id', userId)
  await supabase.from('artifacts').delete().eq('user_id', userId)
  // ... outros dados
  
  // Deletar arquivos storage
  await supabase.storage.from('media').remove([`user-uploads/${userId}`])
}
```

## Checklist de Segurança

### Desenvolvimento
- [ ] Validar todos os inputs com Zod
- [ ] Sanitizar user content
- [ ] Usar Server Actions para mutações
- [ ] Nunca commitar secrets
- [ ] Usar HTTPS em produção

### Deploy
- [ ] Environment variables configuradas
- [ ] RLS policies ativas no Supabase
- [ ] Headers de segurança configurados
- [ ] Rate limiting (se aplicável)
- [ ] Backups configurados

### Monitoramento
- [ ] Error tracking ativo
- [ ] Audit logs revisados regularmente
- [ ] Dependências atualizadas
- [ ] Penetration testing (recomendado)

## Incidentes de Segurança

### Processo

1. **Identificar e Conter**
   - Identificar escopo do problema
   - Isolar sistemas afetados
   - Preservar evidências

2. **Investigar**
   - Revisar logs
   - Entender causa raiz
   - Documentar findings

3. **Remediar**
   - Aplicar correções
   - Testar fix
   - Deploy

4. **Comunicar**
   - Notificar usuários afetados (se aplicável)
   - Documentar internamente
   - Atualizar procedimentos

5. **Post-Mortem**
   - O que aconteceu?
   - Como prevenir no futuro?
   - Atualizar documentação

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/data-fetching/security)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Vercel Security](https://vercel.com/docs/security)

---

*Documentação de segurança atualizada em 2026-01-16.*
