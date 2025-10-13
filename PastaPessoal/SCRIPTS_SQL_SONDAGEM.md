# 🔍 SCRIPTS SQL PARA SONDAGEM DO BANCO - MovTudo

**Data:** 12 de outubro de 2025
**Objetivo:** Scripts para verificar a estrutura atual do banco Supabase

---

## 📋 ÍNDICE

1. [Verificar Tabelas Existentes](#1-verificar-tabelas-existentes)
2. [Verificar Estrutura das Tabelas](#2-verificar-estrutura-das-tabelas)
3. [Verificar Políticas RLS](#3-verificar-políticas-rls)
4. [Verificar Índices](#4-verificar-índices)
5. [Verificar Funções](#5-verificar-funções)
6. [Verificar Triggers](#6-verificar-triggers)
7. [Verificar Dados](#7-verificar-dados)
8. [Verificar Storage](#8-verificar-storage)

---

## 1️⃣ VERIFICAR TABELAS EXISTENTES

### Listar todas as tabelas do schema public:

```sql
-- Listar tabelas com contagem de registros
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS tamanho
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Verificar se tabelas principais existem:

```sql
-- Verificar existência das tabelas principais
SELECT 
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'empresas') 
        THEN '✅ empresas' 
        ELSE '❌ empresas' END as table_empresas,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'usuarios') 
        THEN '✅ usuarios' 
        ELSE '❌ usuarios' END as table_usuarios,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'empresa_associada') 
        THEN '✅ empresa_associada' 
        ELSE '❌ empresa_associada' END as table_empresa_associada,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'corridas') 
        THEN '✅ corridas' 
        ELSE '❌ corridas' END as table_corridas,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'precos') 
        THEN '✅ precos' 
        ELSE '❌ precos' END as table_precos,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'notificacoes') 
        THEN '✅ notificacoes' 
        ELSE '❌ notificacoes' END as table_notificacoes,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_config') 
        THEN '✅ telegram_config' 
        ELSE '❌ telegram_config' END as table_telegram_config,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_transportadores') 
        THEN '✅ telegram_transportadores' 
        ELSE '❌ telegram_transportadores' END as table_telegram_transportadores,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_notifications') 
        THEN '✅ telegram_notifications' 
        ELSE '❌ telegram_notifications' END as table_telegram_notifications,
    
    CASE WHEN EXISTS (SELECT FROM pg_tables WHERE tablename = 'telegram_templates') 
        THEN '✅ telegram_templates' 
        ELSE '❌ telegram_templates' END as table_telegram_templates;
```

---

## 2️⃣ VERIFICAR ESTRUTURA DAS TABELAS

### Ver estrutura completa de uma tabela:

```sql
-- Substituir 'empresas' pelo nome da tabela desejada
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    column_default,
    is_nullable,
    is_identity,
    identity_generation
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'empresas'
ORDER BY ordinal_position;
```

### Ver todas as colunas de todas as tabelas:

```sql
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### Ver constraints (chaves primárias, estrangeiras, etc):

```sql
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
```

---

## 3️⃣ VERIFICAR POLÍTICAS RLS

### Verificar se RLS está habilitado:

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

### Listar todas as políticas RLS:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Ver políticas de uma tabela específica:

```sql
-- Substituir 'empresas' pelo nome da tabela
SELECT 
    policyname,
    permissive,
    roles,
    cmd AS operation,
    qual AS using_clause,
    with_check AS with_check_clause
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'empresas';
```

---

## 4️⃣ VERIFICAR ÍNDICES

### Listar todos os índices:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### Ver índices de uma tabela específica:

```sql
-- Substituir 'corridas' pelo nome da tabela
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'corridas'
ORDER BY indexname;
```

### Verificar performance dos índices:

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 5️⃣ VERIFICAR FUNÇÕES

### Listar todas as funções customizadas:

```sql
SELECT 
    n.nspname AS schema_name,
    p.proname AS function_name,
    pg_get_function_arguments(p.oid) AS arguments,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
ORDER BY p.proname;
```

### Ver detalhes de uma função específica:

```sql
-- Substituir 'calcular_preco_corrida' pelo nome da função
SELECT 
    proname AS function_name,
    pg_get_function_arguments(oid) AS arguments,
    pg_get_functiondef(oid) AS definition
FROM pg_proc
WHERE proname = 'calcular_preco_corrida'
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
```

---

## 6️⃣ VERIFICAR TRIGGERS

### Listar todos os triggers:

```sql
SELECT 
    trigger_name,
    event_manipulation AS event,
    event_object_table AS table_name,
    action_statement,
    action_timing AS timing,
    action_orientation AS orientation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

### Ver triggers de uma tabela específica:

```sql
-- Substituir 'empresas' pelo nome da tabela
SELECT 
    trigger_name,
    event_manipulation AS event,
    action_statement,
    action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table = 'empresas'
ORDER BY trigger_name;
```

---

## 7️⃣ VERIFICAR DADOS

### Contagem de registros por tabela:

```sql
-- Empresas
SELECT 'empresas' AS tabela, COUNT(*) AS total FROM empresas
UNION ALL
SELECT 'usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'empresa_associada', COUNT(*) FROM empresa_associada
UNION ALL
SELECT 'corridas', COUNT(*) FROM corridas
UNION ALL
SELECT 'precos', COUNT(*) FROM precos
UNION ALL
SELECT 'notificacoes', COUNT(*) FROM notificacoes
UNION ALL
SELECT 'telegram_config', COUNT(*) FROM telegram_config
UNION ALL
SELECT 'telegram_transportadores', COUNT(*) FROM telegram_transportadores
UNION ALL
SELECT 'telegram_notifications', COUNT(*) FROM telegram_notifications
UNION ALL
SELECT 'telegram_templates', COUNT(*) FROM telegram_templates;
```

### Verificar dados das empresas:

```sql
SELECT 
    id,
    nome,
    slug,
    cidade,
    ativo,
    data_criacao,
    (SELECT COUNT(*) FROM empresa_associada WHERE empresa_id = empresas.id) as total_usuarios,
    (SELECT COUNT(*) FROM corridas WHERE empresa_id = empresas.id) as total_corridas
FROM empresas
ORDER BY data_criacao DESC;
```

### Verificar usuários e suas empresas:

```sql
SELECT 
    u.id,
    u.nome,
    u.email,
    ea.funcao,
    e.nome as empresa_nome,
    ea.status_vinculacao,
    u.ativo
FROM usuarios u
LEFT JOIN empresa_associada ea ON ea.uid_usuario = u.id
LEFT JOIN empresas e ON e.id = ea.empresa_id
ORDER BY u.data_criacao DESC
LIMIT 20;
```

### Verificar corridas recentes:

```sql
SELECT 
    c.id,
    c.tipo,
    c.status,
    e.nome as empresa,
    u_cliente.nome as cliente,
    u_transp.nome as transportador,
    c.distancia_km,
    c.preco_total,
    c.data_criacao,
    c.data_conclusao
FROM corridas c
JOIN empresas e ON e.id = c.empresa_id
LEFT JOIN usuarios u_cliente ON u_cliente.id = c.cliente_id
LEFT JOIN usuarios u_transp ON u_transp.id = c.transportador_id
ORDER BY c.data_criacao DESC
LIMIT 20;
```

### Verificar configurações de preços:

```sql
SELECT 
    e.nome as empresa,
    p.tipo_servico,
    p.tipo_veiculo,
    p.preco_base,
    p.preco_por_km,
    p.preco_minimo,
    p.taxa_noturna,
    p.ativo
FROM precos p
JOIN empresas e ON e.id = p.empresa_id
ORDER BY e.nome, p.tipo_servico, p.tipo_veiculo;
```

---

## 8️⃣ VERIFICAR STORAGE

### Listar buckets do Storage:

```sql
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets
ORDER BY name;
```

### Verificar arquivos em um bucket:

```sql
-- Substituir 'logos' pelo nome do bucket
SELECT 
    name,
    bucket_id,
    owner,
    created_at,
    updated_at,
    pg_size_pretty(
        (metadata->>'size')::bigint
    ) as size
FROM storage.objects
WHERE bucket_id = 'logos'
ORDER BY created_at DESC
LIMIT 20;
```

### Ver políticas do Storage:

```sql
SELECT 
    policyname,
    tablename,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'storage'
ORDER BY tablename, policyname;
```

---

## 🔧 SCRIPTS DE DIAGNÓSTICO

### Diagnóstico completo do banco:

```sql
-- Resumo geral do banco de dados
SELECT 
    '📊 ESTATÍSTICAS GERAIS' AS secao,
    '' AS info
UNION ALL
SELECT 
    '  Total de tabelas:',
    COUNT(*)::TEXT
FROM pg_tables
WHERE schemaname = 'public'
UNION ALL
SELECT 
    '  Total de funções:',
    COUNT(*)::TEXT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.prokind = 'f'
UNION ALL
SELECT 
    '  Total de triggers:',
    COUNT(DISTINCT trigger_name)::TEXT
FROM information_schema.triggers
WHERE trigger_schema = 'public'
UNION ALL
SELECT 
    '  Total de índices:',
    COUNT(*)::TEXT
FROM pg_indexes
WHERE schemaname = 'public'
UNION ALL
SELECT 
    '  Total de políticas RLS:',
    COUNT(*)::TEXT
FROM pg_policies
WHERE schemaname = 'public';
```

### Verificar problemas comuns:

```sql
-- Tabelas sem RLS habilitado
SELECT 
    '⚠️ TABELAS SEM RLS' AS alerta,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```

```sql
-- Tabelas sem índices (exceto as muito pequenas)
SELECT 
    '⚠️ TABELAS SEM ÍNDICES' AS alerta,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN (
      SELECT DISTINCT tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public'
  );
```

---

## 📝 COMO USAR ESTES SCRIPTS

1. **Acesse o SQL Editor do Supabase:**
   - Dashboard do Supabase → SQL Editor → New Query

2. **Copie e cole os scripts acima**

3. **Execute e analise os resultados**

4. **Documente os resultados** no arquivo `RESULTADO_SONDAGEM.md`

---

## 🎯 PRÓXIMOS PASSOS APÓS SONDAGEM

1. Comparar estrutura atual com estrutura planejada
2. Identificar tabelas que faltam criar
3. Identificar colunas que faltam adicionar
4. Verificar políticas RLS que precisam ser criadas
5. Criar migrations para ajustar o banco
6. Testar as mudanças em ambiente de desenvolvimento

---

## ⚠️ AVISOS IMPORTANTES

- **NUNCA** execute scripts de modificação (DROP, DELETE, UPDATE) sem backup
- Sempre teste em ambiente de desenvolvimento primeiro
- Documente todas as mudanças realizadas
- Mantenha backup das queries importantes




