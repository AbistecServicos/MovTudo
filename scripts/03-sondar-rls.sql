-- ========================================
-- SONDAGEM 03: VERIFICAR ROW LEVEL SECURITY (RLS)
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- ========================================

-- 1. VERIFICAR SE RLS ESTÁ HABILITADO EM CADA TABELA
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

-- 2. LISTAR TODAS AS POLÍTICAS RLS EXISTENTES
SELECT 
    '📋 POLÍTICAS RLS' AS secao,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. TABELAS SEM RLS (ALERTA DE SEGURANÇA)
SELECT 
    '⚠️ ATENÇÃO: TABELAS SEM RLS HABILITADO' AS alerta,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
ORDER BY tablename;

-- 4. DETALHES DAS POLÍTICAS (com cláusulas USING e WITH CHECK)
SELECT 
    tablename,
    policyname,
    cmd AS operation,
    qual AS using_clause,
    with_check AS with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;




