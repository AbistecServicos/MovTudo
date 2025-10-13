# 👤 GUIA: Cliente Visitante (Sem Login)

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Explicar como cliente visitante faz pedido

---

## 🌐 **FLUXO COMPLETO:**

### **1️⃣ Cliente vê propaganda**

```
Empresa "Moto Taxi Express" distribui:
- 📱 QR Code impresso
- 📲 Link no WhatsApp
- 🌐 Link nas redes sociais
- 📧 Link no email marketing

Link: http://localhost:3000/moto-taxi-express
                              ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
                              SLUG da empresa!
```

---

### **2️⃣ Cliente acessa o link/QR Code**

```
Cliente escaneia QR Code
↓
Abre: http://localhost:3000/moto-taxi-express
```

---

### **3️⃣ Cliente vê layout da empresa**

```
Página carrega:
- 🎨 Cores da empresa (primária/secundária)
- 🖼️ Logo da empresa
- 📝 Nome da empresa
- 📍 Perímetro de atendimento
- 📞 Telefone de contato
- ℹ️ Sobre a empresa

Botão: "📲 Solicitar Corrida"
```

---

### **4️⃣ Cliente clica em "Solicitar Corrida"**

```
Abre formulário:

[ ] Você já tem conta? → Login
[✓] Continuar sem login → Formulário
```

---

### **5️⃣ Cliente preenche formulário (SEM login)**

```
📝 Formulário:
- Nome: _________________
- Telefone: _________________
- Email: _________________
- Origem: _________________  [📍 Usar GPS]
- Destino: _________________
- Tipo: ( ) Passageiro  ( ) Objeto
- Descrição: _________________
- Peso (kg): _________________

[Enviar Pedido]
```

---

### **6️⃣ Sistema cria pedido**

```sql
INSERT INTO corridas (
  id_empresa,              -- 'E1' (detectado pelo slug!)
  cliente_uid,             -- NULL (visitante)
  nome_cliente,            -- 'João Silva'
  email_cliente,           -- 'joao@email.com'
  telefone_cliente,        -- '21999999999'
  origem_endereco,
  destino_endereco,
  tipo,                    -- 'passageiro' ou 'objeto'
  status_transporte,       -- 'aguardando'
  data
) VALUES (
  'E1',                    -- ← Identificado pelo slug!
  NULL,                    -- ← Visitante
  'João Silva',
  'joao@email.com',
  '21999999999',
  'Rua A, 123',
  'Rua B, 456',
  'passageiro',
  'aguardando',
  NOW()
)
```

**CRUCIAL:**
```typescript
// Código que detecta a empresa pelo slug:
const { slug } = params // 'moto-taxi-express'

const { data: empresa } = await supabase
  .from('empresas')
  .select('*')
  .eq('slug', slug)
  .single()

const id_empresa = empresa.id_empresa // 'E1'
```

---

### **7️⃣ Sistema envia confirmação**

```
Cliente recebe:

📧 EMAIL:
"Seu pedido foi recebido!
Acompanhe em: http://localhost:3000/corrida/ABC123"

📲 SMS:
"Moto Taxi Express: Pedido confirmado!
Acompanhe: http://localhost:3000/corrida/ABC123"

📱 WhatsApp:
"Olá João! Seu pedido foi recebido.
Acompanhe em tempo real: [link]"
```

---

### **8️⃣ Transportadores APENAS da E1 veem pedido**

```sql
-- Transportadores consultam:
SELECT * FROM corridas
WHERE id_empresa IN (
  SELECT id_empresa 
  FROM empresa_associada 
  WHERE uid_usuario = '[UID_TRANSPORTADOR]'
    AND funcao = 'transportador'
    AND status_vinculacao = 'ativo'
)
AND status_transporte = 'aguardando'
```

**Resultado:**
- ✅ Transportador da E1 (Moto Taxi Express) → VÊ o pedido
- ❌ Transportador da E2 (Outra empresa) → NÃO vê

---

### **9️⃣ Transportador aceita**

```
Transportador da E1 aceita
↓
Sistema atualiza:

UPDATE corridas SET
  status_transporte = 'aceito',
  aceito_por_uid = '[UID_TRANSPORTADOR]',
  aceito_por_nome = 'Pedro Moto',
  aceito_por_email = 'pedro@email.com',
  aceito_por_telefone = '21988888888',
  data_aceite = NOW()
WHERE id = [ID_CORRIDA]
```

---

### **🔟 Cliente acompanha**

```
Cliente acessa link:
http://localhost:3000/corrida/ABC123
↓
Vê status em tempo real:
- ✅ Pedido recebido
- ✅ Aceito por: Pedro Moto
- 🚗 Em rota
- 📍 Localização atual do transportador (GPS)
- ⏱️ Tempo estimado
```

---

## ✅ **VANTAGENS DESSE MODELO:**

1. ✅ **Sem fricção:** Cliente não precisa criar conta
2. ✅ **Empresa específica:** URL/QR Code já identifica
3. ✅ **Branding:** Cliente vê visual da empresa
4. ✅ **Segmentação:** Cada empresa tem seus transportadores
5. ✅ **Marketing:** QR Code/Links específicos por empresa
6. ✅ **Rastreável:** Link único de acompanhamento

---

## 🔐 **SEGURANÇA:**

### **Prevenção de Spam:**

```typescript
// Limitar pedidos por IP/Email:
const ultimoPedido = await supabase
  .from('corridas')
  .select('data')
  .or(`email_cliente.eq.${email},ip_cliente.eq.${ip}`)
  .order('data', { ascending: false })
  .limit(1)
  .single()

if (ultimoPedido && (Date.now() - new Date(ultimoPedido.data).getTime()) < 60000) {
  throw new Error('Aguarde 1 minuto antes de fazer novo pedido')
}
```

---

## 📊 **HISTÓRICO DO VISITANTE:**

### **Como cliente visitante acessa histórico?**

**Opção A: Por Email**
```
Cliente acessa: http://localhost:3000/meus-pedidos
Informa email: joao@email.com
Recebe código de verificação no email
Vê todos os pedidos daquele email
```

**Opção B: Por Link Direto**
```
Cada pedido tem link único:
http://localhost:3000/corrida/ABC123

Cliente salva o link ou recebe por email/SMS
Acessa para ver status/histórico daquele pedido específico
```

---

## 💡 **INCENTIVO AO CADASTRO:**

```
Após 3 pedidos como visitante:

"👋 Notamos que você já usou nosso serviço 3 vezes!
Que tal criar uma conta?

✅ Histórico unificado
✅ Endereços favoritos
✅ Pagamentos salvos
✅ Descontos exclusivos

[Criar Conta Grátis]  [Continuar sem conta]"
```

---

**Criado em:** 13/10/2025  
**Status:** ✅ Documentado


