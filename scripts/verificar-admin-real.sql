-- ========================================
-- VERIFICAR USUÁRIOS ADMIN - ESTRUTURA REAL
-- ========================================
-- Baseado na estrutura real do banco
-- ========================================

-- 1. VER USUÁRIOS NO SUPABASE AUTH
SELECT 
    '👥 USUÁRIOS NO SUPABASE AUTH' AS secao,
    id,
    email,
    created_at,
    email_confirmed_at IS NOT NULL AS email_confirmado,
    last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- 2. VER ASSOCIAÇÕES ADMIN (baseado na estrutura real)
SELECT 
    '🔧 USUÁRIOS ADMIN ENCONTRADOS' AS secao,
    ea.id,
    ea.uid_usuario,
    ea.nome_completo,
    ea.email_usuario,
    ea.funcao,
    ea.id_empresa,
    ea.empresa_nome,
    ea.status_vinculacao,
    ea.ultimo_status_vinculacao
FROM empresa_associada ea
WHERE ea.funcao = 'admin'
ORDER BY ea.ultimo_status_vinculacao DESC;

-- 3. VER TODAS AS FUNÇÕES CADASTRADAS
SELECT 
    '📋 TODAS AS FUNÇÕES CADASTRADAS' AS secao,
    funcao,
    COUNT(*) as total,
    COUNT(CASE WHEN status_vinculacao = 'ativo' THEN 1 END) as ativos
FROM empresa_associada
GROUP BY funcao
ORDER BY funcao;

-- 4. VER EMPRESAS CADASTRADAS
SELECT 
    '🏢 EMPRESAS CADASTRADAS' AS secao,
    id,
    nome,
    slug,
    ativo,
    data_criacao
FROM empresas
ORDER BY data_criacao DESC;

-- 5. VER ASSOCIAÇÕES ATIVAS POR EMPRESA
SELECT 
    '🔗 ASSOCIAÇÕES ATIVAS POR EMPRESA' AS secao,
    ea.empresa_nome,
    ea.funcao,
    COUNT(*) as total
FROM empresa_associada ea
WHERE ea.status_vinculacao = 'ativo'
GROUP BY ea.empresa_nome, ea.funcao
ORDER BY ea.empresa_nome, ea.funcao;






