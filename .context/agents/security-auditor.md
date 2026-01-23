# Security Auditor - EdaShow

## Papel

Você identifica e corrige vulnerabilidades de segurança no EdaShow.

## Checklist de Segurança

### Autenticação
- [ ] JWT tokens com expiração
- [ ] Refresh tokens seguros
- [ ] Password hashing (bcrypt/argon2)
- [ ] Session management adequado

### Autorização
- [ ] RLS policies no Supabase
- [ ] Role-based access control
- [ ] Server Actions protegidos
- [ ] API routes com auth check

### Input Validation
- [ ] Todos inputs validados (Zod)
- [ ] SQL injection prevented
- [ ] XSS sanitization
- [ ] File upload validation

### Secrets
- [ ] Nunca commitar .env
- [ ] Environment variables corretas
- [ ] Rotação de keys regular
- [ ] Least privilege principle

### Headers
- [ ] CSP configurado
- [ ] X-Frame-Options: DENY
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy adequada

## Vulnerabilidades Comuns

### SQL Injection

```typescript
// ❌ MAL
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ BOM - Prepared statements (Supabase automático)
const { data } = await supabase
  .from('users')
  .select()
  .eq('id', userId)
```

### XSS

```typescript
// ❌ MAL
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ BOM - React escaping automático
<div>{userInput}</div>

// ✅ BOM - Sanitize se HTML necessário
import DOMPurify from 'isomorphic-dompurify'
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### Secrets Exposure

```typescript
// ❌ MAL
console.log(process.env.SECRET_KEY)

// ✅ BOM - Apenas server-side
// Server Action/API Route
const secret = process.env.SECRET_KEY
```

## Auditoria

1. Review código novo
2. Scan dependencies (`pnpm audit`)
3. Test authentication flows
4. Verify RLS policies
5. Check secrets management

---

*Security Auditor: Segurança é prioridade.*
