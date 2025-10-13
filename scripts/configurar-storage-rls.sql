-- ========================================
-- CONFIGURAR POLÍTICAS RLS DO STORAGE
-- ========================================
-- Bucket: box
-- Subpastas: pdf, logo, foto_perfil, imagens
-- ========================================

-- IMPORTANTE: Este script deve ser executado no Supabase Dashboard
-- em Storage > Policies, não no SQL Editor!

-- ========================================
-- POLÍTICAS PARA foto_perfil
-- ========================================

-- POLÍTICA 1: Upload de foto de perfil
-- Nome: "Usuários podem fazer upload de suas fotos de perfil"
-- Operação: INSERT
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'


-- POLÍTICA 2: Visualizar fotos de perfil
-- Nome: "Todos podem ver fotos de perfil"
-- Operação: SELECT
-- Alvo: Público
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil'


-- POLÍTICA 3: Atualizar foto de perfil
-- Nome: "Usuários podem atualizar suas fotos de perfil"
-- Operação: UPDATE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'


-- POLÍTICA 4: Deletar foto de perfil
-- Nome: "Usuários podem deletar suas fotos de perfil"
-- Operação: DELETE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'


-- ========================================
-- POLÍTICAS PARA logo
-- ========================================

-- POLÍTICA 5: Upload de logo
-- Nome: "Admins podem fazer upload de logos"
-- Operação: INSERT
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo' AND auth.role() = 'authenticated'


-- POLÍTICA 6: Visualizar logos
-- Nome: "Todos podem ver logos"
-- Operação: SELECT
-- Alvo: Público
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo'


-- POLÍTICA 7: Atualizar logo
-- Nome: "Admins podem atualizar logos"
-- Operação: UPDATE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo' AND auth.role() = 'authenticated'


-- POLÍTICA 8: Deletar logo
-- Nome: "Admins podem deletar logos"
-- Operação: DELETE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'logo' AND auth.role() = 'authenticated'


-- ========================================
-- POLÍTICAS PARA imagens
-- ========================================

-- POLÍTICA 9: Upload de imagens de objetos
-- Nome: "Usuários podem fazer upload de imagens"
-- Operação: INSERT
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens' AND auth.role() = 'authenticated'


-- POLÍTICA 10: Visualizar imagens
-- Nome: "Todos podem ver imagens"
-- Operação: SELECT
-- Alvo: Público
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens'


-- POLÍTICA 11: Atualizar imagens
-- Nome: "Usuários podem atualizar imagens"
-- Operação: UPDATE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens' AND auth.role() = 'authenticated'


-- POLÍTICA 12: Deletar imagens
-- Nome: "Usuários podem deletar imagens"
-- Operação: DELETE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'imagens' AND auth.role() = 'authenticated'


-- ========================================
-- POLÍTICAS PARA pdf
-- ========================================

-- POLÍTICA 13: Upload de PDFs
-- Nome: "Usuários podem fazer upload de PDFs"
-- Operação: INSERT
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'


-- POLÍTICA 14: Visualizar PDFs
-- Nome: "Usuários autenticados podem ver PDFs"
-- Operação: SELECT
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'


-- POLÍTICA 15: Atualizar PDFs
-- Nome: "Usuários podem atualizar PDFs"
-- Operação: UPDATE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'

-- Expressão WITH CHECK (mesma):
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'


-- POLÍTICA 16: Deletar PDFs
-- Nome: "Usuários podem deletar PDFs"
-- Operação: DELETE
-- Alvo: Usuários autenticados
-- Expressão USING:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'pdf' AND auth.role() = 'authenticated'


-- ========================================
-- INSTRUÇÕES DE USO
-- ========================================

/*
PASSO A PASSO PARA CRIAR AS POLÍTICAS:

1. Acesse o Supabase Dashboard:
   https://supabase.com/dashboard/project/buxpuusxglavepfrivwg

2. Vá em: Storage > Buckets

3. Clique no bucket "box"

4. Clique em "Policies" no topo

5. Para cada política acima, clique em "New Policy":

   a) Clique em "Create a policy from scratch"
   
   b) Preencha os campos:
      - Policy name: [copie o nome acima]
      - Allowed operation: [SELECT ou INSERT ou UPDATE ou DELETE]
      - Target roles:
        * Se for "Público": public
        * Se for "Usuários autenticados": authenticated
      
   c) Copie a expressão USING do script acima
   
   d) Se for INSERT ou UPDATE, copie também a expressão WITH CHECK
   
   e) Clique em "Save"

6. Repita para todas as 16 políticas

7. Teste fazendo upload de uma foto de perfil

ORDEM RECOMENDADA DE CRIAÇÃO:
--------------------------------
Prioridade ALTA (para resolver erro de foto):
1. Políticas 1-4 (foto_perfil) ← FAZER PRIMEIRO!

Prioridade MÉDIA:
2. Políticas 5-8 (logo)
3. Políticas 9-12 (imagens)

Prioridade BAIXA (implementar depois):
4. Políticas 13-16 (pdf)

ATALHO RÁPIDO:
--------------------------------
Se quiser apenas resolver o erro da foto de perfil:
→ Crie apenas as políticas 1-4
→ Teste
→ Depois crie as outras quando precisar

VERIFICAÇÃO:
--------------------------------
Após criar as políticas, você deve ver:
- 4 políticas para foto_perfil (INSERT, SELECT, UPDATE, DELETE)
- Todas com status "Enabled"

Para verificar, vá em:
Storage > Buckets > box > Policies

TROUBLESHOOTING:
--------------------------------
Se ainda der erro:
1. Verifique se o bucket está público (deve estar)
2. Verifique se as expressões foram coladas corretamente
3. Verifique se não tem espaços extras
4. Tente desabilitar e reabilitar a política
5. Verifique os logs em: Storage > Logs
*/

-- ========================================
-- POLÍTICA ALTERNATIVA MAIS PERMISSIVA
-- (Use apenas se a acima não funcionar)
-- ========================================

/*
Se tiver problemas, tente esta versão mais simples para foto_perfil:

POLÍTICA SIMPLES 1: Upload
Nome: "Upload permitido para foto_perfil"
Operação: INSERT
Target: authenticated
USING: bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil'
WITH CHECK: (mesmo)

POLÍTICA SIMPLES 2: Visualizar
Nome: "Ver fotos de perfil"
Operação: SELECT
Target: public
USING: bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil'

POLÍTICA SIMPLES 3: Atualizar e Deletar
Nome: "Modificar foto_perfil"
Operação: UPDATE, DELETE
Target: authenticated
USING: bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil'
WITH CHECK: (mesmo para UPDATE)
*/

-- ========================================
-- FIM DO SCRIPT
-- ========================================



