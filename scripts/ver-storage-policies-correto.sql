-- ========================================
-- VER POLÍTICAS DO STORAGE (VERSÃO CORRETA)
-- ========================================

-- Ver TODAS as políticas de foto_perfil
SELECT 
    policyname as nome,
    cmd as operacao,
    roles::text as roles,
    qual as expressao_using,
    with_check as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname ILIKE '%foto%perfil%'
ORDER BY cmd;



