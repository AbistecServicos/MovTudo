# 🗣️ CONTEXTO DA CONVERSA - MovTudo

**Data de criação:** 12 de outubro de 2025
**Projeto:** MovTudo - Sistema de Transporte e Entregas
**GitHub:** https://github.com/AbistecServicos/MovTudo

---

## 📝 SITUAÇÃO ATUAL

### O que aconteceu:
- O chat anterior com a IA foi perdido/reiniciado
- Todo o contexto da conversa anterior foi perdido
- Estávamos trabalhando na estrutura do banco de dados Supabase

### Projeto de Referência:
- **EntregasWoo** - Projeto já pronto localizado em `C:\dev\EntregasWoo`
- Este projeto já possui uma estrutura completa de banco Supabase implementada
- Foi usado como base para entender a arquitetura do MovTudo

---

## 🗄️ ESTRUTURA DO BANCO DE DADOS (EntregasWoo - Referência)

### Tabelas Principais do EntregasWoo:

1. **`pedidos`** - Pedidos/Corridas
2. **`lojas`** - Lojas/Empresas
3. **`loja_associada`** - Relacionamento usuário ↔ loja
4. **`usuarios`** - Usuários do sistema

### Tabelas Telegram (EntregasWoo):

1. **`telegram_config`** - Configurações do bot por loja
2. **`telegram_entregadores`** - Entregadores cadastrados no Telegram
3. **`telegram_notifications`** - Histórico de notificações
4. **`telegram_templates`** - Templates de mensagens

---

## 🎯 ESTRUTURA PLANEJADA PARA MovTudo

### Tabelas Necessárias:

1. **`empresas`** - Empresas de transporte
   - id (uuid)
   - nome (text)
   - slug (text) - para URLs amigáveis
   - logo_url (text)
   - cidade (text)
   - ativo (boolean)
   - data_criacao (timestamp)

2. **`usuarios`** - Usuários do sistema
   - id (uuid)
   - empresa_id (uuid FK)
   - nome (text)
   - telefone (text)
   - email (text)
   - funcao (enum: cliente, transportador, gerente, admin)
   - senha_hash (text)
   - ativo (boolean)
   - telegram_id (text)

3. **`empresa_associada`** - Relacionamento usuário ↔ empresa
   - id (uuid)
   - uid_usuario (uuid)
   - empresa_id (uuid)
   - funcao (text)
   - status_vinculacao (text)
   - data_vinculacao (timestamp)

4. **`corridas`** - Corridas/Pedidos de transporte
   - id (uuid)
   - empresa_id (uuid)
   - cliente_id (uuid)
   - transportador_id (uuid)
   - tipo (enum: passageiro, objeto)
   - origem (json) - {endereço, lat, lng}
   - destino (json) - {endereço, lat, lng}
   - distancia_km (float)
   - preco_estimado (float)
   - status (enum: pendente, aceita, em_transporte, concluida, cancelada)
   - descricao_objeto (text)
   - peso_estimado (float)
   - data_criacao (timestamp)

5. **`precos`** - Tabela de preços por empresa
   - id (uuid)
   - empresa_id (uuid)
   - tipo_transporte (enum: moto, carro, objeto)
   - preco_base (float)
   - preco_por_km (float)

6. **`notificacoes`** - Histórico de notificações
   - id (uuid)
   - usuario_id (uuid)
   - tipo (enum: telegram, email, push)
   - mensagem (text)
   - data_envio (timestamp)

### Tabelas Telegram:

1. **`telegram_config`** - Configurações do Telegram por empresa
2. **`telegram_transportadores`** - Transportadores cadastrados no Telegram
3. **`telegram_notifications`** - Histórico de notificações enviadas
4. **`telegram_templates`** - Templates de mensagens personalizados

---

## 🔑 DIFERENÇAS ENTRE EntregasWoo e MovTudo

| Aspecto | EntregasWoo | MovTudo |
|---------|-------------|---------|
| Foco | Entregas para WooCommerce | Plataforma de transporte geral |
| Entidade Principal | Lojas (L1, L2, L3) | Empresas de Transporte |
| Tipos de Serviço | Apenas entregas de produtos | Passageiros + Objetos |
| Integração | WooCommerce + Telegram | Google Maps + Telegram |
| Usuários | Gerente, Entregador, Admin | Cliente, Transportador, Gerente, Admin |

---

## 📋 PRÓXIMOS PASSOS

1. ✅ Criar arquivos de contexto (este arquivo)
2. ✅ Criar scripts SQL para sondar o banco atual
3. ✅ Verificar estrutura atual do banco Supabase
4. ✅ Documentar estrutura real do banco
5. ✅ **RESOLVER PROBLEMA DE LOGIN DO ADMIN** ← RESOLVIDO!
6. ✅ **RESOLVER PROBLEMA: Admin não via empresas** ← RESOLVIDO!
7. ⏳ Verificar dados existentes
8. ⏳ Testar funcionalidades básicas
9. ⏳ Implementar/Corrigir RLS (Row Level Security)
10. ⏳ Criar funções auxiliares
11. ⏳ Testar integrações

## 🔍 DESCOBERTAS IMPORTANTES

### ✅ Estrutura Real Mapeada:
- **Banco baseado no EntregasWoo** com adaptações
- **Usuário admin existente:** `almirdss@gmail.com` (is_admin = true)
- **Sistema de métricas de performance** implementado
- **11 tabelas** funcionais com dados
- **1 empresa ativa:** "Moto Taxi Express" (E1)
- **3 usuários:** 1 admin + 1 transportador + 1 gerente

### ✅ Problemas Resolvidos:
- **Problema RLS:** Políticas RLS impediam admin de ver empresas
- **Solução Aplicada:** Modificado páginas admin para usar `supabaseAdmin` (service role)
- **Conflito de Rotas Next.js:** Resolvido conflito entre [slug] e [id] - consolidado em [id]
- **Arquivos Modificados:**
  - `src/app/admin/empresas/page.tsx` - Agora usa supabaseAdmin
  - `src/app/admin/page.tsx` - Agora usa supabaseAdmin
  - `src/app/admin/empresas/[id]/page.tsx` - Visualização detalhada criada ✨
  - `src/app/admin/empresas/[id]/editar/page.tsx` - Página de edição criada ✨
- **Script SQL Criado:** `scripts/corrigir-rls-admin.sql` (para corrigir RLS futuramente)
- **Páginas Criadas:**
  - Visualização detalhada da empresa com lógica de associação
  - Página de edição completa

### 🎯 Arquitetura Correta:
- **Admin não deve estar em `empresa_associada`**
- **Flag `is_admin` na tabela `usuarios` determina se é admin**
- **Admin usa service role para ignorar RLS**
- **Outros usuários respeitam RLS baseado em vinculação**

### 👥 Lógica de Associação de Usuários:
- **Gerentes:** Podem ser associados a APENAS 1 empresa
- **Transportadores:** Podem ser associados a MÚLTIPLAS empresas
- **Tabela `empresa_associada`:** Armazena os vínculos
- **Campo `funcao`:** Define o tipo de usuário (gerente, transportador, admin)
- **Campo `status_vinculacao`:** Define se está ativo, inativo ou desligado

---

## 🐛 PROBLEMA ATUAL - RLS Storage foto_perfil

### Status: 🔵 SOLUÇÃO CRIADA - AGUARDANDO EXECUÇÃO

**Data:** 12/10/2025 - 21:00

### Problema:
Upload de foto de perfil falhando com erro: `new row violates row-level security policy`

### Investigação Completa:
1. ✅ **Tabela `usuarios`:** Corrigida - política UPDATE tinha USING mas sem WITH CHECK
2. ✅ **Storage `foto_perfil`:** Análise detalhada realizada
3. 🎯 **CAUSA RAIZ ENCONTRADA:** A expressão `auth.role() = 'authenticated'` **NÃO funciona** no Supabase Storage!

### Explicação Técnica:
```sql
-- ❌ ERRADO (O que estava sendo usado):
auth.role() = 'authenticated'  -- Não funciona no Storage!

-- ✅ CORRETO (O que deve ser usado):
auth.uid() IS NOT NULL  -- Funciona corretamente!
```

### Solução Criada:
📁 **Script:** `scripts/SOLUCAO-DEFINITIVA-storage.sql`

**O que faz:**
1. Remove todas as políticas antigas de `foto_perfil`
2. Cria 4 novas políticas corretas:
   - SELECT: Todos podem ver (bucket público)
   - INSERT: auth.uid() IS NOT NULL (só WITH CHECK)
   - UPDATE: auth.uid() IS NOT NULL (USING e WITH CHECK)
   - DELETE: auth.uid() IS NOT NULL (só USING)
3. Verifica se foi aplicado corretamente

### Próximos Passos:
1. ⏳ Executar script no Supabase SQL Editor
2. ⏳ Verificar resultado
3. ⏳ Testar upload de foto
4. ⏳ Confirmar correção

### Arquivos Envolvidos:
- `PastaPessoal/AnotaçõesDeFalhasAtuais.md` - Checklist detalhado do erro
- `scripts/SOLUCAO-DEFINITIVA-storage.sql` - Script de correção
- `src/components/PhotoUpload.tsx` - Componente de upload
- `src/lib/storage.ts` - Biblioteca de Storage

---

## 🔗 LINKS IMPORTANTES

- **GitHub:** https://github.com/AbistecServicos/MovTudo
- **Projeto Referência:** C:\dev\EntregasWoo
- **Documentação:** C:\dev\MovTudo\PastaPessoal\DOCUMENTAÇÃO DO PROJETO — MovTudo.md

---

## 📝 NOTAS ADICIONAIS

- Sempre manter este arquivo atualizado com o progresso
- Documentar todas as decisões importantes
- Registrar problemas encontrados e soluções aplicadas
- Manter histórico de mudanças no banco de dados
- **Aprendizado importante:** No Supabase Storage INSERT, NÃO usar verificação de auth no WITH CHECK
- **Lógica de URLs:** Ver `LOGICA_URLS_USUARIOS.md` para detalhes sobre redirecionamento por tipo de usuário
- **Cliente Visitante:** Ver `GUIA_CLIENTE_VISITANTE.md` para entender como cliente sem login faz pedido
- **Modelos de Negócio:** Ver `ANALISE_MODELOS_NEGOCIO.md` para casos de uso (Carga, Loja, Taxi)

