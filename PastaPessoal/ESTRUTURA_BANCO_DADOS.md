# 🗄️ ESTRUTURA DO BANCO DE DADOS - MovTudo

**Última atualização:** 12 de outubro de 2025

---

## 📊 VISÃO GERAL

Este documento descreve a estrutura completa do banco de dados Supabase para o projeto MovTudo.

---

## 🏗️ DIAGRAMA DE RELACIONAMENTOS

```
usuarios (1) ←→ (N) empresa_associada (N) ←→ (1) empresas
    ↓                                              ↓
    ↓                                              ↓
    └──────────→ corridas ←────────────────────────┘
                   ↓
                   ↓
                precos ←──── empresas
```

---

## 📋 TABELAS PRINCIPAIS

### 1️⃣ **empresas**

Armazena as empresas de transporte cadastradas no sistema.

```sql
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    cidade TEXT NOT NULL,
    estado TEXT,
    telefone TEXT,
    email TEXT,
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW(),
    
    -- Configurações específicas
    config JSONB DEFAULT '{}'::jsonb,
    
    -- Metadados
    criado_por UUID REFERENCES auth.users(id),
    
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Índices
CREATE INDEX idx_empresas_slug ON empresas(slug);
CREATE INDEX idx_empresas_ativo ON empresas(ativo);
CREATE INDEX idx_empresas_cidade ON empresas(cidade);
```

**Campos:**
- `id`: Identificador único (UUID)
- `nome`: Nome da empresa (ex: "Moto-Táxi Express")
- `slug`: Identificador para URLs (ex: "mototaxi-express")
- `logo_url`: URL do logo no Supabase Storage
- `cidade`: Cidade de operação
- `ativo`: Status da empresa (ativa/inativa)
- `config`: Configurações em JSON (horário de funcionamento, etc.)

---

### 2️⃣ **usuarios** (complementar ao auth.users)

Informações complementares aos usuários do Supabase Auth.

```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    telefone TEXT,
    cpf TEXT UNIQUE,
    foto_url TEXT,
    ativo BOOLEAN DEFAULT true,
    telegram_id TEXT,
    
    -- Metadados
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW(),
    ultimo_acesso TIMESTAMP,
    
    -- Avaliação (para transportadores)
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0
);

-- Índices
CREATE INDEX idx_usuarios_telefone ON usuarios(telefone);
CREATE INDEX idx_usuarios_telegram ON usuarios(telegram_id);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
```

---

### 3️⃣ **empresa_associada**

Relacionamento entre usuários e empresas (um usuário pode estar em várias empresas).

```sql
CREATE TABLE empresa_associada (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid_usuario UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    funcao TEXT NOT NULL CHECK (funcao IN ('cliente', 'transportador', 'gerente', 'admin')),
    status_vinculacao TEXT DEFAULT 'ativo' CHECK (status_vinculacao IN ('ativo', 'inativo', 'bloqueado')),
    
    -- Datas
    data_vinculacao TIMESTAMP DEFAULT NOW(),
    data_desvinculacao TIMESTAMP,
    
    -- Metadados
    vinculado_por UUID REFERENCES auth.users(id),
    motivo_desvinculacao TEXT,
    
    UNIQUE(uid_usuario, empresa_id)
);

-- Índices
CREATE INDEX idx_empresa_assoc_usuario ON empresa_associada(uid_usuario);
CREATE INDEX idx_empresa_assoc_empresa ON empresa_associada(empresa_id);
CREATE INDEX idx_empresa_assoc_funcao ON empresa_associada(funcao);
CREATE INDEX idx_empresa_assoc_status ON empresa_associada(status_vinculacao);
```

**Funções possíveis:**
- `cliente`: Pode solicitar corridas
- `transportador`: Recebe e executa corridas
- `gerente`: Gerencia a empresa (cadastra transportadores, define preços)
- `admin`: Administrador global (gerencia todas as empresas)

---

### 4️⃣ **corridas**

Registro de todas as corridas/pedidos de transporte.

```sql
CREATE TABLE corridas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id),
    cliente_id UUID NOT NULL REFERENCES auth.users(id),
    transportador_id UUID REFERENCES auth.users(id),
    
    -- Tipo de serviço
    tipo TEXT NOT NULL CHECK (tipo IN ('passageiro', 'objeto')),
    tipo_veiculo TEXT CHECK (tipo_veiculo IN ('moto', 'carro', 'van', 'caminhao')),
    
    -- Localização
    origem JSONB NOT NULL, -- {endereco, lat, lng, complemento}
    destino JSONB NOT NULL, -- {endereco, lat, lng, complemento}
    
    -- Cálculos
    distancia_km DECIMAL(10,2),
    tempo_estimado_minutos INTEGER,
    preco_base DECIMAL(10,2),
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    preco_total DECIMAL(10,2) NOT NULL,
    
    -- Status da corrida
    status TEXT DEFAULT 'pendente' CHECK (
        status IN ('pendente', 'aceita', 'coletado', 'em_transporte', 'entregue', 'concluida', 'cancelada')
    ),
    
    -- Detalhes específicos para objetos
    descricao_objeto TEXT,
    peso_estimado_kg DECIMAL(10,2),
    foto_objeto_url TEXT,
    
    -- Observações e instruções
    observacoes TEXT,
    instrucoes_entrega TEXT,
    
    -- Datas e horários
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_aceite TIMESTAMP,
    data_coleta TIMESTAMP,
    data_entrega TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_cancelamento TIMESTAMP,
    
    -- Informações adicionais
    motivo_cancelamento TEXT,
    cancelado_por UUID REFERENCES auth.users(id),
    
    -- Avaliação
    avaliacao_cliente INTEGER CHECK (avaliacao_cliente >= 1 AND avaliacao_cliente <= 5),
    comentario_cliente TEXT,
    avaliacao_transportador INTEGER CHECK (avaliacao_transportador >= 1 AND avaliacao_transportador <= 5),
    comentario_transportador TEXT
);

-- Índices
CREATE INDEX idx_corridas_empresa ON corridas(empresa_id);
CREATE INDEX idx_corridas_cliente ON corridas(cliente_id);
CREATE INDEX idx_corridas_transportador ON corridas(transportador_id);
CREATE INDEX idx_corridas_status ON corridas(status);
CREATE INDEX idx_corridas_data ON corridas(data_criacao DESC);
CREATE INDEX idx_corridas_tipo ON corridas(tipo);
```

**Status possíveis:**
1. `pendente`: Aguardando aceite de transportador
2. `aceita`: Transportador aceitou a corrida
3. `coletado`: Transportador coletou o passageiro/objeto
4. `em_transporte`: Em trânsito para o destino
5. `entregue`: Chegou ao destino
6. `concluida`: Corrida finalizada
7. `cancelada`: Corrida cancelada

---

### 5️⃣ **precos**

Tabela de preços por empresa e tipo de veículo.

```sql
CREATE TABLE precos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    tipo_servico TEXT NOT NULL CHECK (tipo_servico IN ('passageiro', 'objeto')),
    tipo_veiculo TEXT NOT NULL CHECK (tipo_veiculo IN ('moto', 'carro', 'van', 'caminhao')),
    
    -- Valores
    preco_base DECIMAL(10,2) NOT NULL,
    preco_por_km DECIMAL(10,2) NOT NULL,
    preco_minimo DECIMAL(10,2) NOT NULL,
    
    -- Taxas adicionais
    taxa_noturna DECIMAL(10,2) DEFAULT 0, -- 22h às 6h
    taxa_feriado DECIMAL(10,2) DEFAULT 0,
    taxa_fim_semana DECIMAL(10,2) DEFAULT 0,
    
    -- Horários especiais
    horario_noturno_inicio TIME DEFAULT '22:00:00',
    horario_noturno_fim TIME DEFAULT '06:00:00',
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(empresa_id, tipo_servico, tipo_veiculo)
);

-- Índices
CREATE INDEX idx_precos_empresa ON precos(empresa_id);
CREATE INDEX idx_precos_tipo ON precos(tipo_servico, tipo_veiculo);
CREATE INDEX idx_precos_ativo ON precos(ativo);
```

---

### 6️⃣ **notificacoes**

Histórico de notificações enviadas.

```sql
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES auth.users(id),
    corrida_id UUID REFERENCES corridas(id),
    
    tipo TEXT NOT NULL CHECK (tipo IN ('telegram', 'email', 'push', 'sms')),
    titulo TEXT,
    mensagem TEXT NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'enviada', 'entregue', 'falhou')),
    erro_mensagem TEXT,
    
    -- Metadados
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_envio TIMESTAMP,
    data_leitura TIMESTAMP,
    
    -- Dados adicionais
    dados_adicionais JSONB DEFAULT '{}'::jsonb
);

-- Índices
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_corrida ON notificacoes(corrida_id);
CREATE INDEX idx_notificacoes_status ON notificacoes(status);
CREATE INDEX idx_notificacoes_tipo ON notificacoes(tipo);
```

---

## 🔔 TABELAS TELEGRAM

### 7️⃣ **telegram_config**

Configurações do Telegram por empresa.

```sql
CREATE TABLE telegram_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    
    bot_token TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    chat_type TEXT DEFAULT 'group' CHECK (chat_type IN ('private', 'group', 'supergroup', 'channel')),
    
    -- Configurações
    notificar_novas_corridas BOOLEAN DEFAULT true,
    notificar_aceites BOOLEAN DEFAULT true,
    notificar_entregas BOOLEAN DEFAULT true,
    notificar_cancelamentos BOOLEAN DEFAULT true,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(empresa_id)
);

-- Índices
CREATE INDEX idx_telegram_config_empresa ON telegram_config(empresa_id);
CREATE INDEX idx_telegram_config_ativo ON telegram_config(ativo);
```

---

### 8️⃣ **telegram_transportadores**

Transportadores cadastrados no Telegram.

```sql
CREATE TABLE telegram_transportadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transportador_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    empresa_id UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    
    telegram_user_id TEXT NOT NULL,
    telegram_username TEXT,
    telegram_first_name TEXT,
    telegram_last_name TEXT,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    receber_notificacoes BOOLEAN DEFAULT true,
    
    -- Metadados
    cadastrado_por UUID REFERENCES auth.users(id),
    data_cadastro TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(transportador_id, empresa_id, telegram_user_id)
);

-- Índices
CREATE INDEX idx_telegram_transp_empresa ON telegram_transportadores(empresa_id);
CREATE INDEX idx_telegram_transp_user ON telegram_transportadores(transportador_id);
CREATE INDEX idx_telegram_transp_telegram ON telegram_transportadores(telegram_user_id);
```

---

### 9️⃣ **telegram_notifications**

Histórico de notificações enviadas via Telegram.

```sql
CREATE TABLE telegram_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corrida_id UUID REFERENCES corridas(id),
    empresa_id UUID NOT NULL REFERENCES empresas(id),
    
    notification_type TEXT NOT NULL,
    message_content TEXT NOT NULL,
    
    telegram_message_id TEXT,
    sent_to_chat_id TEXT NOT NULL,
    
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
    error_message TEXT,
    
    sent_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_telegram_notif_corrida ON telegram_notifications(corrida_id);
CREATE INDEX idx_telegram_notif_empresa ON telegram_notifications(empresa_id);
CREATE INDEX idx_telegram_notif_status ON telegram_notifications(status);
```

---

### 🔟 **telegram_templates**

Templates de mensagens para o Telegram.

```sql
CREATE TABLE telegram_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name TEXT UNIQUE NOT NULL,
    template_content TEXT NOT NULL,
    variables JSONB,
    
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_telegram_templates_name ON telegram_templates(template_name);
CREATE INDEX idx_telegram_templates_ativo ON telegram_templates(ativo);
```

---

## 🔒 ROW LEVEL SECURITY (RLS)

Todas as tabelas devem ter RLS habilitado para segurança.

### Políticas Básicas:

```sql
-- Empresas
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver empresas ativas" ON empresas
    FOR SELECT USING (ativo = true);

CREATE POLICY "Admins podem gerenciar empresas" ON empresas
    FOR ALL USING (
        auth.uid() IN (
            SELECT uid_usuario FROM empresa_associada 
            WHERE funcao = 'admin'
        )
    );

-- Corridas
ALTER TABLE corridas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem suas próprias corridas" ON corridas
    FOR SELECT USING (
        auth.uid() = cliente_id 
        OR auth.uid() = transportador_id
        OR auth.uid() IN (
            SELECT uid_usuario FROM empresa_associada 
            WHERE empresa_id = corridas.empresa_id 
            AND funcao IN ('gerente', 'admin')
        )
    );
```

---

## 🔧 FUNÇÕES AUXILIARES

### Calcular preço da corrida:

```sql
CREATE OR REPLACE FUNCTION calcular_preco_corrida(
    p_empresa_id UUID,
    p_tipo_servico TEXT,
    p_tipo_veiculo TEXT,
    p_distancia_km DECIMAL,
    p_data_hora TIMESTAMP DEFAULT NOW()
)
RETURNS DECIMAL AS $$
DECLARE
    v_preco_base DECIMAL;
    v_preco_km DECIMAL;
    v_taxa_adicional DECIMAL := 0;
    v_preco_total DECIMAL;
    v_hora TIME;
BEGIN
    -- Buscar preços
    SELECT preco_base, preco_por_km, taxa_noturna
    INTO v_preco_base, v_preco_km, v_taxa_adicional
    FROM precos
    WHERE empresa_id = p_empresa_id
      AND tipo_servico = p_tipo_servico
      AND tipo_veiculo = p_tipo_veiculo
      AND ativo = true
    LIMIT 1;
    
    -- Calcular preço base
    v_preco_total := v_preco_base + (p_distancia_km * v_preco_km);
    
    -- Verificar se é horário noturno (22h-6h)
    v_hora := p_data_hora::TIME;
    IF v_hora >= '22:00:00' OR v_hora <= '06:00:00' THEN
        v_preco_total := v_preco_total + v_taxa_adicional;
    END IF;
    
    RETURN v_preco_total;
END;
$$ LANGUAGE plpgsql;
```

---

## 📊 VIEWS ÚTEIS

### Estatísticas por empresa:

```sql
CREATE VIEW v_estatisticas_empresa AS
SELECT 
    e.id,
    e.nome,
    COUNT(DISTINCT ea.uid_usuario) FILTER (WHERE ea.funcao = 'transportador') as total_transportadores,
    COUNT(DISTINCT ea.uid_usuario) FILTER (WHERE ea.funcao = 'cliente') as total_clientes,
    COUNT(c.id) as total_corridas,
    COUNT(c.id) FILTER (WHERE c.status = 'concluida') as corridas_concluidas,
    SUM(c.preco_total) FILTER (WHERE c.status = 'concluida') as faturamento_total,
    AVG(c.preco_total) FILTER (WHERE c.status = 'concluida') as ticket_medio
FROM empresas e
LEFT JOIN empresa_associada ea ON ea.empresa_id = e.id AND ea.status_vinculacao = 'ativo'
LEFT JOIN corridas c ON c.empresa_id = e.id
WHERE e.ativo = true
GROUP BY e.id, e.nome;
```

---

## 🔄 TRIGGERS

### Atualizar data de modificação automaticamente:

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_empresas_updated_at 
    BEFORE UPDATE ON empresas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 📝 NOTAS IMPORTANTES

1. Todos os IDs são UUID para melhor segurança
2. Timestamps sempre em UTC
3. Preços armazenados com 2 casas decimais
4. RLS deve estar sempre habilitado em produção
5. Índices criados para queries mais comuns
6. Constraints garantem integridade dos dados




