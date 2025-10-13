-- =====================================================
-- POLÍTICAS STORAGE PARA LOGOS DAS EMPRESAS
-- Baseado no EntregasWoo (funcionando)
-- Pasta: box/logo (conforme estrutura atual)
-- =====================================================

-- PASSO 1: LIMPAR POLÍTICAS ANTIGAS DE LOGO
-- ------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura pública de logos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Usuários autenticados podem fazer upload de logos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar logos das suas empresas" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar logos das suas empresas" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin uploads to box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update in box/logo" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete in box/logo" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICAS PARA LOGO (ESTILO ENTREGASWOO)
-- ---------------------------------------------------------

-- 1️⃣ SELECT: Todos podem VER logos (público)
CREATE POLICY "Permitir leitura pública de logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
);

-- 2️⃣ INSERT: Apenas ADMINS podem fazer UPLOAD de logos
-- IMPORTANTE: SEM USING, só WITH CHECK!
CREATE POLICY "Permitir upload de logos para admins"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND (
    EXISTS (
      SELECT 1 
      FROM usuarios 
      WHERE usuarios.uid = auth.uid() 
        AND usuarios.is_admin = true
    )
  )
);

-- 3️⃣ UPDATE: Apenas ADMINS podem ATUALIZAR logos
CREATE POLICY "Permitir atualização de logos para admins"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND (
    EXISTS (
      SELECT 1 
      FROM usuarios 
      WHERE usuarios.uid = auth.uid() 
        AND usuarios.is_admin = true
    )
  )
);

-- 4️⃣ DELETE: Apenas ADMINS podem DELETAR logos
CREATE POLICY "Permitir deleção de logos para admins"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND (
    EXISTS (
      SELECT 1 
      FROM usuarios 
      WHERE usuarios.uid = auth.uid() 
        AND usuarios.is_admin = true
    )
  )
);

-- PASSO 3: VERIFICAR SE FOI CRIADO CORRETAMENTE
-- ----------------------------------------------
SELECT 
  '✅ POLÍTICAS DE LOGO' as status,
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
  AND policyname LIKE '%logo%'
ORDER BY cmd;

-- Verificar se a verificação de admin está correta
SELECT 
  '🔍 EXPRESSÕES COM ADMIN' as info,
  policyname as nome,
  cmd as operacao,
  CASE
    WHEN qual::text LIKE '%is_admin%' OR with_check::text LIKE '%is_admin%' THEN '✅ Verifica admin'
    ELSE '⚠️ Não verifica admin'
  END as verifica_admin
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%logo%'
ORDER BY cmd;


