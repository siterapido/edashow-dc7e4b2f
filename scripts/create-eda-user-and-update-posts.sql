-- Script SQL para criar usuário EDA e atualizar posts
-- Uso: psql $DATABASE_URI -f scripts/create-eda-user-and-update-posts.sql

DO $$
DECLARE
    v_user_id UUID;
    v_columnist_id UUID;
    v_updated_count INTEGER;
BEGIN

    -- 1. Criar ou buscar usuário de autenticação
    -- Verificar se já existe um profile com este email
    SELECT id INTO v_user_id
    FROM profiles
    WHERE email = 'eda@edashow.com.br'
    LIMIT 1;

    IF v_user_id IS NULL THEN
        -- Criar novo profile
        v_user_id := gen_random_uuid();

        INSERT INTO profiles (id, email, name, created_at, updated_at)
        VALUES (
            v_user_id,
            'eda@edashow.com.br',
            'EDA Show',
            NOW(),
            NOW()
        );

        RAISE NOTICE '✅ Profile criado: %', v_user_id;

        -- NOTA: O auth.user precisa ser criado manualmente via Supabase Dashboard
        -- com a senha: @Edashow2026#
        RAISE NOTICE '⚠️  Crie o auth.user no Supabase Dashboard com ID: %', v_user_id;
        RAISE NOTICE '⚠️  Email: eda@edashow.com.br';
        RAISE NOTICE '⚠️  Senha: @Edashow2026#';
    ELSE
        RAISE NOTICE 'ℹ️  Usuário já existe: %', v_user_id;
    END IF;

    -- 2. Criar ou atualizar role de admin
    INSERT INTO user_roles (user_id, role, created_at, updated_at)
    VALUES (v_user_id, 'admin', NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET role = 'admin', updated_at = NOW();

    RAISE NOTICE '✅ Role de admin atribuída';

    -- 3. Criar ou buscar colunista "Redação EDA Show"
    SELECT id INTO v_columnist_id
    FROM columnists
    WHERE slug = 'redacao-eda-show'
    LIMIT 1;

    IF v_columnist_id IS NULL THEN
        -- Criar novo colunista
        v_columnist_id := gen_random_uuid();

        INSERT INTO columnists (id, name, slug, bio, photo_url, created_at, updated_at)
        VALUES (
            v_columnist_id,
            'Redação EDA Show',
            'redacao-eda-show',
            'Redação oficial do portal EDA Show',
            '/eda-show-logo.png',
            NOW(),
            NOW()
        );

        RAISE NOTICE '✅ Colunista criado: %', v_columnist_id;
    ELSE
        RAISE NOTICE 'ℹ️  Colunista já existe: %', v_columnist_id;
    END IF;

    -- 4. Atualizar todos os posts para o novo colunista
    UPDATE posts
    SET columnist_id = v_columnist_id,
        updated_at = NOW()
    WHERE columnist_id IS DISTINCT FROM v_columnist_id;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    RAISE NOTICE '✅ Posts atualizados: %', v_updated_count;

    -- 5. Mostrar resumo
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Processo concluído!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Usuário: eda@edashow.com.br';
    RAISE NOTICE 'Profile ID: %', v_user_id;
    RAISE NOTICE 'Colunista: Redação EDA Show';
    RAISE NOTICE 'Colunista ID: %', v_columnist_id;
    RAISE NOTICE 'Posts atualizados: %', v_updated_count;
    RAISE NOTICE '========================================';

END $$;
