-- ========================================
-- CORRIGIR POLÍTICA DE UPDATE - EXECUTAR ESTE!
-- ========================================
-- Este script remove a política antiga e cria a nova
-- ========================================

-- PASSO 1: REMOVER A POLÍTICA ANTIGA
DROP POLICY IF EXISTS "Usuarios podem atualizar proprio perfil" ON usuarios;

-- PASSO 2: CRIAR A POLÍTICA CORRETA COM USING E WITH CHECK
CREATE POLICY "Usuarios podem atualizar proprio perfil"
ON usuarios
FOR UPDATE
USING (uid = auth.uid())
WITH CHECK (uid = auth.uid());

-- PASSO 3: VERIFICAR SE FOI CRIADA CORRETAMENTE
SELECT 
    '✅ POLÍTICA CORRIGIDA' as status,
    policyname as nome,
    cmd as operacao,
    qual as using_expressao,
    with_check as check_expressao
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
  AND policyname = 'Usuarios podem atualizar proprio perfil';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- status: ✅ POLÍTICA CORRIGIDA
-- nome: Usuarios podem atualizar proprio perfil
-- operacao: UPDATE
-- using_expressao: (uid = auth.uid())
-- check_expressao: (uid = auth.uid())  ← Agora TEM!
-- ========================================



