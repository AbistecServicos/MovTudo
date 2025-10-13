-- ========================================
-- CORRIGIR POLÍTICAS RLS PARA ADMINISTRADORES
-- ========================================
-- Este script corrige as políticas RLS para permitir que
-- usuários com is_admin = true na tabela usuarios possam
-- acessar todas as tabelas do sistema.
-- ========================================

-- 1. REMOVER POLÍTICAS ANTIGAS (se existirem)
DROP POLICY IF EXISTS "Admins podem gerenciar empresas" ON empresas;
DROP POLICY IF EXISTS "Todos podem ver empresas ativas" ON empresas;

-- 2. CRIAR FUNÇÃO AUXILIAR PARA VERIFICAR SE USUÁRIO É ADMIN
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM usuarios
    WHERE uid = auth.uid()
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CRIAR POLÍTICAS PARA EMPRESAS

-- Admin pode fazer tudo
CREATE POLICY "Admins podem gerenciar todas as empresas" 
ON empresas
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Usuários vinculados podem ver suas empresas
CREATE POLICY "Usuários veem empresas vinculadas" 
ON empresas
FOR SELECT
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
    AND status_vinculacao = 'ativo'
  )
);

-- Todos podem ver empresas ativas (para landing page pública)
CREATE POLICY "Todos podem ver empresas ativas publicamente" 
ON empresas
FOR SELECT
USING (ativa = true);

-- 4. CRIAR POLÍTICAS PARA USUÁRIOS

-- Admin pode ver todos os usuários
CREATE POLICY "Admins podem ver todos os usuários" 
ON usuarios
FOR SELECT
USING (is_admin());

-- Admin pode atualizar usuários
CREATE POLICY "Admins podem atualizar usuários" 
ON usuarios
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Admin pode deletar usuários
CREATE POLICY "Admins podem deletar usuários" 
ON usuarios
FOR DELETE
USING (is_admin());

-- Usuário pode ver a si mesmo
CREATE POLICY "Usuário pode ver seus próprios dados" 
ON usuarios
FOR SELECT
USING (uid = auth.uid());

-- Usuário pode atualizar seus próprios dados
CREATE POLICY "Usuário pode atualizar seus próprios dados" 
ON usuarios
FOR UPDATE
USING (uid = auth.uid())
WITH CHECK (uid = auth.uid());

-- 5. CRIAR POLÍTICAS PARA CORRIDAS

-- Admin pode ver todas as corridas
CREATE POLICY "Admins podem ver todas as corridas" 
ON corridas
FOR SELECT
USING (is_admin());

-- Admin pode gerenciar corridas
CREATE POLICY "Admins podem gerenciar corridas" 
ON corridas
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Gerentes veem corridas da sua empresa
CREATE POLICY "Gerentes veem corridas da empresa" 
ON corridas
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

-- Transportadores veem suas corridas
CREATE POLICY "Transportadores veem suas corridas" 
ON corridas
FOR SELECT
USING (
  aceito_por_uid = auth.uid()
  OR id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
    AND funcao = 'transportador'
    AND status_vinculacao = 'ativo'
  )
);

-- 6. CRIAR POLÍTICAS PARA EMPRESA_ASSOCIADA

-- Admin pode ver todos os vínculos
CREATE POLICY "Admins podem ver todos os vínculos" 
ON empresa_associada
FOR SELECT
USING (is_admin());

-- Admin pode gerenciar vínculos
CREATE POLICY "Admins podem gerenciar vínculos" 
ON empresa_associada
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Gerentes veem vínculos da sua empresa
CREATE POLICY "Gerentes veem vínculos da empresa" 
ON empresa_associada
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

-- Usuário pode ver seu próprio vínculo
CREATE POLICY "Usuário vê seu próprio vínculo" 
ON empresa_associada
FOR SELECT
USING (uid_usuario = auth.uid());

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Verificar políticas criadas
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('empresas', 'usuarios', 'corridas', 'empresa_associada')
ORDER BY tablename, policyname;

-- Testar função is_admin
SELECT is_admin() AS sou_admin;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================

/*
ATENÇÃO:
- Execute este script no SQL Editor do Supabase Dashboard
- Você precisa estar logado como usuário com permissões de administrador
- Após executar, faça logout e login novamente no sistema
- Teste se o admin consegue ver as empresas em /admin/empresas

COMO USAR:
1. Acesse seu projeto no Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole este script completo
4. Clique em "Run"
5. Verifique se não houve erros
6. Faça logout e login novamente no MovTudo
7. Teste acessar /admin/empresas

TROUBLESHOOTING:
- Se ainda não funcionar, verifique se RLS está habilitado:
  SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
  
- Se RLS estiver desabilitado, habilite:
  ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
  ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE empresa_associada ENABLE ROW LEVEL SECURITY;
*/



