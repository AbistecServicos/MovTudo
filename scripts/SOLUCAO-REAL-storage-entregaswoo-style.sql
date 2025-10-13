-- =====================================================
-- SOLUÇÃO REAL: Políticas Storage estilo EntregasWoo
-- Baseado no projeto que FUNCIONA!
-- =====================================================

-- PASSO 1: REMOVER TODAS AS POLÍTICAS DE foto_perfil
-- ---------------------------------------------------
DROP POLICY IF EXISTS "Todos podem ver fotos de perfil" ON storage.objects;
DROP POLICY IF EXISTS "Upload de foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Atualizar foto de perfil permitido" ON storage.objects;
DROP POLICY IF EXISTS "Deletar foto de perfil permitido" ON storage.objects;

-- PASSO 2: CRIAR POLÍTICAS CORRETAS (ESTILO ENTREGASWOO)
-- --------------------------------------------------------

-- 1️⃣ SELECT: Leitura pública de fotos de perfil
CREATE POLICY "Allow public read from box/foto_perfil"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
);

-- 2️⃣ INSERT: Upload de fotos (SEM verificação de auth no WITH CHECK!)
CREATE POLICY "Allow authenticated uploads to box/foto_perfil"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  -- ✅ SEM auth.uid() ou auth.role() aqui!
);

-- 3️⃣ UPDATE: Atualizar próprias fotos (verifica pelo nome do arquivo)
CREATE POLICY "Allow authenticated update own files in box/foto_perfil"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND (auth.uid())::text = (storage.foldername(name))[2]
  -- ✅ Verifica se o uid do usuário está no nome da pasta
);

-- 4️⃣ DELETE: Deletar próprias fotos (verifica pelo nome do arquivo)
CREATE POLICY "Allow authenticated delete own files in box/foto_perfil"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'foto_perfil'
  AND (auth.uid())::text = (storage.foldername(name))[2]
  -- ✅ Verifica se o uid do usuário está no nome da pasta
);

-- PASSO 3: CRIAR POLÍTICA NO BUCKET (se não existir)
-- ---------------------------------------------------
-- Esta política libera o acesso ao bucket 'box' em si
DO $$
BEGIN
  -- Tentar criar a política
  BEGIN
    EXECUTE 'CREATE POLICY "liberar" ON storage.buckets FOR ALL USING (true)';
  EXCEPTION
    WHEN duplicate_object THEN
      -- Política já existe, ignorar
      NULL;
  END;
END $$;

-- PASSO 4: VERIFICAR SE FOI APLICADO CORRETAMENTE
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
  qual::text as expressao_using,
  with_check::text as expressao_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%foto%perfil%'
ORDER BY cmd;


