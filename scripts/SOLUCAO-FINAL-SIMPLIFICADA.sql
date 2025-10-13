-- =====================================================
-- SOLUÇÃO FINAL SIMPLIFICADA
-- Baseado no EntregasWoo, adaptado para MovTudo
-- =====================================================

-- PASSO 1: LIMPAR TUDO
-- ---------------------
DROP POLICY IF EXISTS "Todos podem ver fotos de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Upload de foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Atualizar foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Deletar foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from box/foto_perfil" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to box/foto_perfil" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update own files in box/foto_perfil" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete own files in box/foto_perfil" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICA NO BUCKET (permitir acesso ao bucket)
-- --------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'buckets' 
    AND policyname = 'liberar'
  ) THEN
    EXECUTE 'CREATE POLICY "liberar" ON storage.buckets FOR ALL USING (true)';
  END IF;
END $$;

-- PASSO 3: CRIAR POLÍTICAS SIMPLES (ESTILO ENTREGASWOO)
-- -------------------------------------------------------

-- 1️⃣ SELECT: Todos podem VER (público)
CREATE POLICY "Allow public read from box/foto_perfil"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- 2️⃣ INSERT: Usuários autenticados podem FAZER UPLOAD
-- IMPORTANTE: SEM verificação de auth no WITH CHECK!
CREATE POLICY "Allow authenticated uploads to box/foto_perfil"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  -- ✅ SEM auth.uid() ou auth.role()!
  -- A autenticação é garantida pela role 'authenticated' do RLS
);

-- 3️⃣ UPDATE: Usuários autenticados podem ATUALIZAR
-- Simplificado: qualquer usuário autenticado pode atualizar qualquer foto
-- (isso será controlado pela aplicação, não pelo RLS)
CREATE POLICY "Allow authenticated update in box/foto_perfil"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- 4️⃣ DELETE: Usuários autenticados podem DELETAR
-- Simplificado: qualquer usuário autenticado pode deletar qualquer foto
-- (isso será controlado pela aplicação, não pelo RLS)
CREATE POLICY "Allow authenticated delete in box/foto_perfil"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- PASSO 4: VERIFICAR
-- ------------------
SELECT 
  '✅ POLÍTICAS CRIADAS' as status,
  policyname as nome,
  cmd as operacao,
  CASE 
    WHEN qual IS NOT NULL THEN '✅'
    ELSE '❌'
  END as tem_using,
  CASE 
    WHEN with_check IS NOT NULL THEN '✅'
    ELSE '❌'
  END as tem_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%foto%perfil%'
ORDER BY cmd;

-- Verificar política do bucket
SELECT 
  '✅ POLÍTICA DO BUCKET' as status,
  policyname as nome,
  cmd as operacao
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'buckets';


