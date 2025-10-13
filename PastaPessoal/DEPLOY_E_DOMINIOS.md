# 🌐 DEPLOY E DOMÍNIOS - MovTudo

## 📍 **ESTRUTURA DE DOMÍNIOS E ROTAS**

### **Site Raiz**
```
movtudo.com.br
```
**Quem acessa:**
- ✅ **Administrador** - Login e área administrativa
- ✅ **Transportadores** - Login geral (podem trabalhar para várias empresas)
- ✅ Página inicial pública

### **Subdiretórios por Empresa (Rotas Dinâmicas)**
```
movtudo.com.br/mototaxiexpress   ← Empresa E1
movtudo.com.br/empresa2          ← Empresa E2
movtudo.com.br/empresa3          ← Empresa E3
```

**Quem acessa:**
- ✅ **Clientes** - Solicitam corridas da empresa específica
- ✅ **Gerentes** - Login na página da empresa (só podem gerenciar UMA empresa)

**Cada subdiretório terá:**
- Página personalizada (cores, logo da empresa)
- Sistema de solicitação de corridas para clientes
- Login específico para gerente daquela empresa
- Área pública com informações da empresa

---

## 🚀 **DEPLOY NA VERCEL**

### **1️⃣ Preparar Projeto para Deploy**

#### **Arquivo `.gitignore` (Verificar)**
```
# Não commitar
.env.local
.env*.local
node_modules/
.next/
out/
```

#### **Arquivo `vercel.json` (Criar)**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["gru1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  }
}
```

---

### **2️⃣ Deploy no Vercel**

#### **Opção A: Via GitHub (Recomendado)**

1. **Commit e Push para GitHub:**
```bash
git add .
git commit -m "Preparar para deploy"
git push origin main
```

2. **Conectar no Vercel:**
   - Acesse: https://vercel.com
   - Clique em "Add New Project"
   - Selecione o repositório `MovTudo`
   - Framework Preset: **Next.js** (detecta automaticamente)

3. **Configurar Variáveis de Ambiente:**
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://buxpuusxglavepfrivwg.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua chave anon)
   - `SUPABASE_SERVICE_ROLE_KEY` = (sua chave service role)
   - `NEXT_PUBLIC_APP_URL` = `https://movtudo.com.br`

4. **Deploy:**
   - Clique em "Deploy"
   - Aguarde a build

---

#### **Opção B: Via Vercel CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel --prod
```

---

### **3️⃣ Configurar Domínio Personalizado**

#### **No Hostinger (Onde está seu domínio):**

1. **Acessar DNS do domínio `movtudo.com.br`**
2. **Adicionar registro CNAME:**
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Ou usar A Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600
   ```

#### **No Vercel Dashboard:**

1. **Ir em:** Settings → Domains
2. **Adicionar domínio:** `movtudo.com.br`
3. **Aguardar propagação** (até 48h, geralmente 1-2h)

---

### **4️⃣ Configurar Rotas Dinâmicas (Empresas)**

**A estrutura atual já suporta rotas dinâmicas:**

```
/                          → Página inicial
/login                     → Login geral
/admin                     → Área administrativa
/[empresa_slug]            → Página da empresa (criar)
/[empresa_slug]/login      → Login da empresa (criar)
```

**Exemplo de uso:**
- `movtudo.com.br/mototaxiexpress` → Mostra página da Moto Taxi Express
- `movtudo.com.br/mototaxiexpress/login` → Login para gerente/transportador da E1

---

## 🏗️ **COMO FUNCIONA TECNICAMENTE (Vercel + Next.js)**

### **Não é Multisite, é Rota Dinâmica!**

```
📁 src/app/
├── page.tsx                    ← movtudo.com.br
├── login/
│   └── page.tsx               ← movtudo.com.br/login
├── [slug]/                    ← ROTA DINÂMICA!
│   ├── page.tsx               ← movtudo.com.br/mototaxiexpress
│   └── login/
│       └── page.tsx           ← movtudo.com.br/mototaxiexpress/login
```

### **Como o Next.js processa:**

1. **Cliente acessa:** `movtudo.com.br/mototaxiexpress`
2. **Next.js captura:** `[slug] = "mototaxiexpress"`
3. **Sistema busca no banco:**
   ```sql
   SELECT * FROM empresas WHERE slug = 'mototaxiexpress'
   ```
4. **Renderiza página personalizada** com:
   - Logo da empresa
   - Cores da empresa
   - Informações específicas
5. **Uma única URL na Vercel** gerencia todas as empresas!

### **Vantagens dessa abordagem:**

✅ **Uma única hospedagem** na Vercel
✅ **Não precisa criar site** para cada empresa
✅ **Adicionar nova empresa** = só inserir no banco
✅ **Gerenciamento simplificado** (1 deploy, todas empresas)
✅ **Performance otimizada** (cache compartilhado)
✅ **Custo reduzido** (1 projeto Vercel)

### **Diferença do WooCommerce Multisite:**

| Aspecto | WooCommerce Multisite | MovTudo (Next.js) |
|---------|----------------------|-------------------|
| **Instalação** | Múltiplas instalações WordPress | 1 aplicação Next.js |
| **Banco de Dados** | Múltiplas tabelas prefixadas | 1 tabela de empresas |
| **Deploy** | Deploy de cada site | 1 deploy único |
| **Configuração** | DNS para cada subdomínio | Slug no banco |
| **Manutenção** | Complexa | Simples |

---

## 🔄 **WORKFLOW DE DEPLOY**

### **Desenvolvimento Local:**
```bash
npm run dev
# http://localhost:3000
```

### **Deploy Automático (GitHub → Vercel):**
1. Fazer alterações no código
2. Commit e push para GitHub
3. Vercel detecta e faz deploy automático
4. URL de produção atualizada

### **Deploy Manual (Vercel CLI):**
```bash
vercel --prod
```

---

## 📊 **ROTAS DINÂMICAS (Subdiretórios)**

### **✅ Como funciona:**
```
movtudo.com.br/mototaxiexpress  ← Slug da empresa E1
movtudo.com.br/empresa2         ← Slug da empresa E2
```

**Vantagens:**
- ✅ Uma única configuração de domínio
- ✅ Rotas gerenciadas pelo Next.js
- ✅ Slug único da empresa no banco de dados
- ✅ Não precisa configurar DNS para cada empresa
- ✅ Similar ao WooCommerce Multisite, mas usando rotas dinâmicas

### **🎯 Quem usa cada URL:**

| URL | Quem Acessa | Finalidade |
|-----|-------------|------------|
| `movtudo.com.br` | Admin + Transportadores | Login geral, área admin |
| `movtudo.com.br/mototaxiexpress` | Clientes + Gerente E1 | Solicitar corrida, gerenciar E1 |
| `movtudo.com.br/empresa2` | Clientes + Gerente E2 | Solicitar corrida, gerenciar E2 |

### **🔐 Lógica de Login:**

1. **Administrador:**
   - Login em: `movtudo.com.br/login`
   - Acessa: Todas as empresas

2. **Transportador:**
   - Login em: `movtudo.com.br/login`
   - Acessa: Dashboard com TODAS as empresas vinculadas
   - Pode aceitar corridas de qualquer empresa

3. **Gerente:**
   - Login em: `movtudo.com.br/mototaxiexpress/login`
   - Acessa: APENAS a empresa E1
   - Não vê outras empresas

4. **Cliente:**
   - Acessa: `movtudo.com.br/mototaxiexpress`
   - Solicita corrida daquela empresa específica
   - Pode ou não fazer login

---

## 🗄️ **ESTRUTURA NO BANCO (Slug)**

```sql
-- Tabela empresas
CREATE TABLE empresas (
    id_empresa TEXT PRIMARY KEY,        -- 'E1'
    empresa_nome TEXT NOT NULL,         -- 'Moto Taxi Express'
    slug TEXT UNIQUE NOT NULL,          -- 'mototaxiexpress'
    ...
);
```

**Quando acessar:**
- `movtudo.com.br/mototaxiexpress` 
- Sistema busca empresa com `slug = 'mototaxiexpress'`
- Renderiza página personalizada

---

## 🔐 **VARIÁVEIS DE AMBIENTE**

### **Local (`.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://buxpuusxglavepfrivwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Produção (Vercel):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://buxpuusxglavepfrivwg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
NEXT_PUBLIC_APP_URL=https://movtudo.com.br
```

---

## 📱 **EXEMPLOS DE FLUXO**

### **1️⃣ Cliente solicita corrida:**
1. Acessa: `movtudo.com.br/mototaxiexpress`
2. Sistema carrega página personalizada da empresa E1
3. Cliente preenche origem/destino e solicita corrida
4. Sistema notifica transportadores vinculados à E1
5. Transportador aceita e faz a entrega

### **2️⃣ Gerente gerencia sua empresa:**
1. Acessa: `movtudo.com.br/mototaxiexpress/login`
2. Faz login com email do gerente
3. Sistema identifica que é gerente da E1
4. Redireciona para dashboard da E1
5. Vê **apenas** corridas e transportadores da E1
6. ❌ **NÃO vê** outras empresas

### **3️⃣ Transportador trabalha para várias empresas:**
1. Acessa: `movtudo.com.br/login` (site raiz)
2. Faz login com email do transportador
3. Sistema lista **todas** as empresas vinculadas (E1, E2, E3...)
4. Pode aceitar corridas de **qualquer** empresa
5. Dashboard mostra corridas de **todas** as empresas

### **4️⃣ Administrador gerencia tudo:**
1. Acessa: `movtudo.com.br/login`
2. Faz login como admin
3. Acessa área administrativa
4. Vê e gerencia **todas** as empresas
5. Cadastra novas empresas e gerentes

---

## 🎯 **PRÓXIMOS PASSOS**

1. ✅ Criar usuários corretos (gerente e transportador)
2. ⏳ Testar login local
3. ⏳ Criar rota dinâmica `[empresa_slug]`
4. ⏳ Testar sistema completo localmente
5. ⏳ Deploy no Vercel
6. ⏳ Configurar domínio `movtudo.com.br`
7. ⏳ Testar em produção

---

## 📞 **SUPORTE**

**Domínio:** Hostinger
**Deploy:** Vercel
**Banco:** Supabase
**Código:** GitHub (@AbistecServicos/MovTudo)


