-- =====================================================
-- POLÍTICA RLS SIMPLIFICADA: corridas INSERT
-- =====================================================

-- 1. Deletar TODAS as políticas INSERT
DROP POLICY IF EXISTS "Todos podem criar corridas" ON corridas;

-- 2. Criar política MUITO simples
CREATE POLICY "Permitir INSERT corridas"
ON corridas
FOR INSERT
WITH CHECK (true);

-- 3. Verificar se foi criada
SELECT 
  '✅ POLÍTICA SIMPLIFICADA' as status,
  policyname as nome,
  cmd as operacao,
  with_check as verificando
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'corridas'
  AND cmd = 'INSERT';


