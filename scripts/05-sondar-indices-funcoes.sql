-- ========================================
-- SONDAGEM 05: VERIFICAR ÍNDICES, FUNÇÕES E TRIGGERS
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- ========================================

-- 1. LISTAR TODOS OS ÍNDICES
SELECT 
    '📑 ÍNDICES EXISTENTES' AS secao,
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 2. PERFORMANCE DOS ÍNDICES
SELECT 
    '📊 PERFORMANCE DOS ÍNDICES' AS secao,
    schemaname,
    tablename,
    indexname,
    idx_scan AS vezes_usado,
    idx_tup_read AS linhas_lidas,
    idx_tup_fetch AS linhas_retornadas
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- 3. LISTAR TODAS AS FUNÇÕES CUSTOMIZADAS
SELECT 
    '⚙️ FUNÇÕES CUSTOMIZADAS' AS secao,
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;

-- 4. LISTAR TODOS OS TRIGGERS
SELECT 
    '🔔 TRIGGERS EXISTENTES' AS secao,
    trigger_name,
    event_manipulation AS event,
    event_object_table AS table_name,
    action_timing AS timing,
    action_orientation AS orientation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 5. VERIFICAR EXTENSÕES INSTALADAS
SELECT 
    '🔌 EXTENSÕES POSTGRES' AS secao,
    extname AS extension_name,
    extversion AS version
FROM pg_extension
ORDER BY extname;




