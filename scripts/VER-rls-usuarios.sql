-- Ver políticas de SELECT na tabela usuarios
SELECT 
  '🔍 POLÍTICAS USUARIOS (SELECT)' as info,
  policyname as nome,
  cmd as operacao,
  qual::text as expressao_using
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
  AND cmd = 'SELECT'
ORDER BY policyname;


