# 🔧 Configurar Variáveis de Ambiente na Vercel

## ⚠️ PROBLEMA IDENTIFICADO

O erro no servidor (`Application error: a server-side exception has occurred`) está sendo causado por **variáveis de ambiente não configuradas** na Vercel.

## ✅ CORREÇÕES IMPLEMENTADAS

1. ✅ **Tratamento de erros na formatação de data** - Proteção contra datas inválidas
2. ✅ **Try/catch na página principal** - Tratamento robusto de erros
3. ✅ **Fallback automático** - Página funciona mesmo se APIs falharem

## 🚀 CONFIGURAR VARIÁVEIS DE AMBIENTE

### Opção 1: Usando o Script Automático

```bash
./scripts/setup-vercel-env.sh
```

### Opção 2: Manualmente via Vercel CLI

#### 1. Configurar NEXT_PUBLIC_SERVER_URL (OBRIGATÓRIA)

```bash
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production
```

#### 2. Configurar DATABASE_URI (OBRIGATÓRIA)

```bash
vercel env add DATABASE_URI production
# Cole sua connection string PostgreSQL quando solicitado
```

**Exemplo de DATABASE_URI:**
```
postgresql://user:password@host.pooler.supabase.com:6543/postgres
```

#### 3. Configurar PAYLOAD_SECRET (OBRIGATÓRIA)

```bash
vercel env add PAYLOAD_SECRET production
# Cole seu secret (mínimo 32 caracteres) quando solicitado
```

**Gerar PAYLOAD_SECRET:**
```bash
openssl rand -base64 32
```

#### 4. Configurar Variáveis do Supabase (OPCIONAIS - para uploads)

```bash
vercel env add SUPABASE_ENDPOINT production
vercel env add SUPABASE_REGION production
vercel env add SUPABASE_BUCKET production
vercel env add SUPABASE_ACCESS_KEY_ID production
vercel env add SUPABASE_SECRET_ACCESS_KEY production
```

### Opção 3: Via Dashboard da Vercel

1. Acesse: https://vercel.com/insightfy/edashow
2. Vá em **Settings** → **Environment Variables**
4. Adicione as variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `NEXT_PUBLIC_SERVER_URL` | `https://www.edashow.com.br` | Production |
| `DATABASE_URI` | `postgresql://...` | Production |
| `PAYLOAD_SECRET` | `seu-secret-32+caracteres` | Production |

## 📋 CHECKLIST DE VARIÁVEIS

### ✅ Obrigatórias (mínimo para funcionar)

- [ ] `NEXT_PUBLIC_SERVER_URL` = `https://www.edashow.com.br`
- [ ] `DATABASE_URI` = Connection string PostgreSQL
- [ ] `PAYLOAD_SECRET` = Secret com mínimo 32 caracteres

### ⚙️ Opcionais (para funcionalidades completas)

- [ ] `SUPABASE_ENDPOINT` = Endpoint do Supabase Storage
- [ ] `SUPABASE_REGION` = Região (ex: `us-east-1`)
- [ ] `SUPABASE_BUCKET` = Nome do bucket (ex: `media`)
- [ ] `SUPABASE_ACCESS_KEY_ID` = Access Key ID
- [ ] `SUPABASE_SECRET_ACCESS_KEY` = Secret Access Key
- [ ] `NEXT_PUBLIC_SUPABASE_URL` = URL pública do Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Chave anônima do Supabase

## 🔍 VERIFICAR VARIÁVEIS CONFIGURADAS

```bash
vercel env ls
```

## 🚀 APÓS CONFIGURAR

1. **Faça um redeploy:**
   ```bash
   vercel --prod
   ```

2. **Ou force um redeploy via dashboard:**
   - Vercel Dashboard → Deployments → Redeploy

3. **Verifique os logs:**
   ```bash
   vercel logs
   ```

## 🐛 DIAGNÓSTICO

### Verificar se variáveis estão configuradas:

```bash
vercel env ls
```

### Ver logs de erro:

```bash
vercel logs --follow
```

### Testar endpoint da API:

```bash
curl https://www.edashow.com.br/api/posts
```

## 📝 NOTAS IMPORTANTES

1. **NEXT_PUBLIC_SERVER_URL** deve ser a URL de produção (não localhost)
2. **DATABASE_URI** deve ser uma connection string PostgreSQL válida
3. **PAYLOAD_SECRET** deve ter pelo menos 32 caracteres
4. Após configurar variáveis, **sempre faça um redeploy**
5. Variáveis `NEXT_PUBLIC_*` são expostas ao cliente, use com cuidado

## ✅ APÓS CONFIGURAR TUDO

O site deve funcionar corretamente. Se ainda houver erros:

1. Verifique os logs: `vercel logs`
2. Verifique se todas as variáveis estão configuradas: `vercel env ls`
3. Faça um redeploy: `vercel --prod`

---

**Última atualização:** $(date)

