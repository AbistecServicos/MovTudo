-- Verificar se tabela corridas foi criada corretamente

-- 1. Total de registros
SELECT 
  '✅ TOTAL' as status,
  COUNT(*) as total_corridas
FROM corridas;

-- 2. Estrutura completa
SELECT 
  '✅ ESTRUTURA' as info,
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'corridas'
ORDER BY ordinal_position;

-- 3. Índices criados
SELECT 
  '✅ ÍNDICES' as status,
  indexname as nome_indice
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'corridas';


