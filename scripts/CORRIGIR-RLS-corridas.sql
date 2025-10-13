-- =====================================================
-- CORRIGIR POLÍTICA RLS: corridas INSERT
-- =====================================================

-- 1. Deletar política problemática
DROP POLICY IF EXISTS "Todos podem criar corridas" ON corridas;

-- 2. Criar política corrigida
CREATE POLICY "Todos podem criar corridas"
ON corridas
FOR INSERT
WITH CHECK (true);

-- 3. Verificar se foi criada
SELECT 
  '✅ POLÍTICA CORRIGIDA' as status,
  policyname as nome,
  cmd as operacao,
  with_check as verificando
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'corridas'
  AND cmd = 'INSERT';


