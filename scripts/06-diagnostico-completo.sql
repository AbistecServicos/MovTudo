-- ========================================
-- SONDAGEM 06: DIAGNÓSTICO COMPLETO DO BANCO
-- ========================================
-- Execute este script para obter um resumo completo
-- ========================================

-- 1. ESTATÍSTICAS GERAIS
SELECT 
    '📊 ESTATÍSTICAS GERAIS DO BANCO' AS secao,
    '' AS info
UNION ALL
SELECT 
    '  • Total de tabelas public:',
    COUNT(*)::TEXT
FROM pg_tables
WHERE schemaname = 'public'
UNION ALL
SELECT 
    '  • Total de funções:',
    COUNT(*)::TEXT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.prokind = 'f'
UNION ALL
SELECT 
    '  • Total de triggers:',
    COUNT(DISTINCT trigger_name)::TEXT
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 
    '  • Total de índices:',
    COUNT(*)::TEXT
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    '  • Total de políticas RLS:',
    COUNT(*)::TEXT
FROM pg_policies
WHERE schemaname = 'public'
UNION ALL
SELECT 
    '  • Total de usuários Auth:',
    COUNT(*)::TEXT
FROM auth.users;

-- 2. TAMANHO DO BANCO
SELECT 
    '💾 TAMANHO DO BANCO DE DADOS' AS secao,
    pg_size_pretty(pg_database_size(current_database())) AS tamanho_total;

-- 3. MAIORES TABELAS
SELECT 
    '📦 5 MAIORES TABELAS' AS secao,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 5;

-- 4. VERIFICAR PROBLEMAS COMUNS
SELECT 
    '⚠️ VERIFICAÇÃO DE PROBLEMAS' AS secao,
    '' AS problema;

-- Tabelas sem RLS
SELECT 
    '  TABELAS SEM RLS:' AS tipo,
    string_agg(tablename, ', ') AS tabelas
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false
UNION ALL
-- Tabelas sem chave primária
SELECT 
    '  TABELAS SEM PRIMARY KEY:',
    string_agg(table_name, ', ')
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
  AND NOT EXISTS (
      SELECT 1
      FROM information_schema.table_constraints tc
      WHERE tc.table_schema = t.table_schema
        AND tc.table_name = t.table_name
        AND tc.constraint_type = 'PRIMARY KEY'
  );

-- 5. CONFIGURAÇÕES IMPORTANTES
SELECT 
    '⚙️ CONFIGURAÇÕES DO POSTGRES' AS secao,
    name,
    setting,
    unit
FROM pg_settings
WHERE name IN (
    'max_connections',
    'shared_buffers',
    'effective_cache_size',
    'maintenance_work_mem',
    'checkpoint_completion_target',
    'wal_buffers',
    'default_statistics_target',
    'random_page_cost',
    'effective_io_concurrency'
)
ORDER BY name;

-- 6. ATIVIDADE RECENTE
SELECT 
    '🔄 ATIVIDADE RECENTE (últimas queries)' AS secao,
    usename,
    datname,
    state,
    query_start,
    LEFT(query, 100) AS query_preview
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid != pg_backend_pid()
ORDER BY query_start DESC
LIMIT 5;




