-- Ver políticas de logo após aplicar a correção
SELECT 
  '✅ POLÍTICAS DE LOGO (COM FUNÇÃO)' as status,
  policyname as nome,
  cmd as operacao,
  CASE 
    WHEN qual IS NOT NULL THEN '✅ TEM USING'
    ELSE '❌ SEM USING'
  END as tem_using,
  CASE 
    WHEN with_check IS NOT NULL THEN '✅ TEM CHECK'
    ELSE '❌ SEM CHECK'
  END as tem_check,
  CASE
    WHEN qual::text LIKE '%is_user_admin%' OR with_check::text LIKE '%is_user_admin%' THEN '✅ USA FUNÇÃO'
    ELSE '⚠️ NÃO USA FUNÇÃO'
  END as usa_funcao
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%logo%'
ORDER BY cmd;


