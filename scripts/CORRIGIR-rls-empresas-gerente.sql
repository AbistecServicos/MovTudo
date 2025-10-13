-- =====================================================
-- CORRIGIR RLS: Permitir gerente ver SUA empresa
-- =====================================================

-- Ver políticas atuais
SELECT 
  '🔍 POLÍTICAS EMPRESAS' as info,
  policyname as nome,
  cmd as operacao,
  qual::text as expressao_using
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'empresas'
ORDER BY cmd, policyname;

-- Criar política para GERENTE ver SUA empresa
CREATE POLICY "Gerentes podem ver sua propria empresa"
ON empresas
FOR SELECT
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'gerente'
      AND status_vinculacao = 'ativo'
  )
);

-- Criar política para TRANSPORTADOR ver SUAS empresas
CREATE POLICY "Transportadores podem ver suas empresas"
ON empresas
FOR SELECT
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'transportador'
      AND status_vinculacao = 'ativo'
  )
);

-- Criar política para TODOS verem empresas ativas (clientes visitantes)
CREATE POLICY "Todos podem ver empresas ativas"
ON empresas
FOR SELECT
USING (ativa = true);

-- Verificar políticas criadas
SELECT 
  '✅ POLÍTICAS CRIADAS' as status,
  policyname as nome,
  cmd as operacao
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'empresas'
  AND cmd = 'SELECT'
ORDER BY policyname;


