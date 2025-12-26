# ✅ Resumo da Configuração - EdaShow

## 🎯 Variáveis Configuradas

### ✅ DATABASE_URI
```
postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
```

### ✅ PAYLOAD_SECRET
```
fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=
```

### ✅ NEXT_PUBLIC_SERVER_URL
```
https://www.edashow.com.br
```

## 🚀 Configurar na Vercel

### Opção 1: Script Automático (Recomendado)

```bash
./scripts/quick-setup-vercel.sh
```

### Opção 2: Via Dashboard

1. Acesse: **https://vercel.com/insightfy/edashow/settings/environment-variables**
2. Adicione as 3 variáveis acima

### Opção 3: Via CLI

```bash
# DATABASE_URI
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production

# PAYLOAD_SECRET
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production

# NEXT_PUBLIC_SERVER_URL
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production
```

## ✅ Verificar

```bash
vercel env ls
```

## 🚀 Deploy

```bash
vercel --prod
```

Ou faça push para GitHub para deploy automático.

## 🌐 URLs do Projeto

- **Site**: https://www.edashow.com.br
- **Admin**: https://www.edashow.com.br/admin
- **API**: https://www.edashow.com.br/api/posts

## 📚 Documentação

- [CONFIGURACAO_DATABASE_URI.md](./CONFIGURACAO_DATABASE_URI.md) - Guia completo
- [COMANDOS_RAPIDOS.md](./COMANDOS_RAPIDOS.md) - Comandos essenciais
- [PRONTO_PARA_DEPLOY.md](./PRONTO_PARA_DEPLOY.md) - Checklist de deploy

