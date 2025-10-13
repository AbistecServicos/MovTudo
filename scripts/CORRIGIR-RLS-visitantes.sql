-- =====================================================
-- CORRIGIR POLÍTICA RLS: corridas INSERT para visitantes
-- =====================================================

-- 1. Deletar política atual
DROP POLICY IF EXISTS "Todos podem criar corridas" ON corridas;

-- 2. Criar política que permite visitantes E usuários logados
CREATE POLICY "Todos podem criar corridas"
ON corridas
FOR INSERT
WITH CHECK (
  -- Permite se usuário logado OU visitante (cliente_uid pode ser NULL)
  auth.uid() IS NOT NULL OR cliente_uid IS NULL
);

-- 3. Verificar se foi criada corretamente
SELECT 
  '✅ POLÍTICA CORRIGIDA' as status,
  policyname as nome,
  cmd as operacao,
  with_check as verificando
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'corridas'
  AND cmd = 'INSERT';


