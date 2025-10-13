-- ========================================
-- SONDAGEM 02: VERIFICAR ESTRUTURA DAS TABELAS
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- DICA: Execute cada bloco separadamente para melhor visualização
-- ========================================

-- 1. VER TODAS AS COLUNAS DE TODAS AS TABELAS
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 2. VER CONSTRAINTS (Chaves Primárias, Estrangeiras, etc)
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_type;

-- 3. ESTRUTURA DA TABELA empresas (se existir)
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'empresas'
ORDER BY ordinal_position;

-- 4. ESTRUTURA DA TABELA usuarios (se existir)
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'usuarios'
ORDER BY ordinal_position;

-- 5. ESTRUTURA DA TABELA corridas (se existir)
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'corridas'
ORDER BY ordinal_position;




