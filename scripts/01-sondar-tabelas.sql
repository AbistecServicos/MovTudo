-- ========================================
-- SONDAGEM 01: VERIFICAR TABELAS EXISTENTES
-- ========================================
-- Execute este script no SQL Editor do Supabase
-- ========================================

-- 1. LISTAR TODAS AS TABELAS
SELECT 
    '📋 TABELAS EXISTENTES' AS secao,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. VERIFICAR EXISTÊNCIA DAS TABELAS PRINCIPAIS
SELECT 
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'empresas') 
        THEN '✅ empresas' 
        ELSE '❌ empresas - FALTA CRIAR' END as table_empresas,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'usuarios') 
        THEN '✅ usuarios' 
        ELSE '❌ usuarios - FALTA CRIAR' END as table_usuarios,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'empresa_associada') 
        THEN '✅ empresa_associada' 
        ELSE '❌ empresa_associada - FALTA CRIAR' END as table_empresa_associada,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'corridas') 
        THEN '✅ corridas' 
        ELSE '❌ corridas - FALTA CRIAR' END as table_corridas,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'precos') 
        THEN '✅ precos' 
        ELSE '❌ precos - FALTA CRIAR' END as table_precos,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'notificacoes') 
        THEN '✅ notificacoes' 
        ELSE '❌ notificacoes - FALTA CRIAR' END as table_notificacoes;

-- 3. VERIFICAR TABELAS TELEGRAM
SELECT 
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_config') 
        THEN '✅ telegram_config' 
        ELSE '❌ telegram_config - FALTA CRIAR' END as table_telegram_config,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_transportadores') 
        THEN '✅ telegram_transportadores' 
        ELSE '❌ telegram_transportadores - FALTA CRIAR' END as table_telegram_transportadores,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_notifications') 
        THEN '✅ telegram_notifications' 
        ELSE '❌ telegram_notifications - FALTA CRIAR' END as table_telegram_notifications,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_templates') 
        THEN '✅ telegram_templates' 
        ELSE '❌ telegram_templates - FALTA CRIAR' END as table_telegram_templates;




