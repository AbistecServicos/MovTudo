-- ========================================
-- SCRIPT: Criar Empresas e Usuários de Teste
-- ========================================
-- Objetivo: Popular o banco com 4 empresas e usuários para testes
-- Baseado em: PastaPessoal/EmpresasUsuariosTestes.md
-- Data: 13/10/2025
-- ========================================

-- ========================================
-- EMPRESA E1 - MOTO TAXI EXPRESS
-- ========================================

INSERT INTO public.empresas (
    id_empresa,
    empresa_nome,
    cnpj,
    slug,
    empresa_endereco,
    empresa_telefone,
    empresa_cidade,
    empresa_estado,
    cor_primaria,
    cor_secundaria,
    ativa
) VALUES (
    'E1',
    'Moto Taxi Express',
    '12.345.678/0001-10',
    'moto-taxi-express',
    'Av. Brasil, 1000',
    '(21) 99999-0001',
    'Rio de Janeiro',
    'RJ',
    '#FF6B00',
    '#FFB800',
    true
) ON CONFLICT (id_empresa) DO UPDATE SET
    empresa_nome = EXCLUDED.empresa_nome,
    slug = EXCLUDED.slug;

-- ========================================
-- EMPRESA E2 - VOLTA COM FÉ TRANSPORTES
-- ========================================

INSERT INTO public.empresas (
    id_empresa,
    empresa_nome,
    cnpj,
    slug,
    empresa_endereco,
    empresa_telefone,
    empresa_cidade,
    empresa_estado,
    cor_primaria,
    cor_secundaria,
    ativa
) VALUES (
    'E2',
    'Volta com Fé Transportes',
    '23.456.789/0001-20',
    'volta-com-fe',
    'Rod. Presidente Dutra, Km 180',
    '(21) 99999-0002',
    'Rio de Janeiro',
    'RJ',
    '#1E40AF',
    '#3B82F6',
    true
) ON CONFLICT (id_empresa) DO UPDATE SET
    empresa_nome = EXCLUDED.empresa_nome,
    slug = EXCLUDED.slug;

-- ========================================
-- EMPRESA E3 - AÇAÍ DELIVERY
-- ========================================

INSERT INTO public.empresas (
    id_empresa,
    empresa_nome,
    cnpj,
    slug,
    empresa_endereco,
    empresa_telefone,
    empresa_cidade,
    empresa_estado,
    cor_primaria,
    cor_secundaria,
    ativa
) VALUES (
    'E3',
    'Açaí Delivery',
    '34.567.890/0001-30',
    'acai-delivery',
    'Rua das Flores, 500 - Copacabana',
    '(21) 99999-0003',
    'Rio de Janeiro',
    'RJ',
    '#8B5CF6',
    '#C084FC',
    true
) ON CONFLICT (id_empresa) DO UPDATE SET
    empresa_nome = EXCLUDED.empresa_nome,
    slug = EXCLUDED.slug;

-- ========================================
-- EMPRESA E4 - TAXI SUL
-- ========================================

INSERT INTO public.empresas (
    id_empresa,
    empresa_nome,
    cnpj,
    slug,
    empresa_endereco,
    empresa_telefone,
    empresa_cidade,
    empresa_estado,
    cor_primaria,
    cor_secundaria,
    ativa
) VALUES (
    'E4',
    'Taxi Sul',
    '45.678.901/0001-40',
    'taxi-sul',
    'Av. Atlântica, 2000 - Copacabana',
    '(21) 99999-0004',
    'Rio de Janeiro',
    'RJ',
    '#DC2626',
    '#EF4444',
    true
) ON CONFLICT (id_empresa) DO UPDATE SET
    empresa_nome = EXCLUDED.empresa_nome,
    slug = EXCLUDED.slug;

-- ========================================
-- VERIFICAR EMPRESAS CRIADAS
-- ========================================

SELECT 
    id_empresa,
    empresa_nome,
    slug,
    empresa_telefone,
    ativa
FROM public.empresas
WHERE id_empresa IN ('E1', 'E2', 'E3', 'E4')
ORDER BY id_empresa;

-- ========================================
-- OBSERVAÇÕES IMPORTANTES
-- ========================================

-- 1. Os USUÁRIOS serão criados via interface de cadastro do sistema
--    porque precisam ter conta no Supabase Auth primeiro!

-- 2. Após criar cada usuário, você precisa vinculá-lo à empresa via:
--    INSERT INTO empresa_associada (uid_usuario, id_empresa, funcao)

-- 3. Para criar usuários via script, você precisaria usar a API do Supabase Auth
--    que requer a SERVICE_ROLE_KEY e um script Node.js

-- 4. RECOMENDAÇÃO: 
--    a) Crie os emails na Hostinger
--    b) Use a interface /cadastro para criar cada conta
--    c) Como admin, vincule os usuários às empresas

-- ========================================
-- PRÓXIMO PASSO: CRIAR SCRIPT NODE.JS
-- ========================================
-- Vou criar um script Node.js para automatizar a criação dos usuários
-- com Supabase Auth + vincular às empresas

