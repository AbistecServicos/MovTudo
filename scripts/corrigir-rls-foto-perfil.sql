-- ========================================
-- CORRIGIR POLÍTICAS RLS PARA FOTO DE PERFIL
-- ========================================
-- Este script corrige as políticas RLS para permitir que
-- usuários façam upload de suas fotos de perfil.
-- ========================================

-- 1. GARANTIR QUE RLS ESTÁ HABILITADO
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 2. REMOVER POLÍTICAS ANTIGAS QUE PODEM ESTAR CONFLITANDO (se existirem)
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria foto" ON usuarios;
DROP POLICY IF EXISTS "Usuário pode atualizar seus próprios dados" ON usuarios;

-- 3. CRIAR/ATUALIZAR POLÍTICA PARA UPDATE DO PRÓPRIO USUÁRIO
CREATE POLICY "Usuários podem atualizar seus próprios dados"
ON usuarios
FOR UPDATE
USING (uid = auth.uid())
WITH CHECK (uid = auth.uid());

-- 4. GARANTIR QUE USUÁRIO PODE VER SEUS PRÓPRIOS DADOS
-- (Criar apenas se não existir)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'usuarios' 
    AND policyname = 'Usuário pode ver seus próprios dados'
  ) THEN
    CREATE POLICY "Usuário pode ver seus próprios dados"
    ON usuarios
    FOR SELECT
    USING (uid = auth.uid());
  END IF;
END $$;

-- 5. CONFIGURAR POLÍTICAS DO STORAGE BUCKET 'box'
-- (Execute este bloco no Storage > Policies no Dashboard do Supabase)

/*
POLÍTICAS PARA O BUCKET 'box':

POLÍTICA 1: Permitir INSERT (Upload)
------------------------------------------
Nome: "Usuários podem fazer upload de suas próprias fotos"
Operação: INSERT
Expressão USING:
  (bucket_id = 'box'::text) AND 
  (storage.foldername(name))[1] = 'foto_perfil' AND
  (auth.uid())::text = (storage.foldername(name))[2]

Explicação: Permite que usuários façam upload apenas na pasta foto_perfil/[seu_uid]/

POLÍTICA 2: Permitir SELECT (Visualização)
------------------------------------------
Nome: "Todos podem ver fotos de perfil"
Operação: SELECT
Expressão USING:
  (bucket_id = 'box'::text) AND 
  (storage.foldername(name))[1] = 'foto_perfil'

Explicação: Permite que qualquer um visualize fotos de perfil

POLÍTICA 3: Permitir UPDATE (Atualização)
------------------------------------------
Nome: "Usuários podem atualizar suas próprias fotos"
Operação: UPDATE
Expressão USING:
  (bucket_id = 'box'::text) AND 
  (storage.foldername(name))[1] = 'foto_perfil' AND
  (auth.uid())::text = (storage.foldername(name))[2]

Explicação: Permite que usuários atualizem apenas suas próprias fotos

POLÍTICA 4: Permitir DELETE (Exclusão)
------------------------------------------
Nome: "Usuários podem deletar suas próprias fotos"
Operação: DELETE
Expressão USING:
  (bucket_id = 'box'::text) AND 
  (storage.foldername(name))[1] = 'foto_perfil' AND
  (auth.uid())::text = (storage.foldername(name))[2]

Explicação: Permite que usuários deletem apenas suas próprias fotos
*/

-- 6. VERIFICAR POLÍTICAS CRIADAS
SELECT 
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS operation,
    qual AS using_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
ORDER BY policyname;

-- 7. TESTAR SE O USUÁRIO PODE ATUALIZAR SUA FOTO
-- Execute após fazer login no sistema
/*
-- Teste 1: Ver seus próprios dados
SELECT * FROM usuarios WHERE uid = auth.uid();

-- Teste 2: Atualizar sua foto
UPDATE usuarios 
SET foto = 'https://exemplo.com/foto.jpg' 
WHERE uid = auth.uid();

-- Se funcionar, a política está correta!
*/

-- ========================================
-- INSTRUÇÕES DE USO
-- ========================================

/*
PASSO 1: Executar SQL no Supabase Dashboard
--------------------------------------------
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: MovTudo
3. Vá em "SQL Editor"
4. Cole este script até a linha 78 (antes dos comentários de Storage)
5. Clique em "Run"

PASSO 2: Configurar Políticas do Storage
--------------------------------------------
1. Acesse: Storage > Buckets
2. Clique no bucket "box"
3. Vá em "Policies"
4. Clique em "New Policy"
5. Crie as 4 políticas descritas acima (POLÍTICAS 1, 2, 3 e 4)

PASSO 3: Testar
--------------------------------------------
1. Faça login no sistema como usuário normal
2. Acesse /perfil
3. Tente fazer upload de uma foto
4. Deve funcionar sem erro!

TROUBLESHOOTING:
--------------------------------------------
Se ainda der erro:

1. Verificar se o bucket 'box' existe
2. Verificar se o bucket tem permissão pública para SELECT
3. Verificar logs no Supabase Dashboard > Logs > Storage
4. Verificar se auth.uid() está retornando o ID correto
5. Verificar se a estrutura de pastas está correta: foto_perfil/[uid]/arquivo.jpg
*/

-- ========================================
-- SCRIPT ALTERNATIVO MAIS SIMPLES
-- ========================================
-- Se o acima não funcionar, tente desabilitar RLS temporariamente
-- APENAS PARA DEBUG! NÃO USAR EM PRODUÇÃO!

/*
-- DESABILITAR RLS (APENAS PARA TESTE!)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Depois de testar, REABILITAR:
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
*/



