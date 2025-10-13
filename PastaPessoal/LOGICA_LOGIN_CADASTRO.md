# 🔐 LÓGICA: Login e Cadastro por Tipo de Usuário

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Definir onde cada tipo de usuário faz login/cadastro

---

## 📊 **TABELA DECISÓRIA:**

| Tipo de Usuário | Acessa Sistema Por | Login | Cadastro | Motivo |
|----------------|-------------------|-------|----------|--------|
| **Cliente** | QR Code/Link da empresa | `/[slug]/login` | `/[slug]/cadastro` | Interage com UMA empresa específica |
| **Gerente** | Link direto MovTudo | `/login` (geral) | Criado pelo Admin | Trabalha em UMA empresa, mas acesso é profissional |
| **Transportador** | Link direto MovTudo | `/login` (geral) | Criado pelo Gerente | Trabalha em MÚLTIPLAS empresas |
| **Admin** | Link direto MovTudo | `/login` (geral) | Criado manualmente | Acesso total ao sistema |

---

## 🌐 **PORTAIS DE ENTRADA:**

### **Portal 1: Página da Empresa** (`/[slug]`)

**Quem usa:**
- ✅ **Cliente final** (pessoa física querendo taxi/entrega)

**Como chegam:**
- 📱 QR Code da empresa
- 🔗 Link compartilhado (WhatsApp, redes sociais)
- 🌐 Google (busca "moto taxi rio de janeiro")
- 📧 Email marketing da empresa

**URLs:**
```
http://localhost:3000/moto-taxi-express         → Página da empresa
http://localhost:3000/moto-taxi-express/login   → Login de cliente
http://localhost:3000/moto-taxi-express/cadastro → Cadastro de cliente
```

**Características:**
- ✅ Mostra branding da empresa (logo, cores)
- ✅ Cliente já sabe qual empresa quer usar
- ✅ Cadastro = cliente dessa empresa
- ✅ Login = cliente retornando

---

### **Portal 2: Página Raiz MovTudo** (`/`)

**Quem usa:**
- ✅ **Administrador**
- ✅ **Gerente**
- ✅ **Transportador**

**Como chegam:**
- 🔗 Link direto fornecido pelo admin/gerente
- 📧 Email de convite
- 💼 Contato profissional

**URLs:**
```
http://localhost:3000/              → Página inicial MovTudo
http://localhost:3000/login         → Login geral (admin/gerente/transportador)
http://localhost:3000/cadastro      → Cadastro geral (para criar conta pessoal)
```

**Características:**
- ✅ Layout neutro (sem branding de empresa específica)
- ✅ Lista de empresas disponíveis (opcional)
- ✅ Login = usuário do sistema (profissional)

---

## 🔄 **FLUXOS DETALHADOS:**

### **FLUXO 1: Cliente acessa via QR Code da empresa**

```
1. Cliente vê QR Code da "Moto Taxi Express"
   ↓
2. Escaneia → http://localhost:3000/moto-taxi-express
   ↓
3. Vê página com logo/cores da empresa
   ↓
4. Opções:
   
   A) Solicitar como VISITANTE:
      - Clica "Solicitar Corrida Agora"
      - Preenche nome/telefone/email
      - Submete pedido (sem login)
   
   B) Fazer LOGIN:
      - Clica "Entrar"
      - Vai para: /moto-taxi-express/login
      - Faz login
      - Redireciona: /moto-taxi-express
      - Dados pré-preenchidos
   
   C) Fazer CADASTRO:
      - Clica "Cadastrar"
      - Vai para: /moto-taxi-express/cadastro
      - Cria conta
      - Redireciona: /moto-taxi-express
      - Dados salvos no perfil
```

---

### **FLUXO 2: Gerente recebe convite**

```
1. Admin cria gerente no sistema
   ↓
2. Gerente recebe email:
   "Você foi cadastrado como gerente da Moto Taxi Express!
    Acesse: http://localhost:3000/login
    Email: gerente@empresa.com
    Senha temporária: XYZ123"
   ↓
3. Gerente acessa /login (portal geral)
   ↓
4. Faz login
   ↓
5. Sistema detecta: funcao = 'gerente' + id_empresa = 'E1'
   ↓
6. Redireciona: /moto-taxi-express (slug da SUA empresa)
```

---

### **FLUXO 3: Transportador é cadastrado**

```
1. Gerente cadastra transportador
   ↓
2. Transportador recebe email:
   "Você foi cadastrado como transportador!
    Acesse: http://localhost:3000/login
    Email: transportador@email.com
    Senha temporária: ABC456"
   ↓
3. Transportador acessa /login (portal geral)
   ↓
4. Faz login
   ↓
5. Sistema detecta: funcao = 'transportador'
   ↓
6. Redireciona: /transportador
```

---

### **FLUXO 4: Admin acessa sistema**

```
1. Admin acessa: http://localhost:3000/login
   ↓
2. Faz login
   ↓
3. Sistema detecta: is_admin = true
   ↓
4. Redireciona: /admin
```

---

## 🔐 **ESTRUTURA DE URLs DE LOGIN/CADASTRO:**

### **Para CLIENTE (via empresa):**

```
/[slug]/login        → Login de cliente nessa empresa
/[slug]/cadastro     → Cadastro de cliente nessa empresa
```

**Características:**
- ✅ Mostra logo/cores da empresa
- ✅ Título: "Entrar na Moto Taxi Express"
- ✅ Ao cadastrar: salva `id_empresa_preferida = 'E1'` em `usuarios`

---

### **Para GERENTE/TRANSPORTADOR/ADMIN (portal geral):**

```
/login               → Login geral do sistema
/cadastro            → Cadastro geral (cliente sem empresa específica)
```

**Características:**
- ✅ Layout neutro MovTudo
- ✅ Título: "Entrar no MovTudo"
- ✅ Após login: redireciona conforme tipo

---

## 📝 **ATUALIZAÇÃO DA PÁGINA `/[slug]`:**

### **Botões CORRETOS:**

```tsx
{/* Para CLIENTE */}
<Link href={`/${slug}/login`}>Entrar</Link>
<Link href={`/${slug}/cadastro`}>Cadastrar</Link>

{/* OU opção alternativa: */}
<Link href={`/login?empresa=${slug}`}>Entrar</Link>
<Link href={`/cadastro?empresa=${slug}`}>Cadastrar</Link>
```

---

## 🎯 **DECISÃO ARQUITETURAL:**

### **Opção A: Login/Cadastro POR EMPRESA**
```
/moto-taxi-express/login
/moto-taxi-express/cadastro
```

✅ **VANTAGENS:**
- Branding da empresa
- Cliente já sabe onde está
- Experiência personalizada

❌ **DESVANTAGENS:**
- Mais páginas para criar
- Cliente pode se cadastrar em múltiplas empresas

---

### **Opção B: Login/Cadastro GERAL com Parâmetro**
```
/login?empresa=moto-taxi-express
/cadastro?empresa=moto-taxi-express
```

✅ **VANTAGENS:**
- 1 página de login/cadastro apenas
- Mais simples de manter
- Cliente pode mudar de empresa

❌ **DESVANTAGENS:**
- Menos personalizado
- Layout genérico

---

## 🏆 **MINHA RECOMENDAÇÃO:**

### **OPÇÃO A (Login/Cadastro por Empresa) para Cliente**

**Por quê?**
1. ✅ Melhor UX para cliente
2. ✅ Branding da empresa
3. ✅ Cliente já sabe onde está
4. ✅ Marketing mais efetivo

**Para Gerente/Transportador/Admin:**
- ✅ Login geral `/login`

---

## 💻 **QUERO IMPLEMENTAR?**

**Vou criar:**
1. ✅ `/[slug]/login/page.tsx`
2. ✅ `/[slug]/cadastro/page.tsx`
3. ✅ Atualizar links na página `/[slug]`

**Posso prosseguir?** (Sim/Não)

Ou você prefere a **OPÇÃO B** (login geral com parâmetro)?

**Aguardo sua decisão!** 🤔

