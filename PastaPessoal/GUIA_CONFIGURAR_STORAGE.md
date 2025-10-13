# 📦 GUIA: Configurar Storage RLS no Supabase

**Projeto:** MovTudo  
**Data:** 12 de outubro de 2025  
**Objetivo:** Corrigir erro de upload de foto de perfil

---

## 🎯 O QUE VAMOS FAZER

Configurar políticas RLS (Row Level Security) no bucket Storage do Supabase para permitir que usuários façam upload de suas fotos de perfil.

**Tempo estimado:** 10-15 minutos  
**Dificuldade:** Fácil

---

## 📋 PRÉ-REQUISITOS

- ✅ Acesso ao Supabase Dashboard
- ✅ Projeto MovTudo criado
- ✅ Bucket 'box' existente com as pastas: pdf, logo, foto_perfil, imagens

---

## 🚀 PASSO A PASSO

### **PASSO 1: Acessar o Supabase Dashboard**

1. Abra seu navegador
2. Acesse: https://supabase.com/dashboard
3. Faça login
4. Selecione o projeto **MovTudo**
5. URL direta: https://supabase.com/dashboard/project/buxpuusxglavepfrivwg

---

### **PASSO 2: Ir para Storage Policies**

1. No menu lateral esquerdo, clique em **Storage**
2. Você verá a lista de buckets
3. Clique no bucket **box**
4. No topo da tela, clique na aba **Policies**

---

### **PASSO 3: Criar Política de Upload (INSERT)**

1. Clique no botão **"New Policy"** (canto superior direito)
2. Clique em **"Create a policy from scratch"**
3. Preencha os campos:

```
Policy name: Usuários podem fazer upload de suas fotos de perfil

Allowed operation: 
  ☑️ INSERT

Target roles:
  ☑️ authenticated

Policy definition - USING expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'

Policy definition - WITH CHECK expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'
```

4. Clique em **"Save"**

---

### **PASSO 4: Criar Política de Visualização (SELECT)**

1. Clique em **"New Policy"** novamente
2. Clique em **"Create a policy from scratch"**
3. Preencha os campos:

```
Policy name: Todos podem ver fotos de perfil

Allowed operation: 
  ☑️ SELECT

Target roles:
  ☑️ public

Policy definition - USING expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil'
```

4. Clique em **"Save"**

---

### **PASSO 5: Criar Política de Atualização (UPDATE)**

1. Clique em **"New Policy"** novamente
2. Clique em **"Create a policy from scratch"**
3. Preencha os campos:

```
Policy name: Usuários podem atualizar suas fotos de perfil

Allowed operation: 
  ☑️ UPDATE

Target roles:
  ☑️ authenticated

Policy definition - USING expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'

Policy definition - WITH CHECK expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'
```

4. Clique em **"Save"**

---

### **PASSO 6: Criar Política de Exclusão (DELETE)**

1. Clique em **"New Policy"** novamente
2. Clique em **"Create a policy from scratch"**
3. Preencha os campos:

```
Policy name: Usuários podem deletar suas fotos de perfil

Allowed operation: 
  ☑️ DELETE

Target roles:
  ☑️ authenticated

Policy definition - USING expression:
bucket_id = 'box' AND (storage.foldername(name))[1] = 'foto_perfil' AND auth.role() = 'authenticated'
```

4. Clique em **"Save"**

---

## ✅ VERIFICAÇÃO

Após criar as 4 políticas, você deve ver na lista:

```
✅ Usuários podem fazer upload de suas fotos de perfil (INSERT)
✅ Todos podem ver fotos de perfil (SELECT)
✅ Usuários podem atualizar suas fotos de perfil (UPDATE)
✅ Usuários podem deletar suas fotos de perfil (DELETE)
```

Todas devem estar com status **"Enabled"** (ativadas).

---

## 🧪 TESTAR

1. Acesse: http://localhost:3000/login
2. Faça login com um usuário qualquer
3. Vá para: http://localhost:3000/perfil
4. Clique no botão de upload de foto
5. Selecione uma imagem
6. **Deve funcionar sem erro!** ✅

---

## 🐛 TROUBLESHOOTING

### Erro persiste após criar políticas?

**1. Verificar se o bucket está público:**
   - Storage > Buckets > box
   - Certifique-se que "Public" está marcado

**2. Verificar expressões:**
   - Copie e cole exatamente como está no guia
   - Não deixe espaços extras no início ou fim
   - Verifique se não tem aspas diferentes (' vs ")

**3. Verificar logs:**
   - Storage > Logs
   - Veja se há erros específicos

**4. Recriar política:**
   - Delete a política com erro
   - Crie novamente

**5. Testar com política mais simples:**
   - Delete todas as políticas de foto_perfil
   - Crie apenas uma política com:
     ```
     Policy name: Acesso total foto_perfil
     Operation: ALL
     Target: authenticated
     USING: bucket_id = 'box'
     ```
   - Teste
   - Se funcionar, o problema é na expressão específica

---

## 📝 NOTAS IMPORTANTES

- ⚠️ **NÃO delete o bucket 'box'** - ele contém todos os arquivos
- ⚠️ **NÃO desabilite RLS** - é importante para segurança
- ✅ Você pode criar/deletar políticas quantas vezes quiser
- ✅ As políticas não afetam arquivos já existentes
- ✅ Mudanças nas políticas são instantâneas

---

## 🎓 ENTENDENDO AS EXPRESSÕES

### `bucket_id = 'box'`
Garante que a política só se aplica ao bucket 'box'

### `(storage.foldername(name))[1] = 'foto_perfil'`
Verifica se o arquivo está na pasta foto_perfil

### `auth.role() = 'authenticated'`
Verifica se o usuário está logado

### Target roles:
- **public** = Qualquer um (mesmo sem login)
- **authenticated** = Apenas usuários logados

---

## 📚 PRÓXIMOS PASSOS

Depois de resolver foto_perfil, você pode criar políticas para:

1. **logo** - Logos das empresas
2. **imagens** - Fotos de objetos para transporte
3. **pdf** - Documentos (implementar futuramente)

Use o arquivo `scripts/configurar-storage-rls.sql` como referência!

---

## 🆘 AJUDA

Se tiver dúvidas:
1. Releia este guia calmamente
2. Confira se seguiu todos os passos
3. Verifique os logs no Supabase
4. Teste com um usuário diferente
5. Reporte o erro específico no checklist

---

**Boa sorte!** 🚀



