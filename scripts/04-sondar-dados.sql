-- ========================================
-- SONDAGEM 04: VERIFICAR DADOS EXISTENTES
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- IMPORTANTE: Só funciona se as tabelas já existirem
-- ========================================

-- 1. CONTAGEM DE REGISTROS (ajuste conforme tabelas existentes)
DO $$
DECLARE
    tabela TEXT;
    contador INTEGER;
BEGIN
    RAISE NOTICE '📊 CONTAGEM DE REGISTROS';
    
    FOR tabela IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', tabela) INTO contador;
        RAISE NOTICE '%: %', tabela, contador;
    END LOOP;
END $$;

-- 2. VERIFICAR USUÁRIOS DO SUPABASE AUTH
SELECT 
    '👥 USUÁRIOS CADASTRADOS (Auth)' AS secao,
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at IS NOT NULL AS email_confirmado
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. SE A TABELA empresas EXISTIR
-- SELECT 
--     id,
--     nome,
--     slug,
--     cidade,
--     ativo,
--     data_criacao
-- FROM empresas
-- ORDER BY data_criacao DESC;

-- 4. SE A TABELA empresa_associada EXISTIR
-- SELECT 
--     ea.id,
--     u.email as usuario_email,
--     e.nome as empresa_nome,
--     ea.funcao,
--     ea.status_vinculacao,
--     ea.data_vinculacao
-- FROM empresa_associada ea
-- LEFT JOIN auth.users u ON u.id = ea.uid_usuario
-- LEFT JOIN empresas e ON e.id = ea.empresa_id
-- ORDER BY ea.data_vinculacao DESC
-- LIMIT 10;

-- 5. SE A TABELA corridas EXISTIR
-- SELECT 
--     c.id,
--     c.tipo,
--     c.status,
--     e.nome as empresa,
--     c.distancia_km,
--     c.preco_total,
--     c.data_criacao
-- FROM corridas c
-- LEFT JOIN empresas e ON e.id = c.empresa_id
-- ORDER BY c.data_criacao DESC
-- LIMIT 10;

-- 6. STORAGE: Verificar buckets
SELECT 
    '📁 STORAGE BUCKETS' AS secao,
    id,
    name,
    public,
    created_at
FROM storage.buckets
ORDER BY name;




