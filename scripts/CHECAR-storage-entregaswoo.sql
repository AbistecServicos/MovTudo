-- =====================================================
-- VERIFICAR POLÍTICAS DE STORAGE DO ENTREGASWOO
-- Execute este script no Supabase do EntregasWoo
-- =====================================================

-- Ver todas as políticas de storage.objects
SELECT 
  '🔍 ENTREGASWOO STORAGE' as projeto,
  policyname as nome_politica,
  cmd as operacao,
  CASE 
    WHEN qual IS NOT NULL THEN 'SIM'
    ELSE 'NÃO'
  END as tem_using,
  CASE 
    WHEN with_check IS NOT NULL THEN 'SIM'
    ELSE 'NÃO'
  END as tem_check,
  qual::text as expressao_using,
  with_check::text as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND (policyname LIKE '%foto%' OR policyname LIKE '%logo%')
ORDER BY cmd, policyname;


