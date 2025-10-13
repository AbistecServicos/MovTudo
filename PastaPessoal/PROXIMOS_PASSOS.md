# 🎯 PRÓXIMOS PASSOS - MovTudo

## ⚠️ **ATENÇÃO: EMAIL DO ADMIN MUDOU**

O email do administrador agora é: **`almirdss@gmail.com.br`** (com `.br`)

Se você criou o usuário admin com `almirdss@gmail.com` (sem `.br`), você precisa:
1. Atualizar no Supabase Auth
2. Ou criar um novo usuário com o email correto

---

## 📝 **PASSO 1: DELETAR USUÁRIOS INCORRETOS**

**Execute no Supabase SQL Editor:**

```sql
-- Ver usuários existentes
SELECT id, email FROM auth.users;

-- Deletar gerente e transportador incorretos
DELETE FROM auth.users
WHERE email IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com');

-- Limpar tabela empresa_associada
DELETE FROM empresa_associada
WHERE email_usuario IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com');

-- Limpar tabela usuarios
DELETE FROM usuarios
WHERE email IN ('gerente@mototaxiexpress.com', 'transportador@mototaxiexpress.com');
```

---

## 📝 **PASSO 2: CRIAR GERENTE E TRANSPORTADOR CORRETOS**

### **A) No Supabase Dashboard → Authentication → Users → Add User**

#### **Criar Gerente:**
```
Email: gerente_movtudo_e1@abistec.com.br
Password: Gerente1_movtudo_e1*
☑️ Auto Confirm User  ← MARCAR!
```

#### **Criar Transportador:**
```
Email: transportador1_movtudo@abistec.com.br
Password: Transportador1_movtudo*
☑️ Auto Confirm User  ← MARCAR!
```

---

### **B) Executar SQL para Cadastrar na Tabela usuarios**

```sql
-- 1. GERENTE: Inserir na tabela usuarios
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
);

-- 2. TRANSPORTADOR: Inserir na tabela usuarios
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
);
```

---

### **C) Associar à Empresa E1**

```sql
-- 1. GERENTE: Associar à empresa E1
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
);

-- 2. TRANSPORTADOR: Associar à empresa E1
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
);
```

---

## 📝 **PASSO 3: VERIFICAR SE CRIOU CORRETAMENTE**

```sql
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

**Resultado esperado:**
| email | nome_usuario | is_admin | funcao | id_empresa | empresa_nome |
|-------|--------------|----------|--------|------------|--------------|
| `almirdss@gmail.com.br` | `almirdss` | `true` | `null` | `null` | `null` |
| `gerente_movtudo_e1@abistec.com.br` | `gerente1_movtudo_e1` | `false` | `gerente` | `E1` | `Moto Taxi Express` |
| `transportador1_movtudo@abistec.com.br` | `transportador1_movtudo` | `false` | `transportador` | `E1` | `Moto Taxi Express` |

---

## 📝 **PASSO 4: TESTAR LOGIN**

1. **Feche o navegador completamente** (Ctrl+Shift+Q ou fechar todas as abas)
2. **Abra novamente** o navegador
3. **Acesse:** `http://localhost:3000/login`

### **Testar 3 usuários:**

#### **Admin:**
```
Email: almirdss@gmail.com.br
Senha: (sua senha)
```
**Deve redirecionar para:** `/admin/empresas`

#### **Gerente:**
```
Email: gerente_movtudo_e1@abistec.com.br
Senha: Gerente1_movtudo_e1*
```
**Deve ver:** Dashboard da empresa E1

#### **Transportador:**
```
Email: transportador1_movtudo@abistec.com.br
Senha: Transportador1_movtudo*
```
**Deve ver:** Lista de empresas vinculadas (E1)

---

## ✅ **RESUMO DE CREDENCIAIS**

| Tipo | Usuário | Email | Senha |
|------|---------|-------|-------|
| **Admin** | `almirdss` | `almirdss@gmail.com.br` | (sua senha) |
| **Gerente** | `gerente1_movtudo_e1` | `gerente_movtudo_e1@abistec.com.br` | `Gerente1_movtudo_e1*` |
| **Transportador** | `transportador1_movtudo` | `transportador1_movtudo@abistec.com.br` | `Transportador1_movtudo*` |

---

## 🔍 **VERIFICAR LÓGICA DE PERMISSÕES**

### **Transportador pode ver VÁRIAS empresas:**
- ✅ Se cadastrar em E1, E2, E3
- ✅ Ver corridas de TODAS as empresas vinculadas
- ✅ Aceitar corridas de qualquer empresa

### **Gerente vê APENAS sua empresa:**
- ❌ NÃO vê outras empresas
- ✅ Vê apenas transportadores da sua empresa
- ✅ Vê apenas corridas da sua empresa

---

## 📞 **PROBLEMAS?**

Se der erro, me envie:
1. O erro completo do navegador
2. Resultado do SQL de verificação
3. Screenshot da tela

---

## 📚 **DOCUMENTOS DE REFERÊNCIA**

- `scripts/criar-usuarios-corretos.md` - Instruções detalhadas
- `PastaPessoal/LOGICA_NEGOCIO.md` - Lógica completa do sistema
- `PastaPessoal/DEPLOY_E_DOMINIOS.md` - Deploy na Vercel
- `PastaPessoal/CONTEXTO_CONVERSA.md` - Contexto completo

