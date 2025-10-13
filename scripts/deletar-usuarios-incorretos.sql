-- ============================================
-- DELETAR USUÁRIOS INCORRETOS
-- ============================================

-- BLOCO 1: VERIFICAR USUÁRIOS EXISTENTES
SELECT
    id,
    email,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- BLOCO 2: DELETAR USUÁRIOS INCORRETOS (NÃO DELETA O ADMIN)
-- Executar um de cada vez para conferir

-- Deletar gerente incorreto
DELETE FROM auth.users
WHERE email = 'gerente@mototaxiexpress.com'
RETURNING id, email;

-- Deletar transportador incorreto
DELETE FROM auth.users
WHERE email = 'transportador@mototaxiexpress.com'
RETURNING id, email;

-- BLOCO 3: DELETAR DA TABELA empresa_associada
DELETE FROM empresa_associada
WHERE email_usuario IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com')
RETURNING id, nome_completo, funcao, email_usuario;

-- BLOCO 4: DELETAR DA TABELA usuarios
DELETE FROM usuarios
WHERE email IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com')
RETURNING id, email, nome_completo;

-- BLOCO 5: VERIFICAR SE DELETOU TUDO
SELECT
    'auth.users' AS tabela,
    COUNT(*) AS total
FROM auth.users
WHERE email NOT LIKE '%almirdss%'
UNION ALL
SELECT
    'usuarios',
    COUNT(*)
FROM usuarios
WHERE email NOT LIKE '%almirdss%'
UNION ALL
SELECT
    'empresa_associada',
    COUNT(*)
FROM empresa_associada;






