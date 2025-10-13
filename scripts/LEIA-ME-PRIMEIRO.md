# 🎯 SOLUÇÃO DEFINITIVA - Erro RLS Upload de Foto

## ❌ O PROBLEMA

Erro ao fazer upload de foto de perfil:
```
new row violates row-level security policy
```

---

## 🔍 CAUSA RAIZ IDENTIFICADA

A expressão `auth.role() = 'authenticated'` **NÃO funciona** no Supabase Storage!

### Explicação:

```sql
-- ❌ ERRADO (O que estava sendo usado):
WHERE auth.role() = 'authenticated'
-- Isso falha silenciosamente no Supabase Storage!

-- ✅ CORRETO (O que deve ser usado):
WHERE auth.uid() IS NOT NULL
-- Isso funciona perfeitamente!
```

### Por quê?

O Supabase Storage tem um comportamento diferente da API REST normal. A função `auth.role()` não retorna valores consistentes no contexto do Storage. O método confiável é verificar se o usuário tem um UID válido.

---

## ✅ SOLUÇÃO

Execute o script: **`scripts/SOLUCAO-DEFINITIVA-storage.sql`**

### O que o script faz:

1. **Remove** todas as políticas antigas de `foto_perfil` (com auth.role())
2. **Cria** 4 novas políticas corretas (com auth.uid() IS NOT NULL):
   - 👁️ **SELECT:** Todos podem ver fotos (bucket público)
   - ⬆️ **INSERT:** Usuários autenticados podem fazer upload
   - ✏️ **UPDATE:** Usuários autenticados podem atualizar
   - 🗑️ **DELETE:** Usuários autenticados podem deletar
3. **Verifica** se tudo foi aplicado corretamente

---

## 📋 COMO EXECUTAR

### Passo 1: Abrir Supabase Dashboard
```
https://supabase.com/dashboard/project/buxpuusxglavepfrivwg
```

### Passo 2: Ir para SQL Editor
- Sidebar > SQL Editor
- Botão "New query"

### Passo 3: Copiar e Colar
Abra o arquivo: `scripts/SOLUCAO-DEFINITIVA-storage.sql`
Copie TODO o conteúdo e cole no SQL Editor

### Passo 4: Executar
- Clique no botão "Run" (ou Ctrl+Enter)
- Aguarde a execução

### Passo 5: Verificar Resultado
Você deve ver uma tabela com 4 políticas:
- ✅ Todos devem ter "USA auth.uid()"
- ❌ Nenhuma deve ter "USA auth.role()"

---

## 🧪 TESTAR

1. Acesse: `http://localhost:3000/perfil`
2. Clique em "Alterar foto"
3. Selecione uma imagem
4. Upload deve funcionar! ✨

---

## 📂 ARQUIVOS RELACIONADOS

- ✅ **Solução:** `scripts/SOLUCAO-DEFINITIVA-storage.sql`
- 📝 **Checklist:** `PastaPessoal/AnotaçõesDeFalhasAtuais.md`
- 📚 **Contexto:** `PastaPessoal/CONTEXTO_CONVERSA.md`

---

## 💡 LIÇÕES APRENDIDAS

1. **No Supabase Storage, SEMPRE use:**
   ```sql
   auth.uid() IS NOT NULL
   ```
   
2. **NUNCA use no Storage:**
   ```sql
   auth.role() = 'authenticated'
   ```

3. **Lembre-se das regras:**
   - INSERT: Só WITH CHECK (sem USING)
   - UPDATE: USING + WITH CHECK (ambos)
   - DELETE: Só USING (sem WITH CHECK)
   - SELECT: Só USING (sem WITH CHECK)

---

## 🆘 SE AINDA DER ERRO

1. Limpe o cache do navegador (Ctrl+Shift+R)
2. Verifique se está usando o usuário correto (não admin)
3. Confirme que as políticas foram criadas corretamente
4. Me avise e vamos investigar juntos!

---

**Criado em:** 12/10/2025 - 21:00  
**Status:** ✅ Solução criada - Aguardando execução



