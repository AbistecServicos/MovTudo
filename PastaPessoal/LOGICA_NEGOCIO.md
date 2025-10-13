# 📋 LÓGICA DE NEGÓCIO - MovTudo

## 🏢 **EMPRESA DETENTORA**
- **Abistec Serviços Tecnológicos Ltda**
- **Proprietária do SaaS MovTudo**
- **Responsável pela venda e configuração do sistema**

## 👑 **ADMINISTRADOR DO SISTEMA**
- **Usuário:** `almirdss@gmail.com` (Almir da Silva Salles)
- **Função:** Único responsável por cadastrar novas empresas
- **Acesso:** Painel administrativo completo

## 🚚 **FLUXO DE NEGÓCIO**

### **1️⃣ Empresa Precisa de Transporte**
- Empresa de transporte liga para **Abistec Serviços Tecnológicos**
- Solicita implementação do sistema MovTudo

### **2️⃣ Configuração pelo Administrador**
- **Almir (admin)** acessa o sistema
- Cadastra a nova empresa de transporte
- Cria o primeiro gerente da empresa
- Configura permissões e funcionalidades

### **3️⃣ Uso da Empresa**
- **Gerente** acessa o sistema com suas credenciais
- Gerencia transportadores e corridas
- **Transportadores** acessam via app/mobile
- **Clientes** fazem solicitações de transporte

## 🎯 **PÁGINA INICIAL CORRIGIDA**

### **❌ REMOVIDO (Incorreto):**
- ~~"Gerenciar Empresas"~~ (só admin pode)
- ~~"Criar Primeira Empresa"~~ (só admin pode)
- ~~Links diretos para área administrativa~~

### **✅ MANTIDO (Correto):**
- **"Acessar Sistema"** → Login para usuários cadastrados
- **"Cadastrar-se"** → Cadastro de novos usuários
- **"Falar no WhatsApp"** → Contato com Abistec

## 🔐 **NÍVEIS DE ACESSO**

### **👑 Administrador (Almir)**
- **Usuário:** `almirdss`
- **Email:** `almirdss@gmail.com.br`
- **Site:** `movtudo.com.br`
- **Acesso:**
  - ✅ Cadastrar empresas
  - ✅ Criar gerentes
  - ✅ Configurar sistema
  - ✅ Ver **todas as empresas**
  - ✅ Acesso total ao sistema

### **👔 Gerente de Empresa**
- **Usuário:** `gerente1_movtudo_e1`
- **Nome:** Gerente1 da MovTudo Empresa E1
- **Email:** `gerente_movtudo_e1@abistec.com.br` (Empresa E1)
- **Site:** `movtudo.com.br/mototaxiexpress`
- **Acesso:**
  - ✅ Gerenciar transportadores **da sua empresa**
  - ✅ Visualizar corridas **da sua empresa**
  - ✅ Relatórios **da sua empresa**
  - ❌ **NÃO vê outras empresas**
  - ⚠️ Acesso limitado à **UMA única empresa**

### **🚚 Transportador**
- **Usuário:** `transportador1_movtudo`
- **Nome:** Transportador da MovTudo
- **Email:** `transportador1_movtudo@abistec.com.br`
- **Site:** `movtudo.com.br/login` (vê todas vinculadas)
- **Acesso:**
  - ✅ Aceitar/rejeitar corridas
  - ✅ Atualizar status
  - ✅ Visualizar histórico
  - ✅ **Pode se cadastrar em VÁRIAS empresas**
  - ✅ **Vê todas as empresas** que está vinculado
  - ✅ Aceita corridas de **qualquer empresa** vinculada

### **👤 Cliente**
- **Site:** `movtudo.com.br/mototaxiexpress`
- **Acesso:**
  - ✅ Solicitar transporte
  - ✅ Acompanhar entrega
  - ✅ Avaliar serviço
  - ⚠️ Acesso limitado às suas solicitações

## 📱 **INTEGRAÇÃO COM ENTREGASWOO**

### **Similaridades:**
- Sistema multiempresa
- Gestão de transportadores
- Notificações via Telegram
- Cálculo de rotas e preços

### **Diferenças:**
- **EntregasWoo:** Conecta lojas e entregadores
- **MovTudo:** Conecta empresas de transporte e clientes
- **MovTudo:** Foco em transporte de pessoas e objetos
- **EntregasWoo:** Foco em entregas de produtos

## 🎯 **OBJETIVO DO SISTEMA**

**MovTudo** é uma plataforma SaaS que permite:
1. **Empresas de transporte** gerenciarem seus negócios
2. **Transportadores** aceitarem corridas
3. **Clientes** solicitarem transporte
4. **Abistec** fornecer o sistema como serviço

---

## 🌐 **ESTRUTURA DE DOMÍNIOS**

### **Site Raiz:**
```
movtudo.com.br          ← Administrador
```

### **Sites das Empresas:**
```
movtudo.com.br/mototaxiexpress    ← Empresa E1
movtudo.com.br/empresa2           ← Empresa E2
movtudo.com.br/empresa3           ← Empresa E3
```

**Cada empresa tem:**
- Slug único no banco de dados
- Página personalizada (cores, logo)
- Sistema de corridas independente
- Gerente(s) e transportador(es) vinculados

---

## 👥 **CREDENCIAIS DE TESTE**

| Tipo | Usuário | Email | Senha | Empresa |
|------|---------|-------|-------|---------|
| **Admin** | `almirdss` | `almirdss@gmail.com.br` | (configurada) | - |
| **Gerente** | `gerente1_movtudo_e1` | `gerente_movtudo_e1@abistec.com.br` | `Gerente1_movtudo_e1*` | E1 |
| **Transportador** | `transportador1_movtudo` | `transportador1_movtudo@abistec.com.br` | `Transportador1_movtudo*` | E1 |

---

## 📞 **CONTATO PARA NOVAS EMPRESAS**
- **WhatsApp:** (21) 3272-7548
- **Email:** comercial@abistec.com.br
- **Empresa:** Abistec Serviços Tecnológicos Ltda
- **Site:** movtudo.com.br
