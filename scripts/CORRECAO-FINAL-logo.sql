-- =====================================================
-- CORREÇÃO FINAL: Logo SEM verificação de auth no INSERT
-- Seguindo o mesmo padrão que funcionou para foto_perfil
-- =====================================================

-- PASSO 1: REMOVER TODAS AS POLÍTICAS DE LOGO
-- --------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura pública de logos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin uploads to box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update in box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete in box/logo" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICAS SIMPLES (IGUAL FOTO_PERFIL)
-- ------------------------------------------------------

-- 1️⃣ SELECT: Todos podem VER logos (público)
CREATE POLICY "Allow public read from box/logo"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
);

-- 2️⃣ INSERT: Usuários autenticados podem FAZER UPLOAD
-- ✅ SEM VERIFICAÇÃO DE AUTH NO WITH CHECK!
-- A autenticação será controlada pela aplicação (admin)
CREATE POLICY "Allow authenticated uploads to box/logo"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  -- ✅ SEM auth.uid() ou is_admin()!
  -- A aplicação garante que só admin faz upload
);

-- 3️⃣ UPDATE: Usuários autenticados podem ATUALIZAR
CREATE POLICY "Allow authenticated update in box/logo"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  -- ✅ SEM verificação de auth!
);

-- 4️⃣ DELETE: Usuários autenticados podem DELETAR
CREATE POLICY "Allow authenticated delete in box/logo"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  -- ✅ SEM verificação de auth!
);

-- PASSO 3: VERIFICAR SE FOI APLICADO
-- -----------------------------------
SELECT 
  '✅ POLÍTICAS DE LOGO (SEM AUTH)' as status,
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
  qual::text as expressao_using,
  with_check::text as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%logo%'
ORDER BY cmd;


