#!/bin/bash

# Script para configurar DATABASE_URI do Supabase na Vercel
# Uso: ./scripts/configurar-database-uri.sh

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Configurar DATABASE_URI - Supabase${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Informações do projeto Supabase
PROJECT_REF="exeuuqbgyfaxgbwygfuu"
HOST="aws-1-sa-east-1.pooler.supabase.com"
PORT="5432"
DATABASE="postgres"
USER="postgres.exeuuqbgyfaxgbwygfuu"

echo "📋 Informações do seu projeto Supabase:"
echo "   Projeto: $PROJECT_REF"
echo "   Host: $HOST"
echo ""
echo "Para obter a senha do banco de dados:"
echo ""
echo "1. Acesse: https://supabase.com/dashboard"
echo "2. Selecione seu projeto"
echo "3. Vá em: Settings → Database"
echo "4. Encontre: Database Password"
echo ""
echo "Se não lembra a senha:"
echo "   - Vá em Settings → Database"
echo "   - Clique em 'Reset Database Password'"
echo "   - ⚠️  COPIE A SENHA IMEDIATAMENTE (só aparece uma vez!)"
echo ""

# Verificar se a senha foi fornecida como argumento
if [ ! -z "$1" ]; then
    PASSWORD="$1"
    echo -e "${GREEN}✅ Senha fornecida como argumento${NC}"
else
    read -p "Cole a senha do banco de dados aqui: " -s PASSWORD
    echo ""
    
    if [ -z "$PASSWORD" ]; then
        echo -e "${RED}❌ Senha não fornecida${NC}"
        echo ""
        echo "Uso alternativo:"
        echo "  ./scripts/configurar-database-uri.sh [SENHA]"
        echo ""
        echo "Ou forneça via variável de ambiente:"
        echo "  SUPABASE_PASSWORD=[SENHA] ./scripts/configurar-database-uri.sh"
        exit 1
    fi
fi

# Verificar se a senha foi fornecida via variável de ambiente
if [ -z "$PASSWORD" ] && [ ! -z "$SUPABASE_PASSWORD" ]; then
    PASSWORD="$SUPABASE_PASSWORD"
    echo -e "${GREEN}✅ Senha obtida da variável de ambiente${NC}"
fi

if [ -z "$PASSWORD" ]; then
    echo -e "${RED}❌ Senha não fornecida${NC}"
    exit 1
fi

# Montar connection string
# Formato: postgresql://user:password@host:port/database
DATABASE_URI="postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}"

echo ""
echo "🔧 Configurando DATABASE_URI na Vercel..."
echo ""

# Remover variável existente se houver
if vercel env ls | grep -q "DATABASE_URI"; then
    echo "Removendo DATABASE_URI existente..."
    vercel env rm DATABASE_URI production --yes 2>/dev/null || true
fi

# Adicionar nova variável
echo "$DATABASE_URI" | vercel env add DATABASE_URI production

echo ""
echo -e "${GREEN}✅ DATABASE_URI configurada com sucesso!${NC}"
echo ""
echo "📋 Variáveis configuradas:"
vercel env ls | grep -E "NEXT_PUBLIC_SERVER_URL|PAYLOAD_SECRET|DATABASE_URI"
echo ""
echo -e "${GREEN}✅ Todas as variáveis obrigatórias estão configuradas!${NC}"
echo ""
echo "🚀 Próximo passo: Fazer redeploy"
echo "   Execute: vercel --prod"
echo ""

