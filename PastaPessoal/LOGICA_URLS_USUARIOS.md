# 🔐 LÓGICA DE URLs E REDIRECIONAMENTO POR TIPO DE USUÁRIO

**Projeto:** MovTudo  
**Data:** 13 de outubro de 2025  
**Objetivo:** Definir como cada tipo de usuário acessa o sistema

---

## 📊 TABELA RESUMO

| Tipo de Usuário | Definição | URL após Login | Múltiplas Empresas? | Vê Layout da Empresa? |
|----------------|-----------|----------------|---------------------|----------------------|
| **Administrador** | `usuarios.is_admin = true` | `http://localhost:3000/` | N/A | ❌ Não (painel admin) |
| **Gerente** | `empresa_associada.funcao = 'gerente'` | `http://localhost:3000/{slug}` | ❌ Apenas 1 | ✅ Sim (sua empresa) |
| **Transportador** | `empresa_associada.funcao = 'transportador'` | `http://localhost:3000/` | ✅ Várias (E1, E2, E3...) | ❌ Não (painel transportador) |
| **Cliente** | `usuarios.is_admin = false` + sem `empresa_associada` | `http://localhost:3000/{slug}` | ❌ Escolhe 1 | ✅ Sim (empresa escolhida) |

---

## 1️⃣ ADMINISTRADOR

### Identificação:
```sql
SELECT * FROM usuarios WHERE is_admin = true
```

### Características:
- ✅ Acesso total ao sistema
- ✅ Gerencia TODAS as empresas
- ✅ Cadastra usuários (gerentes, transportadores)
- ✅ Vê relatórios globais
- ❌ NÃO está vinculado a nenhuma empresa específica
- ❌ NÃO aparece em `empresa_associada`

### URL de Acesso:
```
http://localhost:3000/
↓
http://localhost:3000/admin
```

### Páginas Disponíveis:
- `/admin` → Dashboard geral
- `/admin/empresas` → Lista de empresas
- `/admin/empresas/[id]` → Detalhes da empresa
- `/admin/empresas/[id]/editar` → Editar empresa
- `/admin/empresas/nova` → Cadastrar empresa
- `/admin/usuarios` → Lista de usuários
- `/admin/relatorios` → Relatórios globais
- `/admin/configuracoes` → Configurações do sistema

### Layout:
- ❌ **NÃO** vê cores/logo de empresa
- ✅ Layout padrão do sistema (azul/verde padrão)

---

## 2️⃣ GERENTE

### Identificação:
```sql
SELECT ea.* 
FROM empresa_associada ea
WHERE ea.uid_usuario = '[UID_DO_USUARIO]'
  AND ea.funcao = 'gerente'
  AND ea.status_vinculacao = 'ativo'
```

### Características:
- ✅ Gerencia UMA empresa específica
- ✅ Cadastra/edita transportadores da sua empresa
- ✅ Vê corridas da sua empresa
- ✅ Relatórios da sua empresa
- ❌ **NÃO** pode estar em múltiplas empresas
- ✅ **REGRA:** 1 gerente = 1 empresa APENAS

### URL de Acesso:
```
http://localhost:3000/
↓
http://localhost:3000/moto-taxi-express (slug da empresa)
```

### Páginas Disponíveis:
- `/[slug]` → Dashboard da empresa
- `/[slug]/corridas` → Corridas da empresa
- `/[slug]/transportadores` → Transportadores
- `/[slug]/relatorios` → Relatórios da empresa
- `/[slug]/configuracoes` → Configurações da empresa

### Layout:
- ✅ **VÊ** cores primária/secundária da empresa
- ✅ **VÊ** logo da empresa
- ✅ Branding completo da empresa

---

## 3️⃣ TRANSPORTADOR

### Identificação:
```sql
SELECT ea.* 
FROM empresa_associada ea
WHERE ea.uid_usuario = '[UID_DO_USUARIO]'
  AND ea.funcao = 'transportador'
  AND ea.status_vinculacao = 'ativo'
```

### Características:
- ✅ Pode estar em MÚLTIPLAS empresas (E1, E2, E3...)
- ✅ Vê corridas de TODAS as suas empresas
- ✅ Aceita/rejeita corridas
- ✅ Histórico consolidado
- ✅ **REGRA:** 1 transportador = N empresas

### URL de Acesso:
```
http://localhost:3000/
↓
http://localhost:3000/transportador
```

### Páginas Disponíveis:
- `/transportador` → Dashboard consolidado
- `/transportador/corridas` → Corridas de todas as empresas
- `/transportador/historico` → Histórico completo
- `/transportador/estatisticas` → Estatísticas pessoais
- `/perfil` → Editar perfil pessoal

### Layout:
- ❌ **NÃO** vê cores/logo de empresa específica
- ✅ Layout neutro/padrão
- **Motivo:** Trabalha para várias empresas

---

## 4️⃣ CLIENTE

### Identificação:
```sql
SELECT * FROM usuarios 
WHERE uid = '[UID_DO_USUARIO]'
  AND is_admin = false
  AND NOT EXISTS (
    SELECT 1 FROM empresa_associada 
    WHERE uid_usuario = '[UID_DO_USUARIO]'
  )
```

### Características:
- ✅ Usuário comum/final
- ✅ Solicita corridas
- ✅ Escolhe uma empresa para usar
- ❌ NÃO tem vínculo fixo
- ❌ NÃO aparece em `empresa_associada`

### URL de Acesso:
```
Cliente visita: http://localhost:3000/moto-taxi-express
↓
Faz login/cadastro
↓
Fica em: http://localhost:3000/moto-taxi-express
```

### Páginas Disponíveis:
- `/[slug]` → Página da empresa (solicitar corrida)
- `/[slug]/corridas` → Minhas corridas nesta empresa
- `/[slug]/historico` → Histórico nesta empresa
- `/perfil` → Editar perfil pessoal

### Layout:
- ✅ **VÊ** cores primária/secundária da empresa
- ✅ **VÊ** logo da empresa
- ✅ Branding completo da empresa escolhida

---

## 🔄 IMPLEMENTAÇÃO - Código de Redirecionamento

### Localização:
- **Arquivo:** `src/context/AuthContext.tsx`
- **Função:** `signIn()` ou `useEffect()` após login

### Lógica Pseudocódigo:

```typescript
async function redirectAfterLogin(user, empresaAssociada, empresa) {
  
  // 1. Verificar se é ADMINISTRADOR
  if (user.is_admin === true) {
    router.push('/admin')
    return
  }
  
  // 2. Verificar se tem vínculo com empresa
  if (empresaAssociada) {
    
    // 2a. Se é GERENTE → vai para slug da empresa
    if (empresaAssociada.funcao === 'gerente') {
      const slug = empresa.slug // Ex: 'moto-taxi-express'
      router.push(`/${slug}`)
      return
    }
    
    // 2b. Se é TRANSPORTADOR → vai para raiz
    if (empresaAssociada.funcao === 'transportador') {
      router.push('/transportador')
      return
    }
  }
  
  // 3. Se NÃO tem vínculo → é CLIENTE
  // Cliente fica na URL que ele acessou (slug da empresa)
  // Não redireciona!
  
}
```

---

## 🔐 CONTROLE DE ACESSO (Proteção de Rotas)

### Arquivo: `src/middleware.ts` ou `layout.tsx`

### Regras:

| Rota | Quem pode acessar |
|------|-------------------|
| `/admin/*` | Apenas `is_admin = true` |
| `/[slug]/*` (exceto `/gerente`) | Cliente + Gerente |
| `/[slug]/gerente/*` | Apenas Gerente da empresa |
| `/transportador/*` | Apenas Transportador |
| `/perfil` | Gerente + Transportador + Cliente |

### Código Exemplo:

```typescript
// src/middleware.ts ou verificação em layout

if (pathname.startsWith('/admin')) {
  if (!user.is_admin) {
    redirect('/') // Não autorizado
  }
}

if (pathname.includes('/gerente')) {
  if (empresaAssociada?.funcao !== 'gerente') {
    redirect('/') // Não autorizado
  }
}

if (pathname.startsWith('/transportador')) {
  if (empresaAssociada?.funcao !== 'transportador') {
    redirect('/') // Não autorizado
  }
}
```

---

## 📂 **ESTRUTURA DE PASTAS:**

```
src/app/
├── admin/                    # Administrador
│   ├── page.tsx              # Dashboard admin
│   ├── empresas/
│   ├── usuarios/
│   └── relatorios/
│
├── transportador/            # Transportador
│   ├── page.tsx              # Dashboard transportador
│   ├── corridas/
│   └── historico/
│
├── [slug]/                   # Gerente + Cliente
│   ├── page.tsx              # Página pública (cliente) ou dashboard (gerente)
│   ├── corridas/
│   ├── gerente/              # Apenas gerente
│   │   ├── transportadores/
│   │   └── configuracoes/
│   └── solicitar/            # Cliente solicita corrida
│
└── perfil/                   # Todos (exceto admin)
    └── page.tsx
```

---

## 💾 **SALVANDO DOCUMENTAÇÃO:**

<function_calls>
<invoke name="search_replace">
<parameter name="file_path">PastaPessoal/CONTEXTO_CONVERSA.md

