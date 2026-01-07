-- Script SQL para atualizar posts para colunista EDA
-- Uso: psql $DATABASE_URI -f scripts/create-eda-user-and-update-posts-v2.sql

DO $$
DECLARE
    v_columnist_id UUID;
    v_updated_count INTEGER;
BEGIN

    RAISE NOTICE '🚀 Iniciando atualização de posts...';
    RAISE NOTICE '';

    -- 1. Criar ou buscar colunista "Redação EDA Show"
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

    RAISE NOTICE '';

    -- 2. Atualizar todos os posts para o novo colunista
    RAISE NOTICE '📝 Atualizando todos os posts...';

    UPDATE posts
    SET columnist_id = v_columnist_id,
        updated_at = NOW()
    WHERE columnist_id IS DISTINCT FROM v_columnist_id;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Processo concluído!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Colunista: Redação EDA Show';
    RAISE NOTICE 'Colunista ID: %', v_columnist_id;
    RAISE NOTICE 'Posts atualizados: %', v_updated_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Para criar o usuário eda@edashow.com.br:';
    RAISE NOTICE '    Acesse o Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '    Crie um novo usuário com:';
    RAISE NOTICE '      - Email: eda@edashow.com.br';
    RAISE NOTICE '      - Senha: @Edashow2026#';
    RAISE NOTICE '      - Auto-confirm email: ON';
    RAISE NOTICE '';
    RAISE NOTICE '    Depois adicione o role de admin:';
    RAISE NOTICE '      INSERT INTO user_roles (user_id, role)';
    RAISE NOTICE '      SELECT id, ''admin'' FROM auth.users WHERE email = ''eda@edashow.com.br'';';

END $$;
