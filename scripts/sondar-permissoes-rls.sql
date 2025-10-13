-- ========================================
-- SONDAR PERMISSÕES E POLÍTICAS RLS
-- ========================================
-- Execute cada bloco separadamente
-- ========================================

-- BLOCO 1: VERIFICAR SE RLS ESTÁ HABILITADO
SELECT 
    '🔒 STATUS DO RLS' AS secao,
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ HABILITADO' 
        ELSE '⚠️ DESABILITADO' 
    END AS rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- BLOCO 2: LISTAR TODAS AS POLÍTICAS RLS
SELECT 
    '📋 POLÍTICAS RLS EXISTENTES' AS secao,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation,
    qual AS using_clause
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- BLOCO 3: VERIFICAR USUÁRIO NO SUPABASE AUTH
SELECT 
    '👥 USUÁRIO ADMIN NO AUTH' AS secao,
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL AS email_confirmado,
    last_sign_in_at,
    raw_user_meta_data,
    raw_app_meta_data
FROM auth.users
WHERE email = 'almirdss@gmail.com';

-- BLOCO 4: VERIFICAR USUÁRIO NA TABELA usuarios
SELECT 
    '📄 USUÁRIO ADMIN NA TABELA usuarios' AS secao,
    *
FROM usuarios
WHERE email = 'almirdss@gmail.com';

-- BLOCO 5: TESTAR ACESSO ÀS TABELAS (como admin)
-- Este bloco vai mostrar se o usuário admin consegue acessar as tabelas
SELECT 
    '🔍 TESTE DE ACESSO COMO ADMIN' AS secao,
    'usuarios' AS tabela,
    COUNT(*) AS registros_visiveis
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
FROM corridas;

-- BLOCO 6: VERIFICAR ÍNDICES DE PERFORMANCE
SELECT 
    '📑 ÍNDICES EXISTENTES' AS secao,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;






