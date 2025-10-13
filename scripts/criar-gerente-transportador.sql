-- ========================================
-- CRIAR GERENTE E TRANSPORTADOR
-- ========================================
-- IMPORTANTE: Execute este script APENAS após criar a empresa E1
-- ========================================

-- BLOCO 1: CRIAR GERENTE (via Supabase Auth)
-- NOTA: Você precisa criar este usuário manualmente no Supabase Auth primeiro
-- Email: gerente@mototaxiexpress.com
-- Senha: Gerente123!

-- BLOCO 2: CRIAR TRANSPORTADOR (via Supabase Auth)
-- NOTA: Você precisa criar este usuário manualmente no Supabase Auth primeiro
-- Email: transportador@mototaxiexpress.com
-- Senha: Transportador123!

-- BLOCO 3: ADICIONAR GERENTE À TABELA usuarios
-- Substitua o UUID abaixo pelo UUID real do usuário criado no Auth
INSERT INTO usuarios (
    uid,
    email,
    nome_usuario,
    nome_completo,
    telefone,
    is_admin
) VALUES (
    'SUBSTITUA_PELO_UUID_DO_GERENTE',  -- UUID do gerente no Supabase Auth
    'gerente@mototaxiexpress.com',
    'gerente_e1',
    'Maria Silva Santos',
    '(21) 98888-8888',
    false
);

-- BLOCO 4: ADICIONAR TRANSPORTADOR À TABELA usuarios
-- Substitua o UUID abaixo pelo UUID real do usuário criado no Auth
INSERT INTO usuarios (
    uid,
    email,
    nome_usuario,
    nome_completo,
    telefone,
    is_admin
) VALUES (
    'SUBSTITUA_PELO_UUID_DO_TRANSPORTADOR',  -- UUID do transportador no Supabase Auth
    'transportador@mototaxiexpress.com',
    'transportador_e1',
    'João Oliveira Costa',
    '(21) 97777-7777',
    false
);

-- BLOCO 5: ASSOCIAR GERENTE À EMPRESA
INSERT INTO empresa_associada (
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    empresa_nome,
    empresa_endereco,
    empresa_telefone,
    email_usuario
) VALUES (
    'SUBSTITUA_PELO_UUID_DO_GERENTE',  -- UUID do gerente
    'Maria Silva Santos',
    'gerente',
    'E1',
    'Moto Taxi Express',
    'Rua das Flores, 123 - Centro',
    '(21) 99999-9999',
    'gerente@mototaxiexpress.com'
);

-- BLOCO 6: ASSOCIAR TRANSPORTADOR À EMPRESA
INSERT INTO empresa_associada (
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    empresa_nome,
    empresa_endereco,
    empresa_telefone,
    veiculo,
    carga_maxima,
    email_usuario
) VALUES (
    'SUBSTITUA_PELO_UUID_DO_TRANSPORTADOR',  -- UUID do transportador
    'João Oliveira Costa',
    'transportador',
    'E1',
    'Moto Taxi Express',
    'Rua das Flores, 123 - Centro',
    '(21) 99999-9999',
    'Moto Honda CG 160',
    5,
    'transportador@mototaxiexpress.com'
);

-- BLOCO 7: VERIFICAR SE OS USUÁRIOS FORAM CRIADOS
SELECT 
    '👥 USUÁRIOS CRIADOS' AS secao,
    u.email,
    u.nome_completo,
    u.is_admin,
    ea.funcao,
    ea.empresa_nome
FROM usuarios u
LEFT JOIN empresa_associada ea ON ea.uid_usuario = u.uid
WHERE u.email IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com');






