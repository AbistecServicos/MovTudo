-- ============================================
-- ASSOCIAR GERENTE À EMPRESA E1
-- ============================================

-- BLOCO 1: VERIFICAR GERENTE
SELECT
    id,
    uid,
    email,
    nome_usuario,
    nome_completo
FROM usuarios
WHERE email = 'gerente1_movtudo_e1@abistec.com.br';

-- BLOCO 2: VERIFICAR SE JÁ ESTÁ ASSOCIADO
SELECT
    id,
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    email_usuario
FROM empresa_associada
WHERE email_usuario = 'gerente1_movtudo_e1@abistec.com.br';

-- BLOCO 3: ASSOCIAR À EMPRESA E1
INSERT INTO empresa_associada (
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    empresa_nome,
    email_usuario
) VALUES (
    (SELECT uid FROM usuarios WHERE email = 'gerente1_movtudo_e1@abistec.com.br'),
    'Gerente1 da MovTudo Empresa E1',
    'gerente',
    'E1',
    'Moto Taxi Express',
    'gerente1_movtudo_e1@abistec.com.br'
)
ON CONFLICT (uid_usuario, id_empresa) DO UPDATE SET
    nome_completo = EXCLUDED.nome_completo,
    email_usuario = EXCLUDED.email_usuario
RETURNING *;

-- BLOCO 4: VERIFICAR ASSOCIAÇÃO
SELECT
    ea.id,
    ea.uid_usuario,
    ea.nome_completo,
    ea.funcao,
    ea.id_empresa,
    ea.empresa_nome,
    ea.email_usuario,
    ea.status_vinculacao,
    u.email AS email_auth,
    usr.email AS email_usuarios
FROM empresa_associada ea
LEFT JOIN auth.users u ON ea.uid_usuario = u.id
LEFT JOIN usuarios usr ON ea.uid_usuario = usr.uid
WHERE ea.email_usuario = 'gerente1_movtudo_e1@abistec.com.br';

-- BLOCO 5: VERIFICAR TODOS OS USUÁRIOS E SUAS ASSOCIAÇÕES
SELECT
    u.email,
    usr.nome_usuario,
    usr.nome_completo,
    usr.is_admin,
    ea.funcao,
    ea.id_empresa,
    ea.empresa_nome,
    ea.status_vinculacao
FROM usuarios usr
LEFT JOIN auth.users u ON usr.uid = u.id
LEFT JOIN empresa_associada ea ON usr.uid = ea.uid_usuario
ORDER BY usr.is_admin DESC, ea.funcao, usr.nome_completo;





