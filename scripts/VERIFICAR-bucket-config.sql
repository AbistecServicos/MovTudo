-- =====================================================
-- VERIFICAR CONFIGURAÇÃO DO BUCKET 'box'
-- Execute no MovTudo
-- =====================================================

-- 1. Ver configuração do bucket
SELECT 
  '📦 CONFIGURAÇÃO DO BUCKET' as secao,
  id as bucket_id,
  name as nome,
  public as e_publico,
  file_size_limit as limite_tamanho,
  allowed_mime_types as tipos_permitidos
FROM storage.buckets
WHERE id = 'box';

-- 2. Ver TODAS as políticas de storage.objects (não só foto_perfil)
SELECT 
  '🔒 TODAS AS POLÍTICAS' as secao,
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
ORDER BY cmd, policyname;

-- 3. Ver se há políticas no bucket (storage.buckets)
SELECT 
  '🔐 POLÍTICAS NO BUCKET' as secao,
  policyname as nome,
  cmd as operacao
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'buckets';


