# ✅ Vercel Conectado com Sucesso!

## 🎯 Projeto Conectado

- **Team**: `insightfy`
- **Projeto**: `edashow`
- **URL**: https://vercel.com/insightfy/edashow
- **Production URL**: https://edashow.vercel.app
- **Custom Domain**: https://www.edashow.com.br (configurar se necessário)

## ✅ Variáveis de Ambiente Configuradas

O projeto **já tem** as seguintes variáveis configuradas:

### Essenciais (✅ Configuradas)
- ✅ `DATABASE_URI` — PostgreSQL connection string
- ✅ `PAYLOAD_SECRET` — Secret do Payload CMS
- ✅ `NEXT_PUBLIC_SERVER_URL` — URL do servidor

### Supabase Storage (✅ Configuradas)
- ✅ `SUPABASE_ENDPOINT`
- ✅ `SUPABASE_REGION`
- ✅ `SUPABASE_BUCKET`
- ✅ `SUPABASE_ACCESS_KEY_ID`
- ✅ `SUPABASE_SECRET_ACCESS_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

### PostgreSQL/Neon (✅ Configuradas)
- ✅ `POSTGRES_URL`
- ✅ `POSTGRES_PRISMA_URL`
- ✅ `DATABASE_URL`
- E várias outras...

## 🚀 Próximos Passos

### 1. Verificar/Atualizar Variáveis

Se precisar atualizar alguma variável:

```bash
# Atualizar DATABASE_URI
vercel env rm DATABASE_URI production
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production

# Atualizar PAYLOAD_SECRET
vercel env rm PAYLOAD_SECRET production
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production

# Atualizar NEXT_PUBLIC_SERVER_URL
vercel env rm NEXT_PUBLIC_SERVER_URL production
echo "https://www.edashow.com.br" | vercel env add NEXT_PUBLIC_SERVER_URL production
```

### 2. Fazer Deploy

```bash
# Deploy para produção
vercel --prod
```

### 3. Ou Push para GitHub (Deploy Automático)

```bash
git add .
git commit -m "feat: conecta projeto ao Vercel correto (insightfy/edashow)"
git push origin main
```

O Vercel fará deploy automaticamente quando detectar o push.

## 🔍 Comandos Úteis

```bash
# Ver detalhes do projeto
vercel project

# Listar variáveis
vercel env ls

# Ver logs do último deploy
vercel logs

# Listar deploys
vercel ls

# Ver status do projeto
vercel inspect
```

## 🌐 URLs do Projeto

- **Dashboard**: https://vercel.com/insightfy/edashow
- **Production**: https://edashow.vercel.app
- **Custom Domain**: https://www.edashow.com.br
- **Admin**: https://www.edashow.com.br/admin
- **API**: https://www.edashow.com.br/api/posts

## ⚠️ Importante

### Configurar Domínio Customizado

Se ainda não configurou `www.edashow.com.br` no Vercel:

1. Acesse: https://vercel.com/insightfy/edashow/settings/domains
2. Adicione o domínio: `www.edashow.com.br`
3. Configure os DNS no seu provedor de domínio

## 📋 Status

- [x] Projeto conectado ao Vercel
- [x] Variáveis de ambiente configuradas
- [ ] Deploy para produção (executar `vercel --prod`)
- [ ] Verificar site funcionando
- [ ] Criar primeiro usuário admin

## 🎉 Conclusão

O projeto local está **corretamente conectado** ao projeto Vercel:
- Team: **insightfy**
- Projeto: **edashow**
- URL: https://vercel.com/insightfy/edashow

Pronto para fazer deploy! 🚀

