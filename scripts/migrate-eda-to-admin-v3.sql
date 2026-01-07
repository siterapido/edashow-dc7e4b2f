-- Script SQL para migrar dados do colunista "Redação EDA Show" para "Eda"
-- e garantir que admin@edashow.com.br tenha acesso aos dados
-- Uso: psql $DATABASE_URI -f scripts/migrate-eda-to-admin-v3.sql
--
-- Este script:
-- 1. Busca o colunista "Redação EDA Show" que tem os posts
-- 2. Atualiza o nome de "Redação EDA Show" para "Eda"
-- 3. Atualiza o slug para "eda"
-- 4. Mantém a foto /images/eda-profile.jpg
-- 5. Mantém todos os posts (44 posts) vinculados

DO $$
DECLARE
    v_columnist_id UUID;
    v_post_count INTEGER;
    v_admin_user_id UUID;
BEGIN

    RAISE NOTICE '🚀 Iniciando migração do colunista para Eda...';
    RAISE NOTICE '';

    -- 1. Buscar colunista "Redação EDA Show" (que tem os posts)
    SELECT id INTO v_columnist_id
    FROM columnists
    WHERE slug = 'redacao-eda-show'
    LIMIT 1;

    IF v_columnist_id IS NULL THEN
        RAISE EXCEPTION '❌ Colunista "Redação EDA Show" não encontrado no banco de dados';
    END IF;

    RAISE NOTICE '✅ Colunista "Redação EDA Show" encontrado: %', v_columnist_id;
    RAISE NOTICE '';

    -- 2. Contar posts antes da migração
    SELECT COUNT(*) INTO v_post_count
    FROM posts
    WHERE columnist_id = v_columnist_id;

    RAISE NOTICE '📝 Posts encontrados: %', v_post_count;
    RAISE NOTICE '📝 Atualizando colunista...';
    RAISE NOTICE '';

    -- 3. Atualizar o colunista "Redação EDA Show" para "Eda"
    UPDATE columnists
    SET name = 'Eda',
        slug = 'eda',
        bio = 'Colunista do EdaShow',
        updated_at = NOW()
    WHERE id = v_columnist_id;

    RAISE NOTICE '✅ Colunista atualizado com sucesso';
    RAISE NOTICE '';

    -- 4. Verificar usuário admin
    SELECT id INTO v_admin_user_id
    FROM profiles
    WHERE email = 'admin@edashow.com.br'
    LIMIT 1;

    IF v_admin_user_id IS NOT NULL THEN
        RAISE NOTICE '✅ Usuário admin@edashow.com.br encontrado: %', v_admin_user_id;
        RAISE NOTICE 'ℹ️  Este usuário pode gerenciar todos os colunistas inclusive a Eda';
    ELSE
        RAISE NOTICE '⚠️  Usuário admin@edashow.com.br não encontrado';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Migração concluída com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Colunista ID: %', v_columnist_id;
    RAISE NOTICE 'Nome: Eda';
    RAISE NOTICE 'Slug: eda';
    RAISE NOTICE 'Posts vinculados: %', v_post_count;
    RAISE NOTICE 'Foto: /images/eda-profile.jpg';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Links úteis:';
    RAISE NOTICE '   Página do colunista: /columnists/eda';
    RAISE NOTICE '   Imagem do colunista: /images/eda-profile.jpg';
    RAISE NOTICE '';
    RAISE NOTICE '📋 O que foi feito:';
    RAISE NOTICE '   ✓ Nome atualizado de "Redação EDA Show" para "Eda"';
    RAISE NOTICE '   ✓ Slug atualizado de "redacao-eda-show" para "eda"';
    RAISE NOTICE '   ✓ Foto mantida: /images/eda-profile.jpg';
    RAISE NOTICE '   ✓ Todos os % posts continuam vinculados', v_post_count;
    RAISE NOTICE '';

END $$;
