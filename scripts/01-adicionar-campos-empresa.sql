-- =====================================================
-- ADICIONAR CAMPOS: tipo_empresa e servicos_oferecidos
-- Tabela: empresas
-- =====================================================

-- PASSO 1: Adicionar campo tipo_empresa
-- ----------------------------------------
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS tipo_empresa TEXT 
CHECK (tipo_empresa IN ('taxi', 'transportadora', 'delivery', 'multisservico'))
DEFAULT 'taxi';

-- PASSO 2: Adicionar campo servicos_oferecidos (array)
-- ------------------------------------------------------
ALTER TABLE empresas 
ADD COLUMN IF NOT EXISTS servicos_oferecidos TEXT[] 
DEFAULT ARRAY['passageiro', 'objeto']::TEXT[];

-- PASSO 3: Atualizar empresa existente (Moto Taxi Express)
-- ----------------------------------------------------------
UPDATE empresas 
SET 
  tipo_empresa = 'taxi',
  servicos_oferecidos = ARRAY['passageiro', 'objeto']::TEXT[]
WHERE id_empresa = 'E1';

-- PASSO 4: Verificar se foi aplicado
-- -----------------------------------
SELECT 
  '✅ CAMPOS ADICIONADOS' as status,
  id_empresa,
  empresa_nome,
  tipo_empresa,
  servicos_oferecidos
FROM empresas
WHERE id_empresa = 'E1';

-- PASSO 5: Ver estrutura completa da tabela
-- ------------------------------------------
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'empresas'
ORDER BY ordinal_position;


