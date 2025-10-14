# 🔧 Como Confirmar Usuários Manualmente

## 📋 **MÉTODO 1: Pelo Painel do Supabase (RECOMENDADO)**

### **Passo 1: Desabilitar Confirmação de Email**
1. Acesse: https://buxpuusxglavepfrivwg.supabase.co
2. Vá em **Authentication → Settings**
3. **DESABILITE**: "Enable email confirmations"
4. Clique em **Save**

### **Passo 2: Confirmar Usuários Existentes**
1. Vá em **Authentication → Users**
2. Para cada usuário não confirmado:
   - Clique no usuário
   - Clique em **"Confirm User"**

---

## 📋 **MÉTODO 2: Criar Novos Usuários Confirmados**

### **No Painel do Supabase:**
1. **Authentication → Users → Add User**
2. Preencha:
   - **Email**: `gerente1_movtudo_e1@abistec.com.br`
   - **Password**: `Gerente1_movtudo_e1*`
   - **☑️ Auto Confirm User** ← MARCAR!
3. Clique em **Create User**

### **Repetir para outros usuários:**
- `transportador1_movtudo@abistec.com.br`
- `cliente1_movtudo@abistec.com.br`
- `almirdss@gmail.com.br`

---

## 📋 **MÉTODO 3: Configurar URLs para Desenvolvimento**

### **No Supabase Dashboard:**
1. **Authentication → Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/auth/callback`
3. **Save**

---

## ✅ **RESULTADO ESPERADO:**

Após seguir qualquer método:
- ✅ Usuários confirmados automaticamente
- ✅ Login funciona sem confirmação de email
- ✅ Redirecionamento funciona corretamente

---

## 🚀 **TESTE:**

1. Desabilite confirmação de email
2. Tente fazer login com qualquer usuário
3. Deve funcionar imediatamente
