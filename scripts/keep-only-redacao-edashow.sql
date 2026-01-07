-- Script SQL para manter apenas o colunista "Redação EdaShow"
-- Uso: psql $DATABASE_URI -f scripts/keep-only-redacao-edashow.sql
--
-- Este script:
-- 1. Recria o colunista "Redação EdaShow"
-- 2. Migra todos os posts dos outros colunistas para ele
-- 3. Exclui todos os outros colunistas

DO $$
DECLARE
    v_redacao_id UUID;
    v_deleted_count INTEGER;
    v_migrated_count INTEGER;
    columnist_record RECORD;
BEGIN

    RAISE NOTICE '🚀 Iniciando processo de manter apenas Redação EdaShow...';
    RAISE NOTICE '';

    -- 1. Verificar se "Redação EdaShow" já existe
    SELECT id INTO v_redacao_id
    FROM columnists
    WHERE slug = 'redacao-edashow'
    LIMIT 1;

    IF v_redacao_id IS NULL THEN
        RAISE NOTICE 'ℹ️  Colunista "Redação EdaShow" não encontrado. Criando...';

        -- Criar o colunista "Redação EdaShow"
        v_redacao_id := gen_random_uuid();

        INSERT INTO columnists (id, name, slug, bio, photo_url, created_at, updated_at)
        VALUES (
            v_redacao_id,
            'Redação EdaShow',
            'redacao-edashow',
            'Redação oficial do portal EdaShow',
            '/images/eda-profile.jpg',
            NOW(),
            NOW()
        );

        RAISE NOTICE '✅ Colunista "Redação EdaShow" criado: %', v_redacao_id;
    ELSE
        RAISE NOTICE '✅ Colunista "Redação EdaShow" encontrado: %', v_redacao_id;
    END IF;

    RAISE NOTICE '';

    -- 2. Contar e migrar posts de todos os outros colunistas
    RAISE NOTICE '📝 Migrando posts de outros colunistas para Redação EdaShow...';

    v_migrated_count := 0;

    FOR columnist_record IN
        SELECT id, name
        FROM columnists
        WHERE id != v_redacao_id
    LOOP
        RAISE NOTICE '   Processando colunista: % (%)', columnist_record.name, columnist_record.id;

        UPDATE posts
        SET columnist_id = v_redacao_id,
            updated_at = NOW()
        WHERE columnist_id = columnist_record.id;

        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
        v_migrated_count := v_migrated_count + v_deleted_count;

        IF v_deleted_count > 0 THEN
            RAISE NOTICE '      → % posts migrados', v_deleted_count;
        END IF;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '✅ Total de posts migrados: %', v_migrated_count;
    RAISE NOTICE '';

    -- 3. Excluir todos os outros colunistas
    RAISE NOTICE '🗑️  Excluindo outros colunistas...';

    DELETE FROM columnists
    WHERE id != v_redacao_id;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

    RAISE NOTICE '✅ Colunistas excluídos: %', v_deleted_count;
    RAISE NOTICE '';

    -- 4. Resumo final
    RAISE NOTICE '========================================';
    RAISE NOTICE '✨ Processo concluído!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Colunista restante: Redação EdaShow';
    RAISE NOTICE 'Colunista ID: %', v_redacao_id;
    RAISE NOTICE 'Posts migrados: %', v_migrated_count;
    RAISE NOTICE 'Colunistas excluídos: %', v_deleted_count;
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔗 Links úteis:';
    RAISE NOTICE '   Página do colunista: /columnists/redacao-edashow';
    RAISE NOTICE '   Foto: /images/eda-profile.jpg';
    RAISE NOTICE '';

END $$;
