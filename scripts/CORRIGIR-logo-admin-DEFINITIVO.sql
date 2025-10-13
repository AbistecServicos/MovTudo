-- =====================================================
-- SOLUÇÃO DEFINITIVA: Upload de logo para ADMINS
-- Problema: RLS da tabela usuarios bloqueia verificação
-- Solução: Criar função SECURITY DEFINER
-- =====================================================

-- PASSO 1: CRIAR FUNÇÃO PARA VERIFICAR SE É ADMIN
-- ------------------------------------------------
-- Esta função roda com privilégios do dono (SECURITY DEFINER)
-- e ignora RLS
CREATE OR REPLACE FUNCTION public.is_user_admin(user_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM usuarios 
    WHERE uid = user_uid 
      AND is_admin = true
  );
END;
$$;

-- PASSO 2: REMOVER POLÍTICAS ANTIGAS DE LOGO
-- -------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura pública de logos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir upload de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir atualização de logos para admins" ON storage.objects;
DROP POLICY IF EXISTS "Permitir deleção de logos para admins" ON storage.objects;

-- PASSO 3: CRIAR NOVAS POLÍTICAS USANDO A FUNÇÃO
-- ------------------------------------------------

-- 1️⃣ SELECT: Todos podem VER logos (público)
CREATE POLICY "Permitir leitura pública de logos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
);

-- 2️⃣ INSERT: Apenas ADMINS podem fazer UPLOAD
-- Usa a função is_user_admin() que ignora RLS
CREATE POLICY "Permitir upload de logos para admins"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND public.is_user_admin(auth.uid())  -- ✅ Usa função SECURITY DEFINER
);

-- 3️⃣ UPDATE: Apenas ADMINS podem ATUALIZAR
CREATE POLICY "Permitir atualização de logos para admins"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND public.is_user_admin(auth.uid())  -- ✅ Usa função SECURITY DEFINER
);

-- 4️⃣ DELETE: Apenas ADMINS podem DELETAR
CREATE POLICY "Permitir deleção de logos para admins"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'box' 
  AND (storage.foldername(name))[1] = 'logo'
  AND public.is_user_admin(auth.uid())  -- ✅ Usa função SECURITY DEFINER
);

-- PASSO 4: VERIFICAR SE FOI APLICADO
-- -----------------------------------
SELECT 
  '✅ POLÍTICAS DE LOGO (COM FUNÇÃO)' as status,
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
    WHEN qual::text LIKE '%is_user_admin%' OR with_check::text LIKE '%is_user_admin%' THEN '✅ USA FUNÇÃO'
    ELSE '⚠️ NÃO USA FUNÇÃO'
  END as usa_funcao
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%logo%'
ORDER BY cmd;

-- Verificar se a função foi criada
SELECT 
  '✅ FUNÇÃO CRIADA' as status,
  proname as nome_funcao,
  prosecdef as security_definer
FROM pg_proc
WHERE proname = 'is_user_admin';


