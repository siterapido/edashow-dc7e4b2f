# ⚡ Comandos Rápidos - Configuração Vercel

## 🚀 Configuração Rápida (1 comando)

```bash
./scripts/quick-setup-vercel.sh
```

Este script configura automaticamente:
- ✅ `DATABASE_URI` (já configurada)
- ✅ `PAYLOAD_SECRET` (gerado)
- ✅ `NEXT_PUBLIC_SERVER_URL` (`https://www.edashow.com.br`)

## 📋 Variáveis Configuradas

### DATABASE_URI
```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### PAYLOAD_SECRET
```
fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=
```

## 🔧 Configuração Manual (se preferir)

### Via Dashboard Vercel
1. Acesse: https://vercel.com/insightfy/edashow/settings/environment-variables
2. Adicione as 3 variáveis acima

### Via CLI
```bash
# DATABASE_URI
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production

# PAYLOAD_SECRET
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production

# NEXT_PUBLIC_SERVER_URL
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production
```

## ✅ Verificar Configuração

```bash
vercel env ls
```

## 🚀 Fazer Deploy

```bash
# Opção 1: Deploy manual
vercel --prod

# Opção 2: Push para GitHub (deploy automático)
git add .
git commit -m "feat: configura variáveis de ambiente"
git push origin main
```

## 🧪 Testar Conexão (Local)

```bash
# Criar arquivo .env.local com as variáveis
# Depois executar:
pnpm run test:db
```

## 📚 Documentação Completa

- [CONFIGURACAO_DATABASE_URI.md](./CONFIGURACAO_DATABASE_URI.md) - Guia completo passo a passo
- [PRONTO_PARA_DEPLOY.md](./PRONTO_PARA_DEPLOY.md) - Checklist de deploy
- [CHECKLIST_DEPLOY_VERCEL.md](./CHECKLIST_DEPLOY_VERCEL.md) - Checklist detalhado

