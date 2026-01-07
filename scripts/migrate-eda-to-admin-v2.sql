-- Script SQL para migrar dados do colunista "Redação EDA Show" para admin@edashow.com.br
-- Uso: psql $DATABASE_URI -f scripts/migrate-eda-to-admin-v2.sql
--
-- Este script:
-- 1. Busca o colunista "Redação EDA Show" que tem os posts
-- 2. Busca o usuário admin@edashow.com.br
-- 3. Cria ou atualiza um colunista para o admin com os dados do "Redação EDA Show"
-- 4. Transfere todos os posts (44 posts) para o colunista do admin

DO $$
DECLARE
    v_eda_columnist_id UUID;
    v_admin_user_id UUID;
    v_admin_columnist_id UUID;
    v_updated_count INTEGER;
    v_eda_name TEXT;
    v_eda_photo_url TEXT;
    v_eda_bio TEXT;
    v_eda_slug TEXT;
BEGIN

    RAISE NOTICE '🚀 Iniciando migração de dados para admin@edashow.com.br...';
    RAISE NOTICE '';

    -- 1. Buscar colunista "Redação EDA Show" (que tem os posts)
    SELECT id, name, photo_url, bio, slug
    INTO v_eda_columnist_id, v_eda_name, v_eda_photo_url, v_eda_bio, v_eda_slug
    FROM columnists
    WHERE slug = 'redacao-eda-show'
    LIMIT 1;

    IF v_eda_columnist_id IS NULL THEN
        RAISE EXCEPTION '❌ Colunista "Redação EDA Show" não encontrado no banco de dados';
    END IF;

    RAISE NOTICE '✅ Colunista "Redação EDA Show" encontrado: % (%)', v_eda_name, v_eda_columnist_id;
    RAISE NOTICE '   Foto: %', COALESCE(v_eda_photo_url, 'N/A');
    RAISE NOTICE '   Slug: %', v_eda_slug;
    RAISE NOTICE '';

    -- 2. Buscar usuário admin@edashow.com.br
    SELECT id INTO v_admin_user_id
    FROM profiles
    WHERE email = 'admin@edashow.com.br'
    LIMIT 1;

    IF v_admin_user_id IS NULL THEN
        RAISE EXCEPTION '❌ Usuário admin@edashow.com.br não encontrado na tabela profiles';
    END IF;

    RAISE NOTICE '✅ Usuário admin encontrado: %', v_admin_user_id;
    RAISE NOTICE '';

    -- 3. Verificar se já existe colunista vinculado ao admin
    SELECT id INTO v_admin_columnist_id
    FROM columnists
    WHERE profile_id = v_admin_user_id
    LIMIT 1;

    IF v_admin_columnist_id IS NOT NULL THEN
        RAISE NOTICE 'ℹ️  Já existe um colunista para o admin: %', v_admin_columnist_id;
        RAISE NOTICE 'ℹ️  Atualizando dados do colunista existente...';

        -- Atualizar colunista do admin com dados do "Redação EDA Show"
        UPDATE columnists
        SET name = 'Eda',
            slug = 'eda',
            photo_url = v_eda_photo_url,
            bio = COALESCE(v_eda_bio, 'Colunista do EdaShow'),
            profile_id = v_admin_user_id,
            updated_at = NOW()
        WHERE id = v_admin_columnist_id;

        RAISE NOTICE '✅ Colunista do admin atualizado com sucesso';
    ELSE
        RAISE NOTICE 'ℹ️  Nenhum colunista encontrado para admin@edashow.com.br';
        RAISE NOTICE 'ℹ️  Criando novo colunista para admin...';

        -- Criar novo colunista para admin com dados do "Redação EDA Show"
        v_admin_columnist_id := gen_random_uuid();

        INSERT INTO columnists (id, profile_id, name, slug, bio, photo_url, created_at, updated_at)
        VALUES (
            v_admin_columnist_id,
            v_admin_user_id,
            'Eda',
            'eda',
            COALESCE(v_eda_bio, 'Colunista do EdaShow'),
            v_eda_photo_url,
            NOW(),
            NOW()
        );

        RAISE NOTICE '✅ Novo colunista criado para admin: %', v_admin_columnist_id;
    END IF;

    RAISE NOTICE '';

    -- 4. Contar posts que serão migrados
    SELECT COUNT(*) INTO v_updated_count
    FROM posts
    WHERE columnist_id = v_eda_columnist_id;

    RAISE NOTICE '📝 Posts do colunista "Redação EDA Show": %', v_updated_count;
    RAISE NOTICE '📝 Migrando posts para o colunista do admin...';

    -- 5. Atualizar todos os posts do "Redação EDA Show" para o colunista do admin
    UPDATE posts
    SET columnist_id = v_admin_columnist_id,
        updated_at = NOW()
    WHERE columnist_id = v_eda_columnist_id;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Migração concluída com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Colunista "Redação EDA Show": %', v_eda_columnist_id;
    RAISE NOTICE 'Colunista Admin (Eda): %', v_admin_columnist_id;
    RAISE NOTICE 'Posts migrados: %', v_updated_count;
    RAISE NOTICE 'Nome do colunista: Eda';
    RAISE NOTICE 'Foto: %', COALESCE(v_eda_photo_url, 'N/A');
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Resumo:';
    RAISE NOTICE '   ✓ O colunista "Redação EDA Show" foi mantido no banco';
    RAISE NOTICE '   ✓ Todos os % posts agora apontam para o colunista do admin', v_updated_count;
    RAISE NOTICE '   ✓ A foto % foi copiada para o colunista do admin', COALESCE(v_eda_photo_url, 'N/A');
    RAISE NOTICE '   ✓ O nome do colunista foi definido como "Eda"';
    RAISE NOTICE '   ✓ O slug do colunista foi definido como "eda"';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Para acessar a página do colunista:';
    RAISE NOTICE '   https://seusite.com/columnists/eda';
    RAISE NOTICE '';

END $$;
