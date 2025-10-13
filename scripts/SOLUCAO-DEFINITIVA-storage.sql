-- =====================================================
-- SOLUÇÃO DEFINITIVA: Corrigir RLS do Storage foto_perfil
-- Problema: auth.role() não funciona corretamente no Storage
-- Solução: Usar auth.uid() IS NOT NULL
-- =====================================================

-- PASSO 1: REMOVER TODAS AS POLÍTICAS ANTIGAS DE foto_perfil
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de foto de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias fotos de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias fotos de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Upload de foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Atualizar foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Deletar foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Todos podem ver fotos de perfil" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICAS CORRETAS COM auth.uid() IS NOT NULL
-- -------------------------------------------------------------

-- 1️⃣ SELECT: Todos podem VER fotos de perfil (bucket público)
CREATE POLICY "Todos podem ver fotos de perfil"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- 2️⃣ INSERT: Usuários autenticados podem FAZER UPLOAD
-- IMPORTANTE: INSERT só usa WITH CHECK, NÃO usa USING!
CREATE POLICY "Upload de foto de perfil permitido"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.uid() IS NOT NULL  -- ✅ CORRETO! Não usar auth.role()
);

-- 3️⃣ UPDATE: Usuários autenticados podem ATUALIZAR
-- UPDATE precisa de USING e WITH CHECK
CREATE POLICY "Atualizar foto de perfil permitido"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.uid() IS NOT NULL  -- ✅ CORRETO!
)
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.uid() IS NOT NULL  -- ✅ CORRETO!
);

-- 4️⃣ DELETE: Usuários autenticados podem DELETAR
CREATE POLICY "Deletar foto de perfil permitido"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.uid() IS NOT NULL  -- ✅ CORRETO!
);

-- PASSO 3: VERIFICAR SE FOI APLICADO CORRETAMENTE
-- ------------------------------------------------
SELECT 
  '✅ VERIFICAÇÃO FINAL' as status,
  policyname as nome,
  cmd as operacao,
  CASE 
    WHEN qual IS NOT NULL THEN '✅ TEM USING'
    ELSE '❌ SEM USING'
  END as tem_using,
  CASE 
    WHEN with_check IS NOT NULL THEN '✅ TEM CHECK'
    ELSE '❌ SEM CHECK'
  END as tem_check,
  CASE
    WHEN qual::text LIKE '%auth.uid() IS NOT NULL%' OR with_check::text LIKE '%auth.uid() IS NOT NULL%' THEN '✅ USA auth.uid()'
    WHEN qual::text LIKE '%auth.role()%' OR with_check::text LIKE '%auth.role()%' THEN '❌ USA auth.role() (ERRADO!)'
    ELSE '⚠️ Sem verificação de auth'
  END as tipo_auth
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%foto%perfil%'
ORDER BY cmd;
