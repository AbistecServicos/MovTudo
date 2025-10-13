-- ============================================
-- ATUALIZAR EMAIL DO GERENTE
-- ============================================

-- BLOCO 1: VERIFICAR DADOS ATUAIS DO GERENTE
SELECT
    'ANTES DA ALTERAÇÃO' AS status,
    id,
    email,
    raw_user_meta_data->>'nome_completo' AS nome_completo
FROM auth.users
WHERE id = '2bc271b0-2e64-48ba-80ec-c324d3119eee';

-- BLOCO 2: ATUALIZAR EMAIL NA TABELA auth.users
UPDATE auth.users
SET 
    email = 'gerente1_movtudo_e1@abistec.com.br',
    raw_user_meta_data = jsonb_set(
        raw_user_meta_data,
        '{email}',
        '"gerente1_movtudo_e1@abistec.com.br"'
    ),
    updated_at = NOW()
WHERE id = '2bc271b0-2e64-48ba-80ec-c324d3119eee'
RETURNING id, email, raw_user_meta_data->>'nome_completo' AS nome_completo;

-- BLOCO 3: ATUALIZAR EMAIL NA TABELA usuarios
UPDATE usuarios
SET 
    email = 'gerente1_movtudo_e1@abistec.com.br'
WHERE uid = '2bc271b0-2e64-48ba-80ec-c324d3119eee'
RETURNING id, uid, email, nome_usuario, nome_completo;

-- BLOCO 4: ATUALIZAR EMAIL NA TABELA empresa_associada
UPDATE empresa_associada
SET 
    email_usuario = 'gerente1_movtudo_e1@abistec.com.br'
WHERE uid_usuario = '2bc271b0-2e64-48ba-80ec-c324d3119eee'
RETURNING id, uid_usuario, nome_completo, funcao, id_empresa, email_usuario;

-- BLOCO 5: VERIFICAR ALTERAÇÃO
SELECT
    'DEPOIS DA ALTERAÇÃO' AS status,
    u.id,
    u.email AS email_auth,
    usr.email AS email_usuarios,
    ea.email_usuario AS email_empresa_associada,
    usr.nome_completo,
    ea.funcao,
    ea.id_empresa
FROM auth.users u
LEFT JOIN usuarios usr ON u.id = usr.uid
LEFT JOIN empresa_associada ea ON u.id = ea.uid_usuario
WHERE u.id = '2bc271b0-2e64-48ba-80ec-c324d3119eee';

-- BLOCO 6: VERIFICAR TODOS OS EMAILS DOS USUÁRIOS
SELECT
    u.id,
    u.email AS email_auth,
    usr.email AS email_usuarios,
    usr.nome_usuario,
    usr.nome_completo,
    usr.is_admin
FROM auth.users u
LEFT JOIN usuarios usr ON u.id = usr.uid
ORDER BY usr.is_admin DESC, usr.nome_completo;





