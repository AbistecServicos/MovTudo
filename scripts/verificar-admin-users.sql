-- ========================================
-- VERIFICAR USUÁRIOS ADMINISTRADORES
-- ========================================
-- Execute este script para verificar se há usuários admin
-- ========================================

-- 1. VERIFICAR USUÁRIOS NO SUPABASE AUTH
SELECT 
    '👥 USUÁRIOS NO AUTH' AS secao,
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL AS email_confirmado,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. VERIFICAR USUÁRIOS NA TABELA usuarios
SELECT 
    '📋 USUÁRIOS NA TABELA usuarios' AS secao,
    id,
    nome,
    telefone,
    ativo,
    data_criacao
FROM usuarios
ORDER BY data_criacao DESC;

-- 3. VERIFICAR ASSOCIAÇÕES ADMIN
SELECT 
    '🔧 ASSOCIAÇÕES ADMIN' AS secao,
    ea.id,
    u.email as usuario_email,
    u.nome as usuario_nome,
    e.nome as empresa_nome,
    ea.funcao,
    ea.status_vinculacao,
    ea.data_vinculacao
FROM empresa_associada ea
LEFT JOIN auth.users u ON u.id = ea.uid_usuario
LEFT JOIN empresas e ON e.id = ea.empresa_id
WHERE ea.funcao = 'admin'
ORDER BY ea.data_vinculacao DESC;

-- 4. VERIFICAR TODAS AS ASSOCIAÇÕES
SELECT 
    '🔗 TODAS AS ASSOCIAÇÕES' AS secao,
    ea.funcao,
    COUNT(*) as total
FROM empresa_associada ea
GROUP BY ea.funcao
ORDER BY ea.funcao;

-- 5. VERIFICAR EMPRESAS
SELECT 
    '🏢 EMPRESAS CADASTRADAS' AS secao,
    id,
    nome,
    slug,
    ativo,
    data_criacao
FROM empresas
ORDER BY data_criacao DESC;






