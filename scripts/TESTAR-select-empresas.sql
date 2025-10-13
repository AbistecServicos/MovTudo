-- Teste de SELECT na tabela empresas
-- Execute este SQL logado como o gerente no Supabase

-- Ver se consegue buscar a empresa
SELECT * FROM empresas WHERE slug = 'moto-taxi-express';

-- Ver se consegue buscar por id_empresa
SELECT * FROM empresas WHERE id_empresa = 'E1';

-- Ver se consegue buscar empresas ativas
SELECT * FROM empresas WHERE ativa = true;

-- Ver qual usuário está logado
SELECT auth.uid() as meu_uid;

-- Ver empresa_associada do usuário logado
SELECT * FROM empresa_associada 
WHERE uid_usuario = auth.uid() 
  AND status_vinculacao = 'ativo';


