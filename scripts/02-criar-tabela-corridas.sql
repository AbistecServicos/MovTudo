-- =====================================================
-- CRIAR TABELA: corridas
-- Sistema MovTudo - Pedidos/Corridas de Transporte
-- =====================================================

-- PASSO 1: Criar tabela corridas
-- -------------------------------
CREATE TABLE IF NOT EXISTS corridas (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_empresa TEXT NOT NULL,
    
    -- CLIENTE (UID NULLABLE para visitantes!)
    cliente_uid UUID,                           -- NULL se visitante
    nome_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    telefone_cliente TEXT NOT NULL,
    
    -- TIPO DE SERVIÇO
    tipo TEXT NOT NULL CHECK (tipo IN ('passageiro', 'objeto', 'carga')),
    
    -- ENDEREÇOS
    origem_endereco TEXT NOT NULL,
    origem_lat DOUBLE PRECISION,
    origem_lng DOUBLE PRECISION,
    destino_endereco TEXT NOT NULL,
    destino_lat DOUBLE PRECISION,
    destino_lng DOUBLE PRECISION,
    
    -- CÁLCULOS
    distancia_km DOUBLE PRECISION,
    tempo_estimado_min INTEGER,
    preco_calculado NUMERIC(10,2),
    
    -- DETALHES DO OBJETO (se tipo = 'objeto' ou 'carga')
    descricao_objeto TEXT,
    peso_kg DOUBLE PRECISION,
    foto_objeto_url TEXT,
    
    -- STATUS E ACEITE
    status_transporte TEXT DEFAULT 'aguardando' CHECK (
      status_transporte IN ('aguardando', 'aceito', 'coletando', 'em_rota', 'entregue', 'cancelado')
    ),
    
    -- TRANSPORTADOR (quando aceita)
    aceito_por_uid UUID,
    aceito_por_nome TEXT DEFAULT 'Nome não especificado',
    aceito_por_email TEXT DEFAULT 'Email não especificado',
    aceito_por_telefone TEXT DEFAULT 'Telefone não especificado',
    
    -- PAGAMENTO
    forma_pagamento TEXT,
    frete_oferecido NUMERIC(10,2),
    frete_pago NUMERIC(10,2),
    status_pagamento BOOLEAN DEFAULT FALSE,
    data_pagamento DATE,
    
    -- OBSERVAÇÕES
    observacao_cliente TEXT,
    empresa_obs TEXT,
    
    -- DADOS DA EMPRESA (duplicados para performance)
    empresa_nome TEXT,
    empresa_telefone TEXT,
    empresa_endereco TEXT,
    
    -- AVALIAÇÕES
    nota_cliente INTEGER CHECK (nota_cliente >= 1 AND nota_cliente <= 5),
    comentario_cliente TEXT,
    nota_transportador INTEGER CHECK (nota_transportador >= 1 AND nota_transportador <= 5),
    comentario_transportador TEXT,
    
    -- TIMESTAMPS
    data TIMESTAMP DEFAULT NOW(),
    ultimo_status TIMESTAMP DEFAULT NOW(),
    data_aceite TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_cancelamento TIMESTAMP,
    
    -- FOREIGN KEYS
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
    FOREIGN KEY (cliente_uid) REFERENCES usuarios(uid) ON DELETE SET NULL,
    FOREIGN KEY (aceito_por_uid) REFERENCES usuarios(uid) ON DELETE SET NULL
);

-- PASSO 2: Criar índices para performance
-- ----------------------------------------
CREATE INDEX IF NOT EXISTS idx_corridas_empresa ON corridas(id_empresa);
CREATE INDEX IF NOT EXISTS idx_corridas_cliente ON corridas(cliente_uid);
CREATE INDEX IF NOT EXISTS idx_corridas_transportador ON corridas(aceito_por_uid);
CREATE INDEX IF NOT EXISTS idx_corridas_status ON corridas(status_transporte);
CREATE INDEX IF NOT EXISTS idx_corridas_data ON corridas(data);
CREATE INDEX IF NOT EXISTS idx_corridas_email ON corridas(email_cliente);

-- PASSO 3: Criar políticas RLS
-- -----------------------------

-- Habilitar RLS
ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;

-- 3.1) ADMIN vê todas as corridas
CREATE POLICY "Admins podem ver todas corridas"
ON corridas
FOR SELECT
USING (is_admin());

-- 3.2) GERENTE vê corridas da SUA empresa
CREATE POLICY "Gerentes podem ver corridas da sua empresa"
ON corridas
FOR SELECT
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'gerente'
      AND status_vinculacao = 'ativo'
  )
);

-- 3.3) TRANSPORTADOR vê corridas das SUAS empresas
CREATE POLICY "Transportadores podem ver corridas das suas empresas"
ON corridas
FOR SELECT
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'transportador'
      AND status_vinculacao = 'ativo'
  )
);

-- 3.4) CLIENTE LOGADO vê SUAS corridas
CREATE POLICY "Clientes podem ver suas proprias corridas"
ON corridas
FOR SELECT
USING (cliente_uid = auth.uid());

-- 3.5) VISITANTE pode consultar corrida por EMAIL (para acompanhamento)
-- Implementado na aplicação, não no RLS

-- 3.6) TODOS (clientes logados ou visitantes) podem CRIAR corridas
CREATE POLICY "Todos podem criar corridas"
ON corridas
FOR INSERT
WITH CHECK (true);

-- 3.7) TRANSPORTADOR pode ACEITAR corridas (UPDATE)
CREATE POLICY "Transportadores podem aceitar corridas"
ON corridas
FOR UPDATE
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'transportador'
      AND status_vinculacao = 'ativo'
  )
);

-- 3.8) GERENTE pode editar corridas da empresa
CREATE POLICY "Gerentes podem editar corridas da sua empresa"
ON corridas
FOR UPDATE
USING (
  id_empresa IN (
    SELECT id_empresa 
    FROM empresa_associada 
    WHERE uid_usuario = auth.uid()
      AND funcao = 'gerente'
      AND status_vinculacao = 'ativo'
  )
);

-- 3.9) ADMIN pode editar todas as corridas
CREATE POLICY "Admins podem editar todas corridas"
ON corridas
FOR UPDATE
USING (is_admin());

-- PASSO 4: Verificar criação
-- ---------------------------
SELECT 
  '✅ TABELA CORRIDAS CRIADA' as status,
  COUNT(*) as total_corridas
FROM corridas;

-- Ver políticas RLS
SELECT 
  '✅ POLÍTICAS RLS' as status,
  policyname as nome,
  cmd as operacao
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'corridas'
ORDER BY cmd, policyname;


