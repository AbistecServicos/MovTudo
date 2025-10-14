-- ============================================
-- SCRIPT: Adicionar Campos de Classificação do Transportador
-- DESCRIÇÃO: Adiciona campos específicos para classificar transportadores
--           por tipo de veículo, carga e serviço
-- ============================================

-- Adicionar novos campos à tabela empresa_associada
ALTER TABLE empresa_associada 
ADD COLUMN IF NOT EXISTS tipo_veiculo VARCHAR(50),
ADD COLUMN IF NOT EXISTS modelo_veiculo VARCHAR(100),
ADD COLUMN IF NOT EXISTS ano_veiculo INTEGER,
ADD COLUMN IF NOT EXISTS placa_veiculo VARCHAR(10),
ADD COLUMN IF NOT EXISTS tipos_carga TEXT[],
ADD COLUMN IF NOT EXISTS equipamentos TEXT[],
ADD COLUMN IF NOT EXISTS tipo_servico VARCHAR(50),
ADD COLUMN IF NOT EXISTS horarios_disponibilidade TEXT;

-- Comentários para documentação
COMMENT ON COLUMN empresa_associada.tipo_veiculo IS 'Tipo do veículo: moto, caminhao, van, carro, bicicleta';
COMMENT ON COLUMN empresa_associada.modelo_veiculo IS 'Modelo específico do veículo: Honda CB 600F, Mercedes Actros, etc';
COMMENT ON COLUMN empresa_associada.ano_veiculo IS 'Ano de fabricação do veículo';
COMMENT ON COLUMN empresa_associada.placa_veiculo IS 'Placa do veículo';
COMMENT ON COLUMN empresa_associada.tipos_carga IS 'Array de tipos de carga que o transportador pode carregar';
COMMENT ON COLUMN empresa_associada.equipamentos IS 'Array de equipamentos disponíveis no veículo';
COMMENT ON COLUMN empresa_associada.tipo_servico IS 'Tipo de serviço: entrega, frete, passageiro';
COMMENT ON COLUMN empresa_associada.horarios_disponibilidade IS 'Horários de disponibilidade: 24h, comercial, personalizado';

-- Atualizar dados existentes com valores padrão baseados no email
UPDATE empresa_associada 
SET 
  tipo_veiculo = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e2%' OR 
                                   email LIKE '%transportador2.e2%'
    ) THEN 'caminhao'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%' OR 
                                   email LIKE '%transportador2.e1%'
    ) THEN 'moto'
    ELSE 'veiculo'
  END,
  
  modelo_veiculo = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador1.e2@abistec.com.br'
    ) THEN 'Mercedes-Benz Actros 2651'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador2.e2@abistec.com.br'
    ) THEN 'Volvo FH 540'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador1.e1@abistec.com.br'
    ) THEN 'Honda CB 600F'
    ELSE 'Modelo não especificado'
  END,
  
  ano_veiculo = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e2%'
    ) THEN 2020
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador2.e2%'
    ) THEN 2019
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%'
    ) THEN 2021
    ELSE 2020
  END,
  
  placa_veiculo = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador1.e2@abistec.com.br'
    ) THEN 'ABC-1234'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador2.e2@abistec.com.br'
    ) THEN 'DEF-5678'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador1.e1@abistec.com.br'
    ) THEN 'GHI-9012'
    ELSE 'XXX-0000'
  END,
  
  tipos_carga = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e2%' OR 
                                   email LIKE '%transportador2.e2%'
    ) THEN ARRAY['bebidas', 'alimentos', 'construção']
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%' OR 
                                   email LIKE '%transportador2.e1%'
    ) THEN ARRAY['documentos', 'comida', 'pequenos_pacotes']
    ELSE ARRAY['geral']
  END,
  
  equipamentos = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador1.e2@abistec.com.br'
    ) THEN ARRAY['carregadeira', 'guincho']
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email = 'transportador2.e2@abistec.com.br'
    ) THEN ARRAY['carregadeira', 'guincho', 'refrigeracao']
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%' OR 
                                   email LIKE '%transportador2.e1%'
    ) THEN ARRAY['baú', 'cadeado']
    ELSE ARRAY['básico']
  END,
  
  tipo_servico = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e2%' OR 
                                   email LIKE '%transportador2.e2%'
    ) THEN 'frete'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%' OR 
                                   email LIKE '%transportador2.e1%'
    ) THEN 'entrega'
    ELSE 'geral'
  END,
  
  horarios_disponibilidade = CASE 
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e2%' OR 
                                   email LIKE '%transportador2.e2%'
    ) THEN 'comercial'
    WHEN uid_usuario IN (
      SELECT uid FROM usuarios WHERE email LIKE '%transportador1.e1%' OR 
                                   email LIKE '%transportador2.e1%'
    ) THEN '24h'
    ELSE 'comercial'
  END
WHERE tipo_veiculo IS NULL;

-- Verificar os dados inseridos
SELECT 
  ea.nome_completo,
  ea.empresa_nome,
  ea.tipo_veiculo,
  ea.modelo_veiculo,
  ea.ano_veiculo,
  ea.placa_veiculo,
  ea.tipos_carga,
  ea.equipamentos,
  ea.tipo_servico,
  ea.horarios_disponibilidade
FROM empresa_associada ea
WHERE ea.tipo_veiculo IS NOT NULL
ORDER BY ea.empresa_nome, ea.nome_completo;

-- Mensagem de sucesso
SELECT '✅ Campos de classificação do transportador adicionados com sucesso!' as status;
