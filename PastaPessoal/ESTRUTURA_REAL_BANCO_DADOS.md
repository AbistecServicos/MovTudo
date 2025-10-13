# 🗄️ ESTRUTURA REAL DO BANCO DE DADOS - MovTudo

**Última atualização:** 12 de outubro de 2025
**Baseado na sondagem real do banco Supabase**

---

## 📊 VISÃO GERAL

Esta é a estrutura **REAL** do banco de dados MovTudo, baseada na sondagem realizada em 12/10/2025.

**✅ Usuário Admin encontrado:**
- Email: `almirdss@gmail.com`
- Nome: `Almir da Silva Salles`
- UID: `4aac4aa0-f100-422a-9e2e-715e6560d34d`
- Status: `is_admin = true`

---

## 🏗️ ESTRUTURA REAL DAS TABELAS

### 1️⃣ **usuarios** (Tamanho: 64 kB)

```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    uid UUID NOT NULL,                    -- ID do Supabase Auth
    email TEXT NOT NULL,
    nome_usuario TEXT NOT NULL,
    nome_completo TEXT NOT NULL,
    telefone TEXT NOT NULL,
    foto TEXT,                           -- URL da foto
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_admin BOOLEAN DEFAULT FALSE
);
```

**Características:**
- ✅ Campo `is_admin` para identificar administradores
- ✅ Relacionamento com Supabase Auth via `uid`
- ✅ Campos separados para `nome_usuario` e `nome_completo`

---

### 2️⃣ **empresas** (Tamanho: 40 kB)

```sql
CREATE TABLE empresas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT NOT NULL,            -- ID textual da empresa (ex: "L1", "L2")
    empresa_nome TEXT NOT NULL,
    cnpj TEXT NOT NULL,
    empresa_endereco TEXT NOT NULL,
    empresa_telefone TEXT NOT NULL,
    empresa_cidade TEXT,
    empresa_estado TEXT,
    empresa_perimetro_entrega TEXT,
    empresa_logo TEXT,                   -- URL do logo
    slug TEXT,                          -- Para URLs amigáveis
    cor_primaria TEXT DEFAULT '#3B82F6',
    cor_secundaria TEXT DEFAULT '#10B981',
    politica_privacidade TEXT,
    sobre_empresa TEXT,
    ativa BOOLEAN DEFAULT TRUE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Características:**
- ✅ ID textual (`id_empresa`) em vez de UUID
- ✅ Cores personalizáveis por empresa
- ✅ Campos para branding e informações legais

---

### 3️⃣ **empresa_associada** (Tamanho: 48 kB)

```sql
CREATE TABLE empresa_associada (
    id INTEGER PRIMARY KEY,
    uid_usuario UUID NOT NULL,           -- FK para auth.users
    nome_completo TEXT NOT NULL,
    funcao TEXT NOT NULL,                -- admin, gerente, transportador, cliente
    id_empresa TEXT NOT NULL,            -- FK para empresas.id_empresa
    status_vinculacao TEXT DEFAULT 'ativo',
    ultimo_status_vinculacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_desligamento TIMESTAMP WITH TIME ZONE,
    
    -- Dados da empresa (duplicados para performance)
    empresa_nome TEXT NOT NULL,
    empresa_endereco TEXT,
    empresa_telefone TEXT,
    perimetro_entrega TEXT,
    
    -- Dados específicos do usuário
    veiculo TEXT,
    carga_maxima INTEGER,
    
    -- Métricas de performance (semana)
    semana_entregue INTEGER DEFAULT 0,
    semana_cancelado INTEGER DEFAULT 0,
    frete_pago_semana NUMERIC DEFAULT 0,
    
    -- Métricas de performance (mês)
    mes_entregue INTEGER DEFAULT 0,
    mes_cancelado INTEGER DEFAULT 0,
    frete_pago_mes NUMERIC DEFAULT 0,
    
    -- Métricas de performance (ano)
    ano_entregue INTEGER DEFAULT 0,
    ano_cancelado INTEGER DEFAULT 0,
    frete_pago_ano NUMERIC DEFAULT 0,
    
    -- Métricas do dia
    total_entregue_hoje INTEGER DEFAULT 0,
    total_cancelado_hoje INTEGER DEFAULT 0,
    total_frete_pago_hoje NUMERIC DEFAULT 0,
    data_atualizacao_hoje DATE DEFAULT CURRENT_DATE,
    
    -- Metadados
    ultima_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_usuario TEXT
);
```

**Características:**
- ✅ Sistema de métricas de performance completo
- ✅ Dados duplicados da empresa para performance
- ✅ Controle de entregas por período (dia/semana/mês/ano)
- ✅ Sistema de fretes pagos

---

### 4️⃣ **corridas** (Tamanho: 48 kB)

```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT NOT NULL,            -- FK para empresas.id_empresa
    
    -- Tipo de serviço
    tipo TEXT NOT NULL,                  -- passageiro, objeto
    
    -- Dados do cliente
    nome_cliente TEXT,
    email_cliente TEXT,
    telefone_cliente TEXT,
    
    -- Origem
    origem_endereco TEXT NOT NULL,
    origem_lat DOUBLE PRECISION,
    origem_lng DOUBLE PRECISION,
    
    -- Destino
    destino_endereco TEXT NOT NULL,
    destino_lat DOUBLE PRECISION,
    destino_lng DOUBLE PRECISION,
    
    -- Cálculos
    distancia_km DOUBLE PRECISION,
    tempo_estimado_min INTEGER,
    preco_calculado NUMERIC,
    
    -- Detalhes do objeto (se aplicável)
    descricao_objeto TEXT,
    peso_kg DOUBLE PRECISION,
    foto_objeto_url TEXT,
    
    -- Status e aceite
    status_transporte TEXT DEFAULT 'aguardando',
    aceito_por_nome TEXT DEFAULT 'Nome não especificado',
    aceito_por_email TEXT DEFAULT 'Email não especificado',
    aceito_por_telefone TEXT DEFAULT 'Telefone não especificado',
    aceito_por_uid UUID,                 -- FK para auth.users
    
    -- Pagamento
    forma_pagamento TEXT,
    frete_oferecido NUMERIC,
    frete_pago NUMERIC,
    status_pagamento BOOLEAN DEFAULT FALSE,
    data_pagamento DATE,
    frete_ja_processado BOOLEAN,
    
    -- Observações
    observacao_cliente TEXT,
    empresa_obs TEXT,
    
    -- Dados da empresa (duplicados)
    empresa_nome TEXT,
    empresa_telefone TEXT,
    empresa_endereco TEXT,
    
    -- Avaliações
    nota_cliente INTEGER,
    comentario_cliente TEXT,
    nota_transportador INTEGER,
    comentario_transportador TEXT,
    
    -- Timestamps
    data TIMESTAMP,                      -- Data de criação
    ultimo_status TIMESTAMP DEFAULT NOW(),
    data_aceite TIMESTAMP WITH TIME ZONE,
    data_conclusao TIMESTAMP WITH TIME ZONE,
    data_cancelamento TIMESTAMP WITH TIME ZONE
);
```

**Características:**
- ✅ Sistema completo de corridas com geolocalização
- ✅ Dados duplicados da empresa para performance
- ✅ Sistema de avaliações bidirecionais
- ✅ Controle de pagamentos e fretes
- ✅ Status detalhado com timestamps

---

### 5️⃣ **Tabelas Telegram**

#### **telegram_config** (Tamanho: 24 kB)
- Configurações do bot por empresa

#### **telegram_transportadores** (Tamanho: 32 kB)
- Transportadores cadastrados no Telegram

#### **telegram_notifications** (Tamanho: 16 kB)
- Histórico de notificações enviadas

#### **telegram_templates** (Tamanho: 24 kB)
- Templates de mensagens personalizados

---

### 6️⃣ **Outras Tabelas**

#### **precos** (Tamanho: 16 kB)
- Tabela de preços por empresa

#### **notificacoes** (Tamanho: 16 kB)
- Sistema de notificações

#### **user_tokens** (Tamanho: 32 kB)
- Tokens de autenticação

---

## 🔑 DIFERENÇAS DA ESTRUTURA PLANEJADA

| Aspecto | Planejado | Real |
|---------|-----------|------|
| **IDs** | UUID | INTEGER + TEXT |
| **Empresas** | `empresa_id` (UUID) | `id_empresa` (TEXT) |
| **Admin** | Via `empresa_associada` | Campo `is_admin` na tabela `usuarios` |
| **Performance** | Simples | Métricas detalhadas (dia/semana/mês/ano) |
| **Dados** | Normalizados | Duplicados para performance |
| **Foco** | Transporte geral | Entregas com métricas |

---

## 🚀 SISTEMA DE PERMISSÕES REAL

### 1. **Administrador Global**
- Campo `is_admin = true` na tabela `usuarios`
- Acesso total ao sistema
- Pode gerenciar todas as empresas

### 2. **Funções por Empresa** (tabela `empresa_associada`)
- `admin` - Admin da empresa
- `gerente` - Gerente da empresa
- `transportador` - Transportador/entregador
- `cliente` - Cliente da empresa

---

## 📊 MÉTRICAS E PERFORMANCE

O sistema tem um foco forte em métricas de performance:

### **Por Transportador:**
- Entregas realizadas (dia/semana/mês/ano)
- Cancelamentos (dia/semana/mês/ano)
- Fretes pagos (dia/semana/mês/ano)

### **Por Corrida:**
- Status detalhado com timestamps
- Avaliações bidirecionais
- Controle de pagamentos
- Geolocalização completa

---

## 🔧 PRÓXIMOS PASSOS

### 1. **Resolver Problema de Login**
- Verificar configuração de autenticação
- Testar login com `almirdss@gmail.com`
- Verificar se senha está correta

### 2. **Verificar Dados**
- Executar contagem de registros
- Verificar se há empresas cadastradas
- Verificar associações de usuários

### 3. **Testar Funcionalidades**
- Testar criação de corridas
- Testar sistema de notificações
- Testar integração com Google Maps

---

## 📝 COMANDOS ÚTEIS

### Verificar usuário admin:
```sql
SELECT * FROM usuarios WHERE is_admin = true;
```

### Ver empresas cadastradas:
```sql
SELECT * FROM empresas WHERE ativa = true;
```

### Ver associações ativas:
```sql
SELECT * FROM empresa_associada WHERE status_vinculacao = 'ativo';
```

### Contar registros:
```sql
-- Execute o script: scripts/contar-registros-corrigido.sql
```

---

**Status:** ✅ Estrutura mapeada e documentada
**Próximo:** Resolver problema de login do admin






