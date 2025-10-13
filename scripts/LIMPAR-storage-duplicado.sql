-- =====================================================
-- LIMPEZA: Remover políticas DUPLICADAS de foto_perfil
-- Mantém apenas as políticas com nomes completos
-- =====================================================

-- Remover políticas com nomes CURTOS (duplicadas antigas)
DROP POLICY IF EXISTS "Upload foto perfil" ON storage.objects;
DROP POLICY IF EXISTS "Atualizar foto perfil" ON storage.objects;
DROP POLICY IF EXISTS "Deletar foto perfil" ON storage.objects;
DROP POLICY IF EXISTS "Ver fotos de perfil" ON storage.objects;

-- VERIFICAR SE LIMPOU CORRETAMENTE
-- Deve mostrar apenas 4 políticas (uma de cada tipo)
SELECT 
  '✅ APÓS LIMPEZA' as status,
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

-- Deve retornar exatamente 4 linhas:
-- 1x DELETE: "Deletar foto de perfil permitido"
-- 1x INSERT: "Upload de foto de perfil permitido"
-- 1x SELECT: "Todos podem ver fotos de perfil"
-- 1x UPDATE: "Atualizar foto de perfil permitido"



