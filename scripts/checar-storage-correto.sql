-- ========================================
-- VERIFICAR POLÍTICAS DO STORAGE (VERSÃO CORRETA)
-- ========================================
-- Execute no SQL Editor do Supabase
-- ========================================

-- 1. LISTAR TODAS AS POLÍTICAS DO STORAGE.OBJECTS
SELECT 
    schemaname,
    tablename,
    policyname as nome_politica,
    permissive,
    roles,
    cmd as comando,
    qual as expressao_using,
    with_check as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
ORDER BY cmd, policyname;

-- 2. CONTAR POLÍTICAS POR COMANDO
SELECT 
    cmd as comando,
    COUNT(*) as total,
    ARRAY_AGG(policyname) as nomes
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
GROUP BY cmd
ORDER BY cmd;

-- 3. VERIFICAR BUCKET
SELECT 
    id,
    name,
    public as e_publico,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets
WHERE name = 'box';



