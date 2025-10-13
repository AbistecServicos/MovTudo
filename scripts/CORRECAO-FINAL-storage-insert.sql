-- ========================================
-- CORREÇÃO FINAL - ADICIONAR USING NO INSERT
-- ========================================
-- O problema: INSERT precisa de USING também!
-- ========================================

-- REMOVER POLÍTICA INSERT ANTIGA
DROP POLICY IF EXISTS "Upload de foto de perfil permitido" ON storage.objects;

-- CRIAR NOVA COM USING + WITH CHECK
CREATE POLICY "Upload de foto de perfil permitido"
ON storage.objects
FOR INSERT
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

-- VERIFICAR
SELECT 
    '✅ INSERT CORRIGIDO' as status,
    policyname,
    cmd,
    CASE WHEN qual IS NOT NULL THEN '✅ TEM USING' ELSE '❌ SEM USING' END as tem_using,
    CASE WHEN with_check IS NOT NULL THEN '✅ TEM CHECK' ELSE '❌ SEM CHECK' END as tem_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname = 'Upload de foto de perfil permitido';

-- ========================================
-- RESULTADO ESPERADO:
-- ========================================
-- policyname: Upload de foto de perfil permitido
-- cmd: INSERT
-- tem_using: ✅ TEM USING   ← AGORA TEM!
-- tem_check: ✅ TEM CHECK
-- ========================================



