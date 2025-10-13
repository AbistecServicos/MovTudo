# 📋 INSTRUÇÕES PARA CRIAR USUÁRIOS CORRETOS

## 🎯 **ESTRUTURA DE DOMÍNIOS DO MOVTUDO**

```
movtudo.com.br                      ← Site raiz (Admin)
movtudo.com.br/mototaxiexpress     ← Empresa E1
movtudo.com.br/empresa2            ← Empresa E2
movtudo.com.br/empresa3            ← Empresa E3
```

---

## 👑 **ADMINISTRADOR (JÁ EXISTE)**

- **Site:** `movtudo.com.br`
- **Campo:** `is_admin = true` (tabela usuarios)
- **Nome:** Almir da Silva Salles
- **Email:** `almirdss@gmail.com.br`
- **Usuário:** `almirdss`
- **Status:** ✅ Já cadastrado

---

## 🚚 **EMPRESA E1 - MOTOTAXI EXPRESS**

### **📍 Site:** `movtudo.com.br/mototaxiexpress`

### **1️⃣ GERENTE DA E1**

**No Supabase Dashboard → Authentication → Users → Add User:**

```
Email: gerente_movtudo_e1@abistec.com.br
Password: Gerente1_movtudo_e1*
☑️ Auto Confirm User
```

**Depois, execute no SQL Editor:**

```sql
-- 1. Inserir na tabela usuarios
INSERT INTO usuarios (
    uid,
    email,
    nome_usuario,
    nome_completo,
    telefone,
    is_admin
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'gerente_movtudo_e1@abistec.com.br'),
    'gerente_movtudo_e1@abistec.com.br',
    'gerente1_movtudo_e1',
    'Gerente1 da MovTudo Empresa E1',
    '21983496342',
    false
) RETURNING *;

-- 2. Associar à empresa E1
INSERT INTO empresa_associada (
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    empresa_nome,
    email_usuario
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'gerente_movtudo_e1@abistec.com.br'),
    'Gerente1 da MovTudo Empresa E1',
    'gerente',
    'E1',
    'Moto Taxi Express',
    'gerente_movtudo_e1@abistec.com.br'
) RETURNING *;
```

---

### **2️⃣ TRANSPORTADOR DA E1**

**No Supabase Dashboard → Authentication → Users → Add User:**

```
Email: transportador1_movtudo@abistec.com.br
Password: Transportador1_movtudo*
☑️ Auto Confirm User
```

**Depois, execute no SQL Editor:**

```sql
-- 1. Inserir na tabela usuarios
INSERT INTO usuarios (
    uid,
    email,
    nome_usuario,
    nome_completo,
    telefone,
    is_admin
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'transportador1_movtudo@abistec.com.br'),
    'transportador1_movtudo@abistec.com.br',
    'transportador1_movtudo',
    'Transportador da MovTudo',
    '21983496342',
    false
) RETURNING *;

-- 2. Associar à empresa E1
INSERT INTO empresa_associada (
    uid_usuario,
    nome_completo,
    funcao,
    id_empresa,
    empresa_nome,
    email_usuario,
    veiculo,
    carga_maxima
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'transportador1_movtudo@abistec.com.br'),
    'Transportador da MovTudo',
    'transportador',
    'E1',
    'Moto Taxi Express',
    'transportador1_movtudo@abistec.com.br',
    'Moto',
    50
) RETURNING *;
```

---

## 📊 **VERIFICAR SE CRIOU CORRETAMENTE**

```sql
-- Ver todos os usuários
SELECT
    u.id,
    u.email,
    u.nome_usuario,
    u.nome_completo,
    u.is_admin,
    ea.funcao,
    ea.id_empresa,
    ea.empresa_nome
FROM usuarios u
LEFT JOIN empresa_associada ea ON u.uid = ea.uid_usuario
ORDER BY u.is_admin DESC, ea.funcao, u.nome_completo;
```

---

## 🔐 **RESUMO DE CREDENCIAIS**

| Tipo | Usuário | Email | Senha | Empresa |
|------|---------|-------|-------|---------|
| **Admin** | `almirdss` | `almirdss@gmail.com.br` | (sua senha) | - |
| **Gerente** | `gerente1_movtudo_e1` | `gerente_movtudo_e1@abistec.com.br` | `Gerente1_movtudo_e1*` | E1 |
| **Transportador** | `transportador1_movtudo` | `transportador1_movtudo@abistec.com.br` | `Transportador1_movtudo*` | E1 |

---

## ⚠️ **IMPORTANTE: LÓGICA DO SISTEMA**

### **Transportador:**
- ✅ Pode se cadastrar em **várias empresas**
- ✅ Vê **todas as empresas** que presta serviço
- ✅ Aceita corridas de **qualquer empresa** que está vinculado

### **Gerente:**
- ✅ Vê **apenas sua empresa**
- ✅ Gerencia **apenas os transportadores** da sua empresa
- ❌ **NÃO** vê outras empresas

### **Admin:**
- ✅ Vê **todas as empresas**
- ✅ Cadastra **novas empresas**
- ✅ Cria **gerentes** para as empresas

