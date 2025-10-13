-- ========================================
-- DIAGNÓSTICO COMPLETO DE RLS
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Copie TODO o resultado e envie no chat
-- ========================================

-- PARTE 1: POLÍTICAS DO STORAGE
-- ========================================
SELECT 
    '=== STORAGE OBJECTS ===' as secao,
    policyname as nome,
    cmd as operacao,
    roles::text as roles,
    qual as using_expr,
    with_check as check_expr
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY cmd, policyname;

-- PARTE 2: POLÍTICAS DA TABELA USUARIOS
-- ========================================
SELECT 
    '=== USUARIOS ===' as secao,
    policyname as nome,
    cmd as operacao,
    roles::text as roles,
    qual as using_expr,
    with_check as check_expr
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
ORDER BY cmd, policyname;

-- PARTE 3: VERIFICAR SE RLS ESTÁ HABILITADO
-- ========================================
SELECT 
    '=== RLS STATUS ===' as secao,
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables
WHERE schemaname IN ('public', 'storage')
  AND tablename IN ('usuarios', 'objects', 'buckets')
ORDER BY schemaname, tablename;

-- PARTE 4: VERIFICAR BUCKET
-- ========================================
SELECT 
    '=== BUCKET INFO ===' as secao,
    id,
    name,
    public as e_publico,
    file_size_limit
FROM storage.buckets
WHERE name = 'box';

-- PARTE 5: RESUMO
-- ========================================
SELECT 
    '=== RESUMO ===' as secao,
    'Storage: ' || COUNT(CASE WHEN schemaname = 'storage' THEN 1 END)::text || ' políticas' as info
FROM pg_policies
WHERE (schemaname = 'storage' AND tablename = 'objects')
   OR (schemaname = 'public' AND tablename = 'usuarios')
UNION ALL
SELECT 
    '=== RESUMO ===' as secao,
    'Usuarios: ' || COUNT(CASE WHEN schemaname = 'public' THEN 1 END)::text || ' políticas' as info
FROM pg_policies
WHERE (schemaname = 'storage' AND tablename = 'objects')
   OR (schemaname = 'public' AND tablename = 'usuarios');



