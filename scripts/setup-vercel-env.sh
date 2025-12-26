#!/bin/bash

# Script para configurar variáveis de ambiente na Vercel
# Uso: ./scripts/setup-vercel-env.sh

set -e

echo "🚀 Configurando variáveis de ambiente na Vercel..."
echo ""

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não está instalado."
    echo "📦 Instale com: npm i -g vercel"
    exit 1
fi

# Verificar se está logado na Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Você não está logado na Vercel."
    echo "🔐 Faça login com: vercel login"
    exit 1
fi

echo "✅ Vercel CLI configurado"
echo ""

# DATABASE_URI
echo "📝 Configurando DATABASE_URI..."
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production
echo ""

# PAYLOAD_SECRET
echo "📝 Configurando PAYLOAD_SECRET..."
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production
echo ""

# NEXT_PUBLIC_SERVER_URL
echo "📝 Configurando NEXT_PUBLIC_SERVER_URL..."
SERVER_URL="https://www.edashow.com.br"
echo "$SERVER_URL" | vercel env add NEXT_PUBLIC_SERVER_URL production
echo "✅ NEXT_PUBLIC_SERVER_URL configurado: $SERVER_URL"
echo ""

# Perguntar sobre Supabase Storage
read -p "Deseja configurar Supabase Storage agora? (s/N): " CONFIGURE_STORAGE
if [[ "$CONFIGURE_STORAGE" =~ ^[Ss]$ ]]; then
    echo ""
    echo "📝 Configurando variáveis do Supabase Storage..."
    
    read -p "SUPABASE_ENDPOINT (ex: https://xxx.supabase.co/storage/v1/s3): " SUPABASE_ENDPOINT
    echo "$SUPABASE_ENDPOINT" | vercel env add SUPABASE_ENDPOINT production
    
    read -p "SUPABASE_REGION (padrão: us-east-1): " SUPABASE_REGION
    SUPABASE_REGION=${SUPABASE_REGION:-us-east-1}
    echo "$SUPABASE_REGION" | vercel env add SUPABASE_REGION production
    
    read -p "SUPABASE_BUCKET (padrão: media): " SUPABASE_BUCKET
    SUPABASE_BUCKET=${SUPABASE_BUCKET:-media}
    echo "$SUPABASE_BUCKET" | vercel env add SUPABASE_BUCKET production
    
    read -p "SUPABASE_ACCESS_KEY_ID: " SUPABASE_ACCESS_KEY_ID
    echo "$SUPABASE_ACCESS_KEY_ID" | vercel env add SUPABASE_ACCESS_KEY_ID production
    
    read -p "SUPABASE_SECRET_ACCESS_KEY: " SUPABASE_SECRET_ACCESS_KEY
    echo "$SUPABASE_SECRET_ACCESS_KEY" | vercel env add SUPABASE_SECRET_ACCESS_KEY production
    
    echo ""
fi

echo ""
echo "✅ Variáveis configuradas com sucesso!"
echo ""
echo "📋 Para verificar as variáveis configuradas:"
echo "   vercel env ls"
echo ""
echo "🚀 Para fazer deploy:"
echo "   vercel --prod"
echo ""
echo "💡 Ou faça push para o GitHub para deploy automático"
echo ""
