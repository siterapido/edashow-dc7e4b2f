-- Script SQL para migrar dados do colunista "Eda" para admin@edashow.com.br
-- Uso: psql $DATABASE_URI -f scripts/migrate-eda-to-admin.sql
--
-- Este script:
-- 1. Busca o colunista "Eda" no banco
-- 2. Busca o usuário admin@edashow.com.br
-- 3. Atualiza todos os posts do colunista "Eda" para o colunista vinculado ao admin
-- 4. Copia a foto e dados do colunista "Eda" para o colunista do admin (se existir)

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

    RAISE NOTICE '🚀 Iniciando migração de dados do colunista Eda para admin...';
    RAISE NOTICE '';

    -- 1. Buscar colunista "Eda"
    SELECT id, name, photo_url, bio, slug
    INTO v_eda_columnist_id, v_eda_name, v_eda_photo_url, v_eda_bio, v_eda_slug
    FROM columnists
    WHERE LOWER(name) = 'eda' OR slug = 'eda'
    LIMIT 1;

    IF v_eda_columnist_id IS NULL THEN
        RAISE EXCEPTION '❌ Colunista "Eda" não encontrado no banco de dados';
    END IF;

    RAISE NOTICE '✅ Colunista Eda encontrado: % (%)', v_eda_name, v_eda_columnist_id;
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

    -- 3. Buscar colunista vinculado ao admin (se existir)
    SELECT id INTO v_admin_columnist_id
    FROM columnists
    WHERE profile_id = v_admin_user_id
    LIMIT 1;

    IF v_admin_columnist_id IS NULL THEN
        RAISE NOTICE 'ℹ️  Nenhum colunista encontrado para admin@edashow.com.br';
        RAISE NOTICE 'ℹ️  Criando novo colunista para admin...';

        -- Criar novo colunista para admin com dados do Eda
        v_admin_columnist_id := gen_random_uuid();

        INSERT INTO columnists (id, profile_id, name, slug, bio, photo_url, created_at, updated_at)
        VALUES (
            v_admin_columnist_id,
            v_admin_user_id,
            v_eda_name,
            'admin',  -- Slug simples para admin
            v_eda_bio,
            v_eda_photo_url,
            NOW(),
            NOW()
        );

        RAISE NOTICE '✅ Colunista criado para admin: %', v_admin_columnist_id;
    ELSE
        RAISE NOTICE 'ℹ️  Colunista do admin encontrado: %', v_admin_columnist_id;
        RAISE NOTICE 'ℹ️  Atualizando dados do colunista do admin...';

        -- Atualizar colunista do admin com dados do Eda
        UPDATE columnists
        SET name = v_eda_name,
            photo_url = v_eda_photo_url,
            bio = v_eda_bio,
            updated_at = NOW()
        WHERE id = v_admin_columnist_id;

        RAISE NOTICE '✅ Dados do colunista atualizados';
    END IF;

    RAISE NOTICE '';

    -- 4. Contar posts que serão migrados
    SELECT COUNT(*) INTO v_updated_count
    FROM posts
    WHERE columnist_id = v_eda_columnist_id;

    RAISE NOTICE '📝 Posts do colunista Eda: %', v_updated_count;
    RAISE NOTICE '📝 Atualizando posts para o colunista do admin...';

    -- 5. Atualizar todos os posts do colunista Eda para o colunista do admin
    UPDATE posts
    SET columnist_id = v_admin_columnist_id,
        updated_at = NOW()
    WHERE columnist_id = v_eda_columnist_id;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Migração concluída com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Colunista Eda: %', v_eda_columnist_id;
    RAISE NOTICE 'Colunista Admin: %', v_admin_columnist_id;
    RAISE NOTICE 'Posts migrados: %', v_updated_count;
    RAISE NOTICE 'Foto copiada: %', COALESCE(v_eda_photo_url, 'N/A');
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Próximos passos:';
    RAISE NOTICE '   1. O colunista "Eda" foi mantido no banco (intocionalmente)';
    RAISE NOTICE '   2. Todos os posts agora apontam para o colunista do admin';
    RAISE NOTICE '   3. A foto e nome do Eda foram copiados para o colunista do admin';
    RAISE NOTICE '   4. Para remover o colunista Eda, execute:';
    RAISE NOTICE '      DELETE FROM columnists WHERE id = ''%'';', v_eda_columnist_id;
    RAISE NOTICE '';

END $$;
