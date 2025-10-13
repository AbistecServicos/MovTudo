-- ========================================
-- CORRIGIR POLÍTICA DE UPDATE DA TABELA USUARIOS
-- ========================================
-- O problema: política tem USING mas não tem WITH CHECK
-- A solução: recriar a política com ambos
-- ========================================

-- 1. REMOVER POLÍTICA ANTIGA
DROP POLICY IF EXISTS "Usuarios podem atualizar proprio perfil" ON usuarios;

-- 2. CRIAR POLÍTICA CORRETA COM USING E WITH CHECK
CREATE POLICY "Usuarios podem atualizar proprio perfil"
ON usuarios
FOR UPDATE
USING (uid = auth.uid())
WITH CHECK (uid = auth.uid());

-- 3. VERIFICAR SE FOI CRIADA CORRETAMENTE
SELECT 
    policyname,
    cmd,
    qual as using_expr,
    with_check as check_expr
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
  AND cmd = 'UPDATE'
ORDER BY policyname;

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Você deve ver:
-- policyname: "Usuarios podem atualizar proprio perfil"
-- cmd: UPDATE
-- using_expr: (uid = auth.uid())
-- check_expr: (uid = auth.uid())  ← Agora TEM valor!
-- ========================================



