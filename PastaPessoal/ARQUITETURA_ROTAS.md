# 🏗️ ARQUITETURA DE ROTAS - MovTudo

## 🎯 **CONCEITO PRINCIPAL**

O MovTudo **NÃO** é um sistema multisite. É uma **aplicação única** que usa **rotas dinâmicas** para servir múltiplas empresas.

---

## 📊 **ESTRUTURA DE ROTAS**

```
movtudo.com.br/                    ← Site Raiz
├── /                              ← Página inicial pública
├── /login                         ← Login geral (Admin + Transportadores)
├── /cadastro                      ← Cadastro de usuários
├── /perfil                        ← Perfil do usuário logado
├── /admin                         ← Área administrativa (só Admin)
│
└── /[slug]                        ← ROTA DINÂMICA (Empresas)
    ├── /mototaxiexpress          ← Empresa E1
    │   ├── /                     ← Página pública da empresa
    │   ├── /login                ← Login do gerente
    │   └── /solicitar            ← Cliente solicita corrida
    │
    ├── /empresa2                 ← Empresa E2
    │   ├── /                     ← Página pública da empresa
    │   ├── /login                ← Login do gerente
    │   └── /solicitar            ← Cliente solicita corrida
    │
    └── /empresa3                 ← Empresa E3
        └── ...
```

---

## 👥 **QUEM ACESSA ONDE**

### **1️⃣ Site Raiz (`movtudo.com.br`)**

#### **Administrador:**
- ✅ Acessa: `movtudo.com.br/login`
- ✅ Dashboard: `movtudo.com.br/admin`
- ✅ Vê: **Todas as empresas**
- ✅ Pode: Cadastrar empresas e gerentes

#### **Transportador:**
- ✅ Acessa: `movtudo.com.br/login`
- ✅ Dashboard: `movtudo.com.br/transportador`
- ✅ Vê: **Todas as empresas** vinculadas
- ✅ Pode: Aceitar corridas de **qualquer** empresa
- 🔑 **Motivo:** Pode trabalhar para várias empresas

---

### **2️⃣ Subdiretório da Empresa (`movtudo.com.br/[slug]`)**

#### **Gerente:**
- ✅ Acessa: `movtudo.com.br/mototaxiexpress/login`
- ✅ Dashboard: `movtudo.com.br/gerente`
- ✅ Vê: **Apenas** a empresa E1
- ❌ NÃO vê: Outras empresas
- 🔑 **Motivo:** Gerente está vinculado a **UMA** empresa apenas

#### **Cliente:**
- ✅ Acessa: `movtudo.com.br/mototaxiexpress`
- ✅ Solicita: Corrida daquela empresa
- ✅ Vê: Informações públicas da empresa
- 🔑 **Motivo:** Cliente escolhe qual empresa vai usar

---

## 🔐 **MATRIZ DE ACESSO**

| Tipo de Usuário | URL de Login | Vê Múltiplas Empresas? | Pode Trocar de Empresa? |
|-----------------|--------------|------------------------|-------------------------|
| **Administrador** | `movtudo.com.br/login` | ✅ Sim (todas) | ✅ Sim |
| **Transportador** | `movtudo.com.br/login` | ✅ Sim (vinculadas) | ✅ Sim |
| **Gerente** | `movtudo.com.br/mototaxiexpress/login` | ❌ Não (só sua) | ❌ Não |
| **Cliente** | `movtudo.com.br/mototaxiexpress` | ❌ Não | ✅ Sim (mudando URL) |

---

## 🏗️ **IMPLEMENTAÇÃO TÉCNICA**

### **Estrutura de Pastas (Next.js App Router)**

```
📁 src/app/
├── 📄 page.tsx                     # Página inicial
├── 📁 login/
│   └── 📄 page.tsx                # Login geral
├── 📁 cadastro/
│   └── 📄 page.tsx                # Cadastro
├── 📁 perfil/
│   └── 📄 page.tsx                # Perfil do usuário
├── 📁 admin/
│   ├── 📄 layout.tsx              # Layout admin
│   └── 📁 empresas/
│       └── 📄 page.tsx            # Gerenciar empresas
├── 📁 gerente/
│   └── 📄 page.tsx                # Dashboard gerente
├── 📁 transportador/
│   └── 📄 page.tsx                # Dashboard transportador
│
└── 📁 [slug]/                      # ⭐ ROTA DINÂMICA
    ├── 📄 page.tsx                 # Página pública da empresa
    ├── 📁 login/
    │   └── 📄 page.tsx            # Login do gerente
    └── 📁 solicitar/
        └── 📄 page.tsx            # Solicitar corrida
```

### **Como funciona `[slug]`:**

```typescript
// src/app/[slug]/page.tsx
export default function EmpresaPage({ params }: { params: { slug: string } }) {
  // params.slug = "mototaxiexpress"
  
  // Buscar empresa no banco
  const empresa = await getEmpresaPorSlug(params.slug)
  
  // Renderizar página personalizada
  return (
    <div style={{ backgroundColor: empresa.cor_primaria }}>
      <img src={empresa.logo} />
      <h1>{empresa.nome}</h1>
      {/* ... */}
    </div>
  )
}
```

---

## 🚀 **DEPLOY NA VERCEL**

### **Um único projeto = Todas as empresas**

```bash
# Deploy único
vercel --prod

# Resultado:
# ✅ movtudo.com.br                   (site raiz)
# ✅ movtudo.com.br/mototaxiexpress  (empresa E1)
# ✅ movtudo.com.br/empresa2         (empresa E2)
# ✅ movtudo.com.br/empresa3         (empresa E3)
```

### **Adicionar nova empresa:**

1. **NÃO** precisa fazer novo deploy
2. **NÃO** precisa configurar DNS
3. **SÓ** inserir no banco:
   ```sql
   INSERT INTO empresas (slug, empresa_nome, ...)
   VALUES ('novaempresa', 'Nova Empresa', ...);
   ```
4. **Pronto!** `movtudo.com.br/novaempresa` já funciona

---

## 💰 **COMPARAÇÃO DE CUSTOS**

### **Multisite (cada empresa = 1 site):**
```
10 empresas × $20/mês = $200/mês
```

### **Rota Dinâmica (MovTudo):**
```
1 projeto × $20/mês = $20/mês
(quantas empresas quiser!)
```

---

## 🎨 **PERSONALIZAÇÃO POR EMPRESA**

Cada empresa tem no banco:
- `slug` - URL única
- `cor_primaria` - Cor principal
- `cor_secundaria` - Cor secundária
- `empresa_logo` - Logo personalizada
- `sobre_empresa` - Texto descritivo
- `politica_privacidade` - Política específica

A página renderiza **dinamicamente** com essas informações!

---

## 📝 **RESUMO**

✅ **Uma aplicação** serve múltiplas empresas
✅ **Rotas dinâmicas** `[slug]` criam URLs únicas
✅ **Transportadores** fazem login no site raiz (trabalham para várias)
✅ **Gerentes** fazem login no subdiretório da empresa (só uma)
✅ **Clientes** acessam subdiretório para solicitar corridas
✅ **Admin** gerencia tudo pelo site raiz
✅ **Vercel** hospeda tudo em 1 projeto único

**Não é multisite, é SaaS com rotas dinâmicas!** 🚀



