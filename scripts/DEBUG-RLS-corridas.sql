-- Verificar políticas RLS da tabela corridas
SELECT 
  policyname as nome,
  cmd as operacao,
  qual as usando,
  with_check as verificando
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'corridas'
ORDER BY cmd, policyname;

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'corridas';


