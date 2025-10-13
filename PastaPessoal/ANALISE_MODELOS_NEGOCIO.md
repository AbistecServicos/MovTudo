# 🚚 ANÁLISE: Modelos de Negócio do MovTudo

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Definir se o sistema suporta múltiplos modelos ou precisa de apps separados

---

## 📋 CASO A: TRANSPORTADORA DE CARGA (B2B)

### **Descrição:**
- Empresa adquire sistema para gerenciar rede de caminhoneiros
- Transportadores (caminhoneiros) oferecem seus serviços
- Empresas/Clientes corporativos solicitam transporte

### **Fluxo 1: Transportador Expõe Disponibilidade**

```
1. Caminhoneiro faz login (Transportador)
2. Cadastra sua disponibilidade:
   - Local atual/rota
   - Horários disponíveis
   - Tipo de veículo (carreta, truck, combi)
   - Carga máxima
   - Preço/km
3. Empresa vê transportadores disponíveis
4. Empresa solicita transporte
5. Caminhoneiro aceita/rejeita
```

### **Fluxo 2: Empresa Expõe Necessidade**

```
1. Empresa faz login (Cliente Corporativo)
2. Cria pedido de transporte:
   - Origem
   - Destino
   - Tipo de carga
   - Peso/volume
   - Data/hora
   - Orçamento
3. Caminhoneiros veem pedidos disponíveis
4. Caminhoneiro aceita
```

### **Atores:**
- ✅ **Transportador:** Caminhoneiro (faz login)
- ✅ **Cliente:** Empresa corporativa (faz login)
- ✅ **Gerente:** Coordenador da transportadora
- ✅ **Admin:** Dono do sistema

### **Características:**
- ✅ B2B (empresa para empresa)
- ✅ Todos fazem login
- ✅ Modelo de "marketplace" (oferta/demanda)
- ✅ Valores altos, contratos

---

## 📋 CASO B: LOJA SEM SITE (B2C com Intermediário)

### **Descrição:**
- Lojinha não tem site
- Cliente liga/vai na loja e compra
- Loja solicita entrega para cliente final
- Entregadores aceitam

### **Fluxo:**

```
1. Cliente final liga/vai na loja (NÃO interage com app)
2. Atendente da loja faz login (Gerente)
3. Cria pedido de entrega:
   - Nome do cliente final
   - Endereço de entrega
   - Produto
   - Valor
4. Entregadores (10 cadastrados) veem pedido
5. Entregador aceita
6. Entregador entrega
7. Cliente final avalia (opcional, pode ser por WhatsApp)
```

### **Atores:**
- ✅ **Entregador:** Faz login, aceita pedidos
- ✅ **Gerente:** Atendente da loja (faz login, cria pedidos)
- ❌ **Cliente Final:** NÃO interage com app
- ✅ **Admin:** Dono do sistema

### **Características:**
- ✅ B2C com intermediário
- ✅ Cliente final NÃO faz login
- ✅ Similar ao **EntregasWoo**!
- ✅ Dados do cliente salvos na tabela `corridas`

---

## 📋 CASO C: TAXI/MOTOTÁXI (B2C Direto)

### **Descrição:**
- Cliente precisa de taxi
- Solicita corrida diretamente
- Taxistas aceitam

### **Fluxo 1: Cliente Logado**

```
1. Cliente faz login/cadastro
2. Seleciona empresa de taxi (Ex: Moto Taxi Express)
3. Solicita corrida:
   - Origem (localização atual GPS)
   - Destino
   - Tipo (passageiro/objeto)
4. Taxistas da empresa veem pedido
5. Taxista aceita
6. Cliente acompanha em tempo real
7. Cliente avalia
```

### **Fluxo 2: Cliente Visitante**

```
1. Cliente acessa site (sem login)
2. Preenche:
   - Nome, telefone, email
   - Origem, destino
3. Recebe link de acompanhamento por SMS/WhatsApp
4. Acompanha status pelo link
```

### **Atores:**
- ✅ **Cliente:** Pode fazer login OU ser visitante
- ✅ **Taxista:** Faz login, aceita corridas
- ✅ **Gerente:** Coordenador da empresa de taxi
- ✅ **Admin:** Dono do sistema

### **Características:**
- ✅ B2C direto
- ✅ Cliente pode OU NÃO fazer login
- ✅ Modelo "Uber-like"
- ✅ Tempo real importante

---

## 🔍 **ANÁLISE COMPARATIVA:**

| Aspecto | CASO A (Carga) | CASO B (Loja) | CASO C (Taxi) |
|---------|----------------|---------------|---------------|
| **Modelo** | B2B | B2C intermediado | B2C direto |
| **Cliente faz login?** | ✅ Sim (empresa) | ❌ Não | ⚠️ Opcional |
| **Transportador faz login?** | ✅ Sim | ✅ Sim | ✅ Sim |
| **Marketplace?** | ✅ Sim (oferta/demanda) | ❌ Não | ✅ Sim |
| **Tempo real?** | ⚠️ Menos crítico | ⚠️ Menos crítico | ✅ Muito crítico |
| **Valores** | 💰💰💰 Altos | 💰 Baixos | 💰 Baixos |
| **Similar a** | - | EntregasWoo | Uber |

---

## 💡 **DESCOBERTA IMPORTANTE:**

### **OS 3 CASOS SÃO COMPATÍVEIS!**

Todos podem usar a **MESMA estrutura de banco de dados**:

```sql
CREATE TABLE corridas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT,                 -- E1, E2, E3...
    
    -- CLIENTE (UID NULLABLE!)
    cliente_uid UUID,                -- NULL se visitante/intermediado
    nome_cliente TEXT,               -- Sempre preenchido
    email_cliente TEXT,
    telefone_cliente TEXT,
    
    -- TRANSPORTADOR (UID quando aceito)
    aceito_por_uid UUID,
    aceito_por_nome TEXT,
    aceito_por_email TEXT,
    aceito_por_telefone TEXT,
    
    -- TIPO DE SERVIÇO
    tipo TEXT,                       -- 'passageiro', 'objeto', 'carga'
    tipo_veiculo TEXT,               -- 'moto', 'carro', 'van', 'caminhao', 'carreta'
    
    -- Resto dos campos...
)
```

### **Como cada caso usa:**

#### **CASO A (Carga):**
- `cliente_uid` = ✅ UID da empresa solicitante (faz login)
- `tipo` = 'carga'
- `tipo_veiculo` = 'caminhao', 'carreta'
- Valores altos

#### **CASO B (Loja):**
- `cliente_uid` = ❌ NULL (não faz login)
- Gerente da loja preenche dados do cliente final
- `tipo` = 'objeto'
- `tipo_veiculo` = 'moto', 'carro'

#### **CASO C (Taxi):**
- `cliente_uid` = ⚠️ UID se faz login, NULL se visitante
- `tipo` = 'passageiro' ou 'objeto'
- `tipo_veiculo` = 'moto', 'carro'

---

## 🏆 **RESPOSTA FINAL:**

### **NÃO PRECISA DE APPS SEPARADOS!**

**1 único sistema MovTudo pode atender TODOS os casos!**

### **Como?**

1. ✅ **Estrutura flexível:** `cliente_uid` NULLABLE
2. ✅ **Campo `tipo`:** Define se é passageiro/objeto/carga
3. ✅ **Campo `tipo_veiculo`:** Define veículo necessário
4. ✅ **Cada empresa configura** seu modelo:
   - Empresa de taxi: Tipo passageiro/objeto
   - Transportadora: Tipo carga
   - Loja: Tipo objeto

### **Configuração por empresa:**

```sql
ALTER TABLE empresas 
ADD COLUMN tipo_servico TEXT[]; -- ['passageiro', 'objeto', 'carga']
```

Exemplo:
- **Moto Taxi Express:** `['passageiro', 'objeto']`
- **Transportadora XYZ:** `['carga']`
- **Loja ABC:** `['objeto']`

---

## 🚀 **VANTAGENS DESSA SOLUÇÃO:**

1. ✅ **1 sistema** para múltiplos modelos de negócio
2. ✅ **Escalável:** Empresa escolhe seu modelo
3. ✅ **Flexível:** Cliente pode ou não fazer login
4. ✅ **Performance:** Mesma estrutura de dados
5. ✅ **Manutenção:** 1 código apenas

---

## ❓ **VOCÊ CONCORDA?**

**Posso implementar assim?**

- ✅ Manter estrutura atual
- ✅ Cliente pode fazer login OU não
- ✅ Adicionar `tipo_servico[]` em `empresas`
- ✅ Lógica de redirecionamento por tipo de usuário

**Sim ou não?** 🤔

