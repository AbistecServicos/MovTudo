-- ========================================
-- VERIFICAR ESTRUTURA REAL DA TABELA usuarios
-- ========================================
-- Execute este script para ver a estrutura atual
-- ========================================

-- 1. VER ESTRUTURA DA TABELA usuarios
SELECT 
    '📋 ESTRUTURA DA TABELA usuarios' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- 2. VER DADOS DA TABELA usuarios (primeiras linhas)
SELECT 
    '📄 DADOS DA TABELA usuarios' AS secao,
    *
FROM usuarios
LIMIT 5;

-- 3. VER USUÁRIOS NO AUTH (sem referenciar tabela usuarios)
SELECT 
    '👥 USUÁRIOS NO SUPABASE AUTH' AS secao,
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL AS email_confirmado,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. VER ESTRUTURA DA TABELA empresa_associada
SELECT 
    '🔗 ESTRUTURA DA TABELA empresa_associada' AS secao,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'empresa_associada'
ORDER BY ordinal_position;






