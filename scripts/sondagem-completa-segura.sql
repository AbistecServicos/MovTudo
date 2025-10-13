-- ========================================
-- SONDAGEM COMPLETA E SEGURA DO BANCO
-- ========================================
-- Execute cada bloco separadamente para evitar erros
-- ========================================

-- BLOCO 1: LISTAR TODAS AS TABELAS
SELECT 
    '📋 TODAS AS TABELAS' AS secao,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- BLOCO 2: ESTRUTURA DA TABELA usuarios (se existir)
SELECT 
    '👤 ESTRUTURA usuarios' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- BLOCO 3: ESTRUTURA DA TABELA empresas (se existir)
SELECT 
    '🏢 ESTRUTURA empresas' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'empresas'
ORDER BY ordinal_position;

-- BLOCO 4: ESTRUTURA DA TABELA empresa_associada
SELECT 
    '🔗 ESTRUTURA empresa_associada' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'empresa_associada'
ORDER BY ordinal_position;

-- BLOCO 5: ESTRUTURA DA TABELA corridas (se existir)
SELECT 
    '🚗 ESTRUTURA corridas' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'corridas'
ORDER BY ordinal_position;

-- BLOCO 6: USUÁRIOS NO SUPABASE AUTH
SELECT 
    '👥 USUÁRIOS AUTH' AS secao,
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL AS email_confirmado,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- BLOCO 7: DADOS DA TABELA usuarios (primeiras 3 linhas)
SELECT 
    '📄 DADOS usuarios' AS secao,
    *
FROM usuarios
LIMIT 3;

-- BLOCO 8: DADOS DA TABELA empresas (primeiras 3 linhas)
SELECT 
    '📄 DADOS empresas' AS secao,
    *
FROM empresas
LIMIT 3;

-- BLOCO 9: DADOS DA TABELA empresa_associada (primeiras 5 linhas)
SELECT 
    '📄 DADOS empresa_associada' AS secao,
    *
FROM empresa_associada
LIMIT 5;

-- BLOCO 10: CONTAR REGISTROS POR TABELA
SELECT 
    '📊 CONTAGEM REGISTROS' AS secao,
    'usuarios' AS tabela,
    COUNT(*) AS total
FROM usuarios
UNION ALL
SELECT 
    'empresas',
    COUNT(*)
FROM empresas
UNION ALL
SELECT 
    'empresa_associada',
    COUNT(*)
FROM empresa_associada
UNION ALL
SELECT 
    'corridas',
    COUNT(*)
FROM corridas
UNION ALL
SELECT 
    'precos',
    COUNT(*)
FROM precos
UNION ALL
SELECT 
    'notificacoes',
    COUNT(*)
FROM notificacoes
UNION ALL
SELECT 
    'telegram_config',
    COUNT(*)
FROM telegram_config
UNION ALL
SELECT 
    'telegram_transportadores',
    COUNT(*)
FROM telegram_transportadores
UNION ALL
SELECT 
    'telegram_notifications',
    COUNT(*)
FROM telegram_notifications
UNION ALL
SELECT 
    'telegram_templates',
    COUNT(*)
FROM telegram_templates
UNION ALL
SELECT 
    'user_tokens',
    COUNT(*)
FROM user_tokens;






