# 🏢 CLASSIFICAÇÃO DE EMPRESAS POR TIPO DE SERVIÇO

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Definir categorias de empresas para otimizar o sistema

---

## 📊 **TIPOS DE EMPRESA:**

### **1️⃣ TAXI / MOTO-TAXI**
**Serviços oferecidos:**
- ✅ Transporte de passageiros
- ✅ Entregas de pequenos objetos
- ❌ Cargas pesadas

**Veículos:**
- Moto
- Carro

**Exemplo:**
- Moto Taxi Express

---

### **2️⃣ TRANSPORTADORA DE CARGA**
**Serviços oferecidos:**
- ❌ Passageiros
- ✅ Cargas (pequenas, médias, grandes)
- ✅ Mudanças

**Veículos:**
- Van
- Caminhão
- Carreta

**Exemplo:**
- Transportadora XYZ Ltda

---

### **3️⃣ ENTREGA EXPRESS (Delivery)**
**Serviços oferecidos:**
- ❌ Passageiros
- ✅ Objetos (documentos, comida, compras)
- ❌ Cargas pesadas

**Veículos:**
- Moto
- Bicicleta
- Carro pequeno

**Exemplo:**
- Fast Delivery

---

### **4️⃣ MULTISSERVIÇO (Completa)**
**Serviços oferecidos:**
- ✅ Passageiros
- ✅ Objetos
- ✅ Cargas

**Veículos:**
- Todos

**Exemplo:**
- MovTudo Transportes

---

## 💡 **PROPOSTA DE CAMPO NA TABELA `empresas`:**

### **Opção A: Campo `tipo_empresa`** (1 categoria apenas)

```sql
ALTER TABLE empresas 
ADD COLUMN tipo_empresa TEXT CHECK (
  tipo_empresa IN ('taxi', 'transportadora', 'delivery', 'multisservico')
);
```

✅ **VANTAGENS:**
- Simples
- Categorização clara

❌ **DESVANTAGENS:**
- Pouco flexível
- Empresa pode oferecer múltiplos serviços

---

### **Opção B: Campo `servicos_oferecidos[]`** (múltiplas opções)

```sql
ALTER TABLE empresas 
ADD COLUMN servicos_oferecidos TEXT[];

-- Valores possíveis no array:
-- ['passageiro', 'objeto', 'carga']
```

✅ **VANTAGENS:**
- ✅ **Muito flexível**
- ✅ Empresa pode oferecer múltiplos serviços
- ✅ Fácil de consultar: `'passageiro' = ANY(servicos_oferecidos)`

❌ **DESVANTAGENS:**
- Ligeiramente mais complexo

**Exemplo:**
```sql
-- Moto Taxi Express
servicos_oferecidos = ['passageiro', 'objeto']

-- Transportadora XYZ
servicos_oferecidos = ['carga']

-- MovTudo Transportes
servicos_oferecidos = ['passageiro', 'objeto', 'carga']
```

---

### **Opção C: Campo `tipo_empresa` + `servicos_oferecidos[]`** (Melhor!)

```sql
ALTER TABLE empresas 
ADD COLUMN tipo_empresa TEXT CHECK (
  tipo_empresa IN ('taxi', 'transportadora', 'delivery', 'multisservico')
),
ADD COLUMN servicos_oferecidos TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Ou simplificar:
ADD COLUMN servicos_oferecidos TEXT[] DEFAULT ARRAY['passageiro', 'objeto']::TEXT[];
```

✅ **VANTAGENS:**
- ✅ Categorização (marketing, filtros)
- ✅ Flexibilidade (serviços específicos)
- ✅ Validação automática

**Mapeamento sugerido:**

| tipo_empresa | servicos_oferecidos (padrão) |
|--------------|------------------------------|
| `taxi` | `['passageiro', 'objeto']` |
| `transportadora` | `['carga']` |
| `delivery` | `['objeto']` |
| `multisservico` | `['passageiro', 'objeto', 'carga']` |

---

## 🎯 **BENEFÍCIOS DA CLASSIFICAÇÃO:**

### **1️⃣ Formulário Dinâmico:**

```typescript
// Na página /[slug]/solicitar

if (!empresa.servicos_oferecidos.includes('passageiro')) {
  // Não mostra opção "Passageiro"
}

if (!empresa.servicos_oferecidos.includes('objeto')) {
  // Não mostra opção "Objeto"
}
```

**Resultado:**
- Transportadora → Só mostra "Carga"
- Taxi → Mostra "Passageiro" e "Objeto"

---

### **2️⃣ Filtro de Transportadores:**

```sql
-- Corrida tipo "carga"
SELECT * FROM corridas
WHERE tipo = 'carga'
  AND id_empresa IN (
    SELECT id_empresa FROM empresas
    WHERE 'carga' = ANY(servicos_oferecidos)
  )
```

---

### **3️⃣ Validação:**

```typescript
// Ao criar corrida
if (corrida.tipo === 'carga' && !empresa.servicos_oferecidos.includes('carga')) {
  throw new Error('Esta empresa não oferece transporte de carga')
}
```

---

### **4️⃣ Marketing e SEO:**

```
Busca Google: "taxi rio de janeiro"
↓
Mostra apenas empresas tipo_empresa = 'taxi'

Busca Google: "transportadora mudança"
↓
Mostra apenas empresas tipo_empresa = 'transportadora'
```

---

## 🏆 **MINHA RECOMENDAÇÃO FORTE:**

### **OPÇÃO C (tipo_empresa + servicos_oferecidos[])**

**Por quê?**
1. ✅ Melhor categorização
2. ✅ Máxima flexibilidade
3. ✅ Validações automáticas
4. ✅ Marketing eficiente
5. ✅ UX personalizada

---

## 💻 **ESTRUTURA FINAL DA TABELA `empresas`:**

```sql
CREATE TABLE empresas (
    id INTEGER PRIMARY KEY,
    id_empresa TEXT UNIQUE NOT NULL,
    empresa_nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    
    -- NOVO: Classificação
    tipo_empresa TEXT CHECK (
      tipo_empresa IN ('taxi', 'transportadora', 'delivery', 'multisservico')
    ),
    servicos_oferecidos TEXT[] DEFAULT ARRAY['passageiro', 'objeto']::TEXT[],
    
    -- Contato
    empresa_telefone TEXT,
    empresa_email TEXT,
    empresa_endereco TEXT,
    empresa_cidade TEXT,
    empresa_estado TEXT,
    empresa_perimetro_entrega TEXT,
    
    -- Branding
    empresa_logo TEXT,
    slug TEXT UNIQUE NOT NULL,
    cor_primaria TEXT DEFAULT '#3B82F6',
    cor_secundaria TEXT DEFAULT '#10B981',
    
    -- Informações
    sobre_empresa TEXT,
    politica_privacidade TEXT,
    
    -- Status
    ativa BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    data_criacao TIMESTAMP DEFAULT NOW(),
    data_atualizacao TIMESTAMP DEFAULT NOW()
)
```

---

## 📝 **FORMULÁRIO DE CADASTRO DE EMPRESA (Admin):**

```tsx
{/* Tipo de Empresa */}
<select name="tipo_empresa">
  <option value="taxi">Taxi / Moto-Taxi</option>
  <option value="delivery">Entrega Express</option>
  <option value="transportadora">Transportadora de Carga</option>
  <option value="multisservico">Multisserviço</option>
</select>

{/* Serviços Oferecidos */}
<div>
  <label>Serviços Oferecidos:</label>
  <input type="checkbox" name="passageiro" /> Passageiros
  <input type="checkbox" name="objeto" /> Objetos
  <input type="checkbox" name="carga" /> Cargas
</div>
```

---

## ❓ **VOCÊ CONCORDA?**

**Opções:**

- **A)** ✅ Sim, OPÇÃO C (tipo_empresa + servicos_oferecidos[])
- **B)** ❌ Não, só servicos_oferecidos[] (sem tipo_empresa)
- **C)** ❌ Não, só tipo_empresa (sem servicos_oferecidos[])
- **D)** 💬 Outra ideia...

**Me diga!** E vou criar:
1. Script SQL para alterar tabela `empresas`
2. Tabela `corridas` completa
3. Atualizar formulário de cadastro de empresa

**Aguardo!** 🚀


