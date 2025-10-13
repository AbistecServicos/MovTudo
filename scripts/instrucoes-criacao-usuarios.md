# 📋 INSTRUÇÕES PARA CRIAR USUÁRIOS NO SUPABASE AUTH

## 🎯 OBJETIVO
Criar um gerente e um transportador para a empresa "Moto Taxi Express" (E1).

---

## 👥 USUÁRIOS A CRIAR

### 1️⃣ **GERENTE**
- **Email:** `gerente@mototaxiexpress.com`
- **Senha:** `Gerente123!`
- **Nome:** Maria Silva Santos
- **Função:** Gerente da empresa E1

### 2️⃣ **TRANSPORTADOR**
- **Email:** `transportador@mototaxiexpress.com`
- **Senha:** `Transportador123!`
- **Nome:** João Oliveira Costa
- **Função:** Transportador da empresa E1
- **Veículo:** Moto Honda CG 160

---

## 🚀 PASSOS PARA EXECUTAR

### **PASSO 1: Criar a Empresa**
```sql
-- Execute o script: scripts/criar-primeira-empresa.sql
-- BLOCO 1: Criar empresa Moto Taxi Express (E1)
```

### **PASSO 2: Criar Usuários no Supabase Auth**

#### **2.1 Acesse o Supabase Dashboard:**
- Vá em **Authentication** → **Users**
- Clique em **"Add user"**

#### **2.2 Criar o Gerente:**
- **Email:** `gerente@mototaxiexpress.com`
- **Password:** `Gerente123!`
- **Email Confirm:** ✅ (marque como confirmado)
- Clique em **"Create user"**
- **COPIE O UUID** do usuário criado

#### **2.3 Criar o Transportador:**
- **Email:** `transportador@mototaxiexpress.com`
- **Password:** `Transportador123!`
- **Email Confirm:** ✅ (marque como confirmado)
- Clique em **"Create user"**
- **COPIE O UUID** do usuário criado

### **PASSO 3: Atualizar Scripts SQL**

#### **3.1 Edite o arquivo:** `scripts/criar-gerente-transportador.sql`

#### **3.2 Substitua os UUIDs:**
```sql
-- Na linha do gerente, substitua:
'SUBSTITUA_PELO_UUID_DO_GERENTE'
-- Pelo UUID real do gerente

-- Na linha do transportador, substitua:
'SUBSTITUA_PELO_UUID_DO_TRANSPORTADOR'
-- Pelo UUID real do transportador
```

### **PASSO 4: Executar Scripts SQL**

#### **4.1 Execute os blocos do script:**
```sql
-- BLOCO 3: Adicionar gerente à tabela usuarios
-- BLOCO 4: Adicionar transportador à tabela usuarios
-- BLOCO 5: Associar gerente à empresa
-- BLOCO 6: Associar transportador à empresa
-- BLOCO 7: Verificar se foram criados
```

---

## ✅ VERIFICAÇÃO FINAL

Após executar todos os passos, você deve ter:

1. ✅ **1 empresa:** Moto Taxi Express (E1)
2. ✅ **1 admin:** almirdss@gmail.com
3. ✅ **1 gerente:** gerente@mototaxiexpress.com
4. ✅ **1 transportador:** transportador@mototaxiexpress.com

---

## 🔍 COMANDOS DE VERIFICAÇÃO

```sql
-- Verificar empresa criada
SELECT * FROM empresas WHERE id_empresa = 'E1';

-- Verificar usuários criados
SELECT * FROM usuarios WHERE email IN (
    'gerente@mototaxiexpress.com', 
    'transportador@mototaxiexpress.com'
);

-- Verificar associações
SELECT * FROM empresa_associada WHERE id_empresa = 'E1';

-- Verificar tudo junto
SELECT 
    u.email,
    u.nome_completo,
    u.is_admin,
    ea.funcao,
    ea.empresa_nome
FROM usuarios u
LEFT JOIN empresa_associada ea ON ea.uid_usuario = u.uid
ORDER BY u.is_admin DESC, ea.funcao;
```

---

## 🚨 IMPORTANTE

- **SEMPRE** copie os UUIDs reais dos usuários criados no Supabase Auth
- **NÃO** execute os scripts sem substituir os UUIDs
- **TESTE** o login de cada usuário após criar
- **VERIFIQUE** se as associações foram criadas corretamente

---

## 📞 SE TIVER PROBLEMAS

1. **Verifique** se os UUIDs estão corretos
2. **Execute** os blocos um por vez
3. **Verifique** se a empresa E1 foi criada primeiro
4. **Teste** o login de cada usuário






