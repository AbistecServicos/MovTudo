-- ========================================
-- CORRIGIR POLÍTICAS STORAGE FOTO_PERFIL
-- ========================================
-- Este script remove TODAS as políticas de foto_perfil
-- e cria elas corretamente
-- ========================================

-- PASSO 1: REMOVER POLÍTICAS ANTIGAS
DROP POLICY IF EXISTS "Usuários podem deletar suas próprias fotos de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de foto de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias fotos de perfil" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICAS CORRETAS

-- 2.1) SELECT - Todos podem VER fotos de perfil (público)
CREATE POLICY "Todos podem ver fotos de perfil"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- 2.2) INSERT - Upload de fotos (autenticados)
CREATE POLICY "Upload de foto de perfil permitido"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- 2.3) UPDATE - Atualizar fotos (autenticados)
CREATE POLICY "Atualizar foto de perfil permitido"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- 2.4) DELETE - Deletar fotos (autenticados)
CREATE POLICY "Deletar foto de perfil permitido"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND auth.role() = 'authenticated'
);

-- PASSO 3: VERIFICAR SE FOI CRIADO CORRETAMENTE
SELECT 
    '✅ POLÍTICAS CRIADAS' as status,
    policyname as nome,
    cmd as operacao,
    CASE 
      WHEN qual IS NOT NULL THEN '✅ TEM USING'
      ELSE '❌ SEM USING'
    END as tem_using,
    CASE 
      WHEN with_check IS NOT NULL THEN '✅ TEM CHECK'
      ELSE '❌ SEM CHECK'
    END as tem_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname IN (
    'Todos podem ver fotos de perfil',
    'Upload de foto de perfil permitido',
    'Atualizar foto de perfil permitido',
    'Deletar foto de perfil permitido'
  )
ORDER BY cmd;

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- Você deve ver 4 linhas:
-- 1. DELETE - ✅ TEM USING, ❌ SEM CHECK
-- 2. INSERT - ❌ SEM USING, ✅ TEM CHECK (normal para INSERT)
-- 3. SELECT - ✅ TEM USING, ❌ SEM CHECK
-- 4. UPDATE - ✅ TEM USING, ✅ TEM CHECK
-- ========================================



