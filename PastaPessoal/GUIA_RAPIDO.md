# 🚀 GUIA RÁPIDO - MovTudo

**Última atualização:** 12 de outubro de 2025

---

## 📂 ESTRUTURA DA PASTA PESSOAL

```
PastaPessoal/
├── DOCUMENTAÇÃO DO PROJETO — MovTudo.md  ← Documentação completa do projeto
├── CONTEXTO_CONVERSA.md                   ← Contexto da conversa atual
├── ESTRUTURA_BANCO_DADOS.md               ← Estrutura detalhada do banco
├── SCRIPTS_SQL_SONDAGEM.md                ← Explicação dos scripts SQL
├── RESULTADO_SONDAGEM.md                  ← Para documentar resultados
└── GUIA_RAPIDO.md                         ← Este arquivo
```

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

### 1. SONDAR O BANCO DE DADOS ATUAL

Execute os scripts SQL no Supabase para entender o estado atual:

```bash
# Acesse: Dashboard Supabase → SQL Editor → New Query

# Execute na ordem:
1. scripts/01-sondar-tabelas.sql
2. scripts/02-sondar-estrutura.sql
3. scripts/03-sondar-rls.sql
4. scripts/04-sondar-dados.sql
5. scripts/05-sondar-indices-funcoes.sql
6. scripts/06-diagnostico-completo.sql
```

**📝 IMPORTANTE:** Documente os resultados em `PastaPessoal/RESULTADO_SONDAGEM.md`

---

### 2. ANALISAR OS RESULTADOS

Após executar os scripts, verifique:

- ✅ Quais tabelas já existem?
- ✅ Quais tabelas faltam criar?
- ✅ A estrutura está correta?
- ✅ RLS está configurado?
- ✅ Há dados de teste?

---

### 3. CRIAR MIGRATIONS

Com base nos resultados, criar migrations para:

1. **Criar tabelas faltantes**
2. **Adicionar colunas ausentes**
3. **Configurar RLS**
4. **Criar índices**
5. **Implementar funções auxiliares**
6. **Configurar triggers**

---

## 🗄️ ESTRUTURA DO BANCO (Resumo)

### Tabelas Principais:
1. **`empresas`** - Empresas de transporte
2. **`usuarios`** - Dados complementares dos usuários
3. **`empresa_associada`** - Relacionamento usuário ↔ empresa
4. **`corridas`** - Pedidos de transporte
5. **`precos`** - Tabela de preços por empresa
6. **`notificacoes`** - Histórico de notificações

### Tabelas Telegram:
7. **`telegram_config`** - Configurações por empresa
8. **`telegram_transportadores`** - Transportadores no Telegram
9. **`telegram_notifications`** - Histórico de mensagens
10. **`telegram_templates`** - Templates de mensagens

---

## 📋 FUNCIONALIDADES POR TIPO DE USUÁRIO

### 👤 Cliente
- Solicitar corridas (passageiro/objeto)
- Acompanhar status em tempo real
- Avaliar transportadores
- Ver histórico

### 🚗 Transportador
- Receber notificações (Telegram)
- Aceitar/rejeitar corridas
- Atualizar status
- Ver histórico e ganhos

### 👔 Gerente
- Cadastrar transportadores e clientes
- Definir preços
- Configurar Telegram
- Ver relatórios da empresa

### 🔧 Admin
- Gerenciar todas as empresas
- Ver estatísticas globais
- Criar/excluir empresas
- Acesso total ao sistema

---

## 🔗 INTEGRAÇÕES

### 1. Google Maps API
- **Geocoding:** Converter endereços em coordenadas
- **Distance Matrix:** Calcular distâncias
- **Places:** Autocomplete de endereços
- **Maps JavaScript:** Mapas interativos

**Arquivo:** `src/lib/googleMaps.ts`

### 2. Telegram Bot
- **Notificações:** Alertas de novas corridas
- **Botões inline:** Aceitar/rejeitar corridas
- **Status:** Atualizações em tempo real
- **Multi-empresa:** Um bot por empresa

**Arquivo:** `src/lib/telegram.ts`

### 3. Supabase
- **Auth:** Autenticação de usuários
- **Database:** PostgreSQL com RLS
- **Storage:** Armazenamento de imagens
- **Realtime:** Atualizações em tempo real

**Arquivo:** `src/lib/supabase.ts`

---

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento:
```bash
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Iniciar servidor de produção
npm run lint         # Verificar erros de código
```

### Scripts do Projeto:
```bash
node scripts/setup.js                    # Configuração inicial
node scripts/create-admin-user.js        # Criar usuário admin
node scripts/configure-supabase-auth.js  # Configurar auth
node scripts/check-auth-settings.js      # Verificar configurações
```

---

## 📚 DOCUMENTOS IMPORTANTES

1. **[DOCUMENTAÇÃO DO PROJETO — MovTudo.md](./DOCUMENTAÇÃO%20DO%20PROJETO%20—%20MovTudo.md)**
   - Visão geral completa
   - Tecnologias usadas
   - Fluxo de funcionalidades

2. **[ESTRUTURA_BANCO_DADOS.md](./ESTRUTURA_BANCO_DADOS.md)**
   - Todas as tabelas detalhadas
   - Relacionamentos
   - Funções e triggers

3. **[CONTEXTO_CONVERSA.md](./CONTEXTO_CONVERSA.md)**
   - Histórico do desenvolvimento
   - Decisões tomadas
   - Próximos passos

4. **[SCRIPTS_SQL_SONDAGEM.md](./SCRIPTS_SQL_SONDAGEM.md)**
   - Explicação de cada script
   - Como usar
   - O que verificar

5. **[RESULTADO_SONDAGEM.md](./RESULTADO_SONDAGEM.md)**
   - Template para documentar resultados
   - Checklist de conformidade
   - Ações necessárias

---

## 🔑 VARIÁVEIS DE AMBIENTE

Crie um arquivo `.env.local` com:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-google-maps
GOOGLE_MAPS_API_KEY=sua-chave-google-maps

# Telegram
TELEGRAM_BOT_TOKEN=token-do-seu-bot
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=nome-do-seu-bot

# Aplicação
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎨 PÁGINAS DA APLICAÇÃO

### Públicas:
- `/` - Home page
- `/login` - Login
- `/cadastro` - Cadastro de novos usuários

### Autenticadas:
- `/admin` - Dashboard do administrador
- `/admin/empresas` - Gerenciar empresas
- `/admin/empresas/nova` - Criar nova empresa
- `/[empresa]` - Página da empresa (dinâmica)

### API Routes:
- `/api/telegram` - Enviar mensagens Telegram
- `/api/calcular-preco` - Calcular preço da corrida
- `/api/corridas` - Gerenciar corridas

---

## 🐛 TROUBLESHOOTING

### Problema: Erro de autenticação
**Solução:** Verificar configurações no Supabase
```bash
node scripts/check-auth-settings.js
```

### Problema: Google Maps não funciona
**Solução:** Verificar se a API Key está configurada e tem as APIs habilitadas:
- Maps JavaScript API
- Geocoding API
- Distance Matrix API
- Places API

### Problema: Telegram não envia mensagens
**Solução:** Verificar:
- Token do bot está correto
- Chat ID está correto
- Bot foi adicionado ao grupo/canal
- Bot tem permissão para enviar mensagens

---

## 📞 SUPORTE E REFERÊNCIAS

### Links Importantes:
- **GitHub:** https://github.com/AbistecServicos/MovTudo
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Google Maps Docs:** https://developers.google.com/maps
- **Telegram Bot Docs:** https://core.telegram.org/bots/api

### Projeto de Referência:
- **EntregasWoo:** C:\dev\EntregasWoo
- Sistema similar já em produção
- Base para arquitetura do MovTudo

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Infraestrutura
- [ ] Banco de dados criado
- [ ] Tabelas criadas
- [ ] RLS configurado
- [ ] Índices criados
- [ ] Funções implementadas

### Fase 2: Autenticação
- [ ] Supabase Auth configurado
- [ ] Contexto de Auth criado
- [ ] Proteção de rotas
- [ ] Middleware configurado

### Fase 3: Funcionalidades Básicas
- [ ] CRUD de empresas
- [ ] CRUD de usuários
- [ ] Sistema de permissões
- [ ] Associação usuário-empresa

### Fase 4: Corridas
- [ ] Criar corrida
- [ ] Aceitar corrida
- [ ] Atualizar status
- [ ] Finalizar corrida
- [ ] Sistema de avaliações

### Fase 5: Integrações
- [ ] Google Maps integrado
- [ ] Cálculo de rotas
- [ ] Telegram Bot configurado
- [ ] Notificações funcionando

### Fase 6: Refinamentos
- [ ] Dashboard com estatísticas
- [ ] Relatórios
- [ ] Sistema de preços dinâmico
- [ ] Filtros e buscas

### Fase 7: Deploy
- [ ] Build de produção
- [ ] Deploy na Vercel
- [ ] Domínio configurado
- [ ] SSL configurado

---

## 📊 MÉTRICAS DE SUCESSO

- ✅ Sistema rodando sem erros
- ✅ Autenticação funcionando
- ✅ Corridas sendo criadas
- ✅ Notificações sendo enviadas
- ✅ Google Maps calculando rotas
- ✅ RLS protegendo dados
- ✅ Performance aceitável (<2s carregamento)

---

**Desenvolvido com ❤️ por Almir da Silva Salles**
**GitHub:** https://github.com/AbistecServicos/MovTudo







