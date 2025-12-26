#!/bin/bash

# Script rápido para configurar variáveis essenciais na Vercel
# Uso: ./scripts/quick-setup-vercel.sh

set -e

echo "🚀 Configuração Rápida - Variáveis de Ambiente na Vercel"
echo "=========================================================="
echo ""

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI não encontrado. Instale com: npm i -g vercel"
    exit 1
fi

# Verificar login
if ! vercel whoami &> /dev/null; then
    echo "❌ Faça login primeiro: vercel login"
    exit 1
fi

echo "✅ Vercel CLI OK"
echo ""

# DATABASE_URI
echo "📝 Configurando DATABASE_URI..."
echo "postgresql://postgres.exeuuqbgyfaxgbwygfuu:hRfmIWdaZtIyeJYh@aws-0-sa-east-1.pooler.supabase.com:6543/postgres" | vercel env add DATABASE_URI production 2>/dev/null || echo "⚠️  DATABASE_URI já existe ou erro ao configurar"
echo "✅ DATABASE_URI configurada"

# PAYLOAD_SECRET
echo "📝 Configurando PAYLOAD_SECRET..."
echo "fK+TGJAdOgcaLxYgOGhLqeXizTAcFiZwS7hriJbShsA=" | vercel env add PAYLOAD_SECRET production 2>/dev/null || echo "⚠️  PAYLOAD_SECRET já existe ou erro ao configurar"
echo "✅ PAYLOAD_SECRET configurado"

# NEXT_PUBLIC_SERVER_URL
echo "📝 Configurando NEXT_PUBLIC_SERVER_URL..."
SERVER_URL="https://www.edashow.com.br"
echo "$SERVER_URL" | vercel env add NEXT_PUBLIC_SERVER_URL production 2>/dev/null || echo "⚠️  NEXT_PUBLIC_SERVER_URL já existe ou erro ao configurar"
echo "✅ NEXT_PUBLIC_SERVER_URL configurado: $SERVER_URL"

echo ""
echo "=========================================================="
echo "✅ Configuração concluída!"
echo ""
echo "📋 Verificar variáveis: vercel env ls"
echo "🚀 Fazer deploy: vercel --prod"
echo ""

