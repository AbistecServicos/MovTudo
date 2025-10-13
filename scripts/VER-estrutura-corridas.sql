-- Ver estrutura atual da tabela corridas
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'corridas'
ORDER BY ordinal_position;

-- Ver quantos registros existem
SELECT COUNT(*) as total FROM corridas;


