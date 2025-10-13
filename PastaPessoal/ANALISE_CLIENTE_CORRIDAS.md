# 🔍 ANÁLISE: Cliente e Sistema de Corridas

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Definir se cliente precisa fazer login e onde salvar dados

---

## 📊 COMPARAÇÃO: EntregasWoo vs MovTudo

### **EntregasWoo (Sistema Atual):**

| Aspecto | Como funciona |
|---------|---------------|
| **Cliente** | NÃO faz login no EntregasWoo |
| **Pedido** | Vem do WooCommerce (multisite) |
| **Dados do Cliente** | Salvos na tabela `pedidos` (nome, email, telefone) |
| **Protagonista** | Cliente é protagonista no WooCommerce, não no EntregasWoo |
| **Entregador** | Protagonista do EntregasWoo (faz login, aceita pedidos) |
| **Histórico** | Tudo na tabela `pedidos` |

### **Estrutura da tabela `pedidos` (EntregasWoo):**

```sql
CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY,
    id_loja TEXT,                    -- L1, L2, L3...
    
    -- DADOS DO CLIENTE (SEM LOGIN!)
    nome_cliente TEXT,
    email_cliente TEXT,
    telefone_cliente TEXT,
    
    -- Endereços
    origem_endereco TEXT,
    destino_endereco TEXT,
    
    -- Quando aceito, salva dados do entregador
    aceito_por_nome TEXT,
    aceito_por_email TEXT,
    aceito_por_telefone TEXT,
    aceito_por_uid UUID,             -- FK para auth.users
    
    -- Status
    status_transporte TEXT,
    
    -- Avaliações
    nota_cliente INTEGER,            -- Cliente avalia entregador
    nota_transportador INTEGER,      -- Entregador avalia cliente
    
    -- Datas
    data TIMESTAMP,
    data_aceite TIMESTAMP,
    data_conclusao TIMESTAMP
)
```

**Observações:**
- ✅ Cliente **NÃO tem UID** (não faz login)
- ✅ Dados do cliente salvos **diretamente** na tabela `pedidos`
- ✅ Entregador **TEM UID** (faz login)
- ✅ Histórico = consulta tabela `pedidos` por `email_cliente`

---

## 🎯 MOVTUDO - DUAS OPÇÕES:

---

### **OPÇÃO 1: Cliente SEM Login (Igual EntregasWoo)**

#### **Como funciona:**

1. Cliente acessa: `http://localhost:3000/moto-taxi-express`
2. Vê layout da empresa (logo, cores)
3. Clica em "Solicitar Corrida"
4. Preenche formulário:
   - Nome
   - Email
   - Telefone
   - Origem
   - Destino
   - Tipo (passageiro/objeto)
5. Submete pedido → salvo na tabela `corridas`
6. Acompanha status por **link único** (email ou WhatsApp)

#### **Tabela `corridas`:**

```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT,                 -- E1, E2, E3...
    
    -- CLIENTE (SEM UID!)
    nome_cliente TEXT,
    email_cliente TEXT,
    telefone_cliente TEXT,
    
    -- Endereços
    origem_endereco TEXT,
    origem_lat DOUBLE PRECISION,
    origem_lng DOUBLE PRECISION,
    destino_endereco TEXT,
    destino_lat DOUBLE PRECISION,
    destino_lng DOUBLE PRECISION,
    
    -- Tipo
    tipo TEXT,                       -- 'passageiro' ou 'objeto'
    descricao_objeto TEXT,
    peso_kg DOUBLE PRECISION,
    foto_objeto_url TEXT,
    
    -- TRANSPORTADOR (TEM UID!)
    aceito_por_uid UUID,
    aceito_por_nome TEXT,
    aceito_por_email TEXT,
    aceito_por_telefone TEXT,
    
    -- Status
    status_transporte TEXT,
    
    -- Preço
    preco_calculado NUMERIC,
    frete_oferecido NUMERIC,
    frete_pago NUMERIC,
    forma_pagamento TEXT,
    
    -- Avaliações
    nota_cliente INTEGER,
    comentario_cliente TEXT,
    nota_transportador INTEGER,
    comentario_transportador TEXT,
    
    -- Datas
    data TIMESTAMP,
    data_aceite TIMESTAMP,
    data_conclusao TIMESTAMP
)
```

#### ✅ **VANTAGENS:**
- ✅ **Simples:** Cliente não precisa criar conta
- ✅ **Rápido:** Menos fricção para usar
- ✅ **Igual EntregasWoo:** Arquitetura testada
- ✅ **Performance:** Menos tabelas, menos JOINs
- ✅ **Privacidade:** Cliente não fica "preso" ao sistema

#### ❌ **DESVANTAGENS:**
- ❌ Cliente não tem perfil
- ❌ Cliente não salva endereços favoritos
- ❌ Cliente não tem histórico unificado (precisa do email)
- ❌ Cliente pode criar múltiplos pedidos com emails diferentes

---

### **OPÇÃO 2: Cliente COM Login (Diferente do EntregasWoo)**

#### **Como funciona:**

1. Cliente acessa: `http://localhost:3000/moto-taxi-express`
2. Vê layout da empresa
3. Clica em "Solicitar Corrida"
4. **PRECISA fazer login/cadastro**
5. Formulário já vem com dados salvos:
   - Nome (do perfil)
   - Email (do perfil)
   - Telefone (do perfil)
   - Endereços favoritos
6. Submete pedido → salvo com `cliente_uid`

#### **Tabela `corridas`:**

```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT,
    
    -- CLIENTE (TEM UID!)
    cliente_uid UUID,                -- FK para usuarios
    
    -- Endereços
    origem_endereco TEXT,
    origem_lat DOUBLE PRECISION,
    origem_lng DOUBLE PRECISION,
    destino_endereco TEXT,
    destino_lat DOUBLE PRECISION,
    destino_lng DOUBLE PRECISION,
    
    -- Tipo
    tipo TEXT,
    
    -- TRANSPORTADOR (TEM UID!)
    aceito_por_uid UUID,
    
    -- Status, Preço, Avaliações, Datas...
    ...
)
```

#### **Tabela `enderecos_favoritos` (nova):**

```sql
CREATE TABLE enderecos_favoritos (
    id UUID PRIMARY KEY,
    uid_usuario UUID,                -- FK para usuarios
    tipo TEXT,                       -- 'casa', 'trabalho', 'outro'
    endereco TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    apelido TEXT
)
```

#### ✅ **VANTAGENS:**
- ✅ Cliente tem perfil completo
- ✅ Endereços favoritos
- ✅ Histórico unificado
- ✅ Pagamentos salvos
- ✅ Programa de fidelidade possível
- ✅ Notificações (email, push, Telegram)

#### ❌ **DESVANTAGENS:**
- ❌ **Fricção:** Cliente precisa criar conta
- ❌ Mais complexo
- ❌ Mais tabelas

---

## 🏆 **MINHA RECOMENDAÇÃO FORTE:**

### **OPÇÃO 1.5: Híbrido (Melhor de ambos)**

**Cliente pode fazer pedido COM ou SEM login!**

#### **Como funciona:**

1. Cliente acessa: `http://localhost:3000/moto-taxi-express`
2. Vê layout da empresa
3. Clica em "Solicitar Corrida"
4. **Escolhe:**
   - **A)** "Fazer pedido como visitante" → preenche tudo
   - **B)** "Login/Cadastro" → dados pré-preenchidos

#### **Tabela `corridas`:**

```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT,
    
    -- CLIENTE (UID OPCIONAL!)
    cliente_uid UUID,                -- NULL se visitante
    nome_cliente TEXT,               -- Sempre preenchido
    email_cliente TEXT,              -- Sempre preenchido
    telefone_cliente TEXT,           -- Sempre preenchido
    
    -- Resto igual...
)
```

#### **Fluxo de Login/Visitante:**

```typescript
// Se cliente faz login
if (clienteLogado) {
  corrida.cliente_uid = user.uid
  corrida.nome_cliente = user.nome_completo
  corrida.email_cliente = user.email
  corrida.telefone_cliente = user.telefone
}

// Se cliente é visitante
else {
  corrida.cliente_uid = null
  corrida.nome_cliente = formData.nome
  corrida.email_cliente = formData.email
  corrida.telefone_cliente = formData.telefone
}
```

#### ✅ **VANTAGENS:**
- ✅ **Flexível:** Cliente escolhe
- ✅ **Sem fricção:** Visitante pode usar
- ✅ **Benefícios:** Cliente logado tem perfil/histórico
- ✅ **Performance:** 1 query apenas
- ✅ **Simples:** Estrutura limpa

#### ❌ **DESVANTAGENS:**
- ❌ Ligeiramente mais complexo que OPÇÃO 1
- ❌ Cliente visitante não tem histórico unificado

---

## 📝 **ESTRUTURA FINAL RECOMENDADA:**

### **Tabela `usuarios`:**
```sql
-- SEM campo 'funcao'
-- Admin: is_admin = true
-- Gerente/Transportador: empresa_associada.funcao
-- Cliente: is_admin = false + sem empresa_associada
```

### **Tabela `corridas`:**
```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT NOT NULL,
    
    -- CLIENTE (UID OPCIONAL!)
    cliente_uid UUID,                -- NULL se visitante, FK se logado
    nome_cliente TEXT NOT NULL,
    email_cliente TEXT NOT NULL,
    telefone_cliente TEXT NOT NULL,
    
    -- Endereços
    origem_endereco TEXT NOT NULL,
    origem_lat DOUBLE PRECISION,
    origem_lng DOUBLE PRECISION,
    destino_endereco TEXT NOT NULL,
    destino_lat DOUBLE PRECISION,
    destino_lng DOUBLE PRECISION,
    
    -- Tipo
    tipo TEXT NOT NULL,              -- 'passageiro' ou 'objeto'
    descricao_objeto TEXT,
    peso_kg DOUBLE PRECISION,
    foto_objeto_url TEXT,
    
    -- TRANSPORTADOR (UID OBRIGATÓRIO!)
    aceito_por_uid UUID,             -- FK para usuarios
    aceito_por_nome TEXT,
    aceito_por_email TEXT,
    aceito_por_telefone TEXT,
    
    -- Status
    status_transporte TEXT DEFAULT 'aguardando',
    
    -- Preço
    distancia_km DOUBLE PRECISION,
    tempo_estimado_min INTEGER,
    preco_calculado NUMERIC,
    forma_pagamento TEXT,
    frete_pago NUMERIC,
    
    -- Avaliações
    nota_cliente INTEGER,            -- Cliente avalia transportador
    comentario_cliente TEXT,
    nota_transportador INTEGER,      -- Transportador avalia cliente
    comentario_transportador TEXT,
    
    -- Observações
    observacao_cliente TEXT,
    empresa_obs TEXT,
    
    -- Datas
    data TIMESTAMP DEFAULT NOW(),
    data_aceite TIMESTAMP,
    data_conclusao TIMESTAMP,
    data_cancelamento TIMESTAMP,
    
    -- Timestamps
    ultimo_status TIMESTAMP DEFAULT NOW()
)
```

---

## 🎯 **RESPOSTA FINAL:**

### **O QUE EU RECOMENDO:**

1. ✅ **NÃO** adicionar campo `funcao` em `usuarios`
2. ✅ **Manter** estrutura atual:
   - Admin: `is_admin = true`
   - Gerente/Transportador: `empresa_associada.funcao`
   - Cliente: Sem registro em `empresa_associada`
3. ✅ **Cliente pode fazer pedido COM ou SEM login**
4. ✅ **Tabela `corridas` tem `cliente_uid` NULLABLE**
5. ✅ **Histórico:**
   - Cliente logado: `WHERE cliente_uid = '[UID]'`
   - Cliente visitante: `WHERE email_cliente = '[EMAIL]'`

---

## 💻 **CÓDIGO DE REDIRECIONAMENTO (Versão Final):**

```typescript
async function redirectAfterLogin(user, empresaAssociada, empresaSlug) {
  
  // 1. ADMINISTRADOR → /admin
  if (user.is_admin === true) {
    router.push('/admin')
    return
  }
  
  // 2. TEM VÍNCULO COM EMPRESA?
  if (empresaAssociada) {
    
    // 2a. GERENTE → /{slug}
    if (empresaAssociada.funcao === 'gerente') {
      const empresa = await getEmpresa(empresaAssociada.id_empresa)
      router.push(`/${empresa.slug}`)
      return
    }
    
    // 2b. TRANSPORTADOR → /transportador
    if (empresaAssociada.funcao === 'transportador') {
      router.push('/transportador')
      return
    }
  }
  
  // 3. CLIENTE → Fica na página que acessou (slug)
  // Não redireciona! Cliente já está no slug correto
  
}
```

---

## ✅ **DECISÃO:**

**Você concorda com OPÇÃO 1.5 (Híbrido)?**

- ✅ Cliente pode fazer pedido **COM** ou **SEM** login
- ✅ `corridas.cliente_uid` é **NULLABLE**
- ✅ **NÃO** adicionar campo `funcao` em `usuarios`

**Sim ou Não?**

Se sim, vou implementar:
1. ✅ Lógica de redirecionamento
2. ✅ Proteção de rotas
3. ✅ Ajustes no layout

**Aguardo sua confirmação!** 🚀


