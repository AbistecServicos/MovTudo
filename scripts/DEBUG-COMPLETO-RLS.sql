-- Verificar TODAS as políticas RLS da tabela corridas
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

-- Verificar se a função is_admin() existe
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'is_admin';


