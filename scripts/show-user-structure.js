#!/usr/bin/env node

console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    ESTRUTURA DE USUÁRIOS - MovTudo                           ║
╚══════════════════════════════════════════════════════════════════════════════╝

📋 TIPOS DE USUÁRIOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 👑 ADMINISTRADOR (is_admin = true)
   ├─ Acesso TOTAL ao sistema
   ├─ Gerencia TODAS as empresas
   ├─ Cria/edita empresas
   ├─ Define preços globais
   ├─ Visualiza relatórios gerais
   └─ Não está vinculado a nenhuma empresa específica

2. 👔 GERENTE DE EMPRESA (funcao = 'gerente')
   ├─ Gerencia UMA empresa específica
   ├─ Cadastra transportadores da sua empresa
   ├─ Visualiza corridas da sua empresa
   ├─ Define preços da sua empresa
   ├─ Configura notificações Telegram
   └─ Campo: empresa_id (ex: E1, E2, E3)

3. 🚗 TRANSPORTADOR (funcao = 'transportador')
   ├─ Vinculado a UMA empresa
   ├─ Recebe notificações de corridas
   ├─ Aceita/rejeita corridas
   ├─ Atualiza status de entrega
   ├─ Visualiza suas estatísticas
   └─ Registro na tabela: empresa_associada

4. 👤 CLIENTE (funcao = 'cliente')
   ├─ Solicita corridas
   ├─ Acompanha status da entrega
   ├─ Visualiza histórico
   └─ Não vinculado a empresa


📊 TABELAS ENVOLVIDAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────────────┐
│ usuarios                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ - uid (PK)                                                                   │
│ - email                                                                      │
│ - nome_completo                                                              │
│ - telefone                                                                   │
│ - is_admin (boolean)                                                         │
│ - funcao (admin/gerente/transportador/cliente)                               │
│ - empresa_id (apenas para gerentes)                                          │
│ - status (ativo/inativo)                                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ empresa_associada (apenas para transportadores)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│ - id (PK)                                                                    │
│ - id_empresa (FK → empresas)                                                 │
│ - uid_usuario (FK → usuarios)                                                │
│ - status_vinculacao (ativo/inativo/bloqueado)                                │
│ - data_vinculacao                                                            │
│ - total_corridas_aceitas                                                     │
│ - total_corridas_entregues                                                   │
│ - avaliacao_media                                                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ empresas                                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ - id_empresa (PK) (E1, E2, E3...)                                            │
│ - empresa_nome                                                               │
│ - cnpj                                                                       │
│ - slug (para URL personalizada)                                              │
│ - ativa (boolean)                                                            │
└─────────────────────────────────────────────────────────────────────────────┘


🔐 FLUXO DE AUTENTICAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Usuário faz login (Supabase Auth)
   ↓
2. Sistema busca dados na tabela 'usuarios'
   ↓
3. Verifica: is_admin?
   ├─ SIM → Acesso total, não busca empresa
   └─ NÃO → Verifica funcao
       ├─ gerente → Busca empresa pelo empresa_id
       ├─ transportador → Busca empresa_associada
       └─ cliente → Não busca empresa


🎯 SUGESTÃO DE TESTES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. ✅ Admin já criado: almirdss@gmail.com
2. ⏳ Criar primeira empresa (ex: "Mototáxi Express")
3. ⏳ Criar gerente para essa empresa
4. ⏳ Criar transportadores vinculados
5. ⏳ Criar cliente para testar corridas


📝 PRÓXIMOS PASSOS RECOMENDADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Fazer login como admin
2. Criar primeira empresa
3. Implementar cadastro de gerentes
4. Implementar cadastro de transportadores
5. Implementar cadastro de clientes
6. Testar fluxo completo de corrida

═══════════════════════════════════════════════════════════════════════════════
`)

