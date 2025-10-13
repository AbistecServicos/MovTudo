-- ========================================
-- CRIAR PRIMEIRA EMPRESA E USUÁRIOS
-- ========================================
-- Execute cada bloco separadamente
-- ========================================

-- BLOCO 1: CRIAR A EMPRESA "MOTO TAXI EXPRESS"
INSERT INTO empresas (
    id_empresa,
    empresa_nome,
    cnpj,
    empresa_endereco,
    empresa_telefone,
    empresa_cidade,
    empresa_estado,
    empresa_perimetro_entrega,
    slug,
    cor_primaria,
    cor_secundaria,
    sobre_empresa,
    ativa
) VALUES (
    'E1',
    'Moto Taxi Express',
    '12.345.678/0001-90',
    'Rua das Flores, 123 - Centro',
    '(21) 99999-9999',
    'Rio de Janeiro',
    'RJ',
    'Zona Sul e Centro',
    'moto-taxi-express',
    '#FF6B35',
    '#2ECC71',
    'Sua empresa de moto-táxi confiável no Rio de Janeiro. Entregas rápidas e seguras.',
    true
);

-- BLOCO 2: VERIFICAR SE A EMPRESA FOI CRIADA
SELECT 
    '🏢 EMPRESA CRIADA' AS secao,
    *
FROM empresas
WHERE id_empresa = 'E1';






