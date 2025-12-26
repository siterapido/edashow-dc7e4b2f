# 🚀 Configuração com DATABASE_URI Fornecida

## ✅ DATABASE_URI Configurada

A seguinte DATABASE_URI foi configurada no projeto:

```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

## 📋 Próximos Passos

### 1️⃣ Configurar Variáveis na Vercel

Você tem **3 opções** para configurar as variáveis:

#### Opção A: Via Script Automático (Recomendado) ⭐

```bash
# Dar permissão de execução
chmod +x scripts/setup-vercel-env.sh

# Executar o script
./scripts/setup-vercel-env.sh
```

O script irá:
- ✅ Configurar `DATABASE_URI` automaticamente
- ✅ Configurar `PAYLOAD_SECRET` gerado
- ✅ Solicitar `NEXT_PUBLIC_SERVER_URL`
- ✅ Opcionalmente configurar Supabase Storage

#### Opção B: Via Dashboard da Vercel (Mais Visual)

1. Acesse: **https://vercel.com/insightfy/edashow**
2. Vá em **Settings** → **Environment Variables**
3. Adicione as seguintes variáveis:

| Variável | Valor | Ambiente |
|----------|-------|----------|
| `DATABASE_URI` | `postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres` | Production |
| `PAYLOAD_SECRET` | `fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=` | Production |
| `NEXT_PUBLIC_SERVER_URL` | `https://www.edashow.com.br` | Production |

#### Opção C: Via Vercel CLI (Manual)

```bash
# DATABASE_URI
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production

# PAYLOAD_SECRET
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production

# NEXT_PUBLIC_SERVER_URL
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production
```

### 2️⃣ Verificar Variáveis Configuradas

```bash
vercel env ls
```

Você deve ver:
- ✅ `DATABASE_URI` (Production)
- ✅ `PAYLOAD_SECRET` (Production)
- ✅ `NEXT_PUBLIC_SERVER_URL` (Production)

### 3️⃣ Fazer Deploy

#### Opção A: Deploy Automático (via GitHub)
```bash
git add .
git commit -m "feat: configura DATABASE_URI e variáveis de ambiente"
git push origin main
```

A Vercel fará deploy automaticamente quando detectar o push.

#### Opção B: Deploy Manual
```bash
vercel --prod
```

### 4️⃣ Após o Deploy

1. **Aguarde o build completar** (2-5 minutos)
2. **Acesse o site**: `https://www.edashow.com.br`
3. **Acesse o admin**: `https://www.edashow.com.br/admin`
4. **Crie o primeiro usuário admin**:
   - Preencha nome, email e senha
   - Role: Admin
   - Salve

### 5️⃣ Testar Conexão com o Banco

```bash
# Testar conexão localmente (se tiver .env configurado)
pnpm run test:db

# Ou verificar variáveis
pnpm run check:env
```

## 🔐 Variáveis Configuradas

### ✅ Obrigatórias (Já Configuradas)

- ✅ **DATABASE_URI**: Connection string PostgreSQL do Supabase
- ✅ **PAYLOAD_SECRET**: Secret gerado para criptografia (32+ caracteres)
- ✅ **NEXT_PUBLIC_SERVER_URL**: `https://www.edashow.com.br` (configurada)

### ⚙️ Opcionais (Para Uploads de Imagens)

Se quiser fazer upload de imagens, configure também:

- `SUPABASE_ENDPOINT`: `https://exeuuqbgyfaxgbwygfuu.supabase.co/storage/v1/s3`
- `SUPABASE_REGION`: `us-east-1`
- `SUPABASE_BUCKET`: `media`
- `SUPABASE_ACCESS_KEY_ID`: (obtenha no Supabase Dashboard)
- `SUPABASE_SECRET_ACCESS_KEY`: (obtenha no Supabase Dashboard)

**Nota**: O site funciona sem essas variáveis, mas você não poderá fazer upload de imagens.

## 🐛 Troubleshooting

### ❌ Erro: "Database connection failed"

**Solução**:
1. Verifique se a DATABASE_URI está correta
2. Verifique se o banco está acessível (não bloqueado por firewall)
3. Teste a conexão localmente primeiro

### ❌ Erro: "PAYLOAD_SECRET is required"

**Solução**:
1. Verifique se configurou `PAYLOAD_SECRET` na Vercel
2. O secret deve ter pelo menos 32 caracteres
3. Faça um redeploy após adicionar a variável

### ❌ Erro: "NEXT_PUBLIC_SERVER_URL is not set"

**Solução**:
1. Configure `NEXT_PUBLIC_SERVER_URL` com: `https://www.edashow.com.br`
2. Faça um redeploy após adicionar a variável

## 📝 Checklist Final

- [ ] DATABASE_URI configurada na Vercel
- [ ] PAYLOAD_SECRET configurado na Vercel
- [x] NEXT_PUBLIC_SERVER_URL configurado na Vercel (`https://www.edashow.com.br`)
- [ ] Deploy realizado com sucesso
- [ ] Site acessível
- [ ] Admin acessível (`/admin`)
- [ ] Primeiro usuário admin criado

## 🎉 Pronto!

Após completar os passos acima, seu projeto estará funcionando!

**Links Úteis**:
- 📊 Dashboard Vercel: https://vercel.com/insightfy/edashow
- 🔧 Settings: https://vercel.com/insightfy/edashow/settings/environment-variables
- 📚 Documentação: [PRONTO_PARA_DEPLOY.md](./PRONTO_PARA_DEPLOY.md)

---

**Última atualização**: $(date)
**DATABASE_URI**: Configurada ✅
**PAYLOAD_SECRET**: Gerado ✅

