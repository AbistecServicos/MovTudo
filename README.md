# 🚗 MovTudo - Sistema de Transporte Multiempresa

Plataforma completa para gerenciar empresas de transporte, conectando clientes e transportadores de forma eficiente.

## 📋 Visão Geral

O **MovTudo** é um sistema web desenvolvido com **Next.js 14** e **Supabase** que permite:

- ✅ **Multiempresa**: Cada empresa tem sua própria área e usuários
- ✅ **Transporte Completo**: Passageiros e objetos com cálculo automático de preços
- ✅ **Google Maps**: Integração completa para rotas e distâncias
- ✅ **Telegram**: Notificações em tempo real para transportadores
- ✅ **Tempo Real**: Acompanhamento ao vivo das corridas
- ✅ **Segurança**: Row Level Security (RLS) e autenticação robusta

## 🏗️ Arquitetura

### Frontend
- **Next.js 14** com App Router
- **TypeScript** para type safety
- **TailwindCSS** para estilização
- **React Hook Form** para formulários
- **Lucide React** para ícones

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **Row Level Security** para permissões
- **Triggers** automáticos para estatísticas
- **Edge Functions** para integrações

### Integrações
- **Google Maps API** para geolocalização
- **Telegram Bot API** para notificações
- **Supabase Storage** para fotos temporárias

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Conta no Google Cloud Platform
- Bot do Telegram

### 2. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/movtudo.git
cd movtudo
```

### 3. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 4. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp env.example .env.local
```

Configure as variáveis no `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua-chave-google-maps

# Telegram
TELEGRAM_BOT_TOKEN=seu-token-bot

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MovTudo
```

### 5. Configure o Banco de Dados

1. **Acesse o Supabase Dashboard**
2. **Vá em SQL Editor**
3. **Execute o SQL de criação das tabelas** (fornecido anteriormente)
4. **Execute o SQL de RLS Policies** (fornecido anteriormente)
5. **Execute o SQL de Triggers** (fornecido anteriormente)

### 6. Configure o Google Maps

1. **Acesse o Google Cloud Console**
2. **Ative as APIs**:
   - Maps JavaScript API
   - Geocoding API
   - Distance Matrix API
   - Places API
3. **Crie uma chave de API**
4. **Configure as restrições** (recomendado)

### 7. Configure o Telegram Bot

1. **Converse com @BotFather no Telegram**
2. **Crie um novo bot**: `/newbot`
3. **Configure o nome e username**
4. **Copie o token** fornecido
5. **Configure o webhook** (opcional)

### 8. Execute o Projeto

```bash
npm run dev
# ou
yarn dev
```

Acesse: http://localhost:3000

## 📱 Estrutura do Projeto

```
movtudo/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── admin/             # Páginas administrativas
│   │   ├── login/             # Autenticação
│   │   ├── [empresa]/         # Páginas dinâmicas por empresa
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes reutilizáveis
│   ├── context/               # Context API (Auth)
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Bibliotecas e configurações
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── googleMaps.ts      # Serviços Google Maps
│   │   └── telegram.ts        # Serviços Telegram
│   ├── types/                 # Definições TypeScript
│   └── utils/                 # Funções utilitárias
├── public/                    # Arquivos estáticos
├── supabase/                  # Configurações Supabase
└── docs/                      # Documentação
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **`usuarios`**: Cadastro de usuários
- **`empresas`**: Empresas de transporte
- **`empresa_associada`**: Relacionamento usuário ↔ empresa
- **`corridas`**: Pedidos de transporte
- **`precos`**: Tabela de preços por empresa
- **`telegram_*`**: Configurações e notificações Telegram

### Relacionamentos

```
usuarios (1) ←→ (N) empresa_associada (N) ←→ (1) empresas
empresas (1) ←→ (N) corridas (N) ←→ (1) usuarios (transportador)
```

## 👥 Tipos de Usuário

### 1. **Administrador Global**
- Gerencia todas as empresas
- Cria e exclui empresas
- Visualiza relatórios globais
- Acesso completo ao sistema

### 2. **Gerente de Empresa**
- Gerencia usuários da própria empresa
- Visualiza corridas da empresa
- Configura preços e veículos
- Acesso ao painel da empresa

### 3. **Transportador**
- Recebe notificações de corridas
- Aceita/rejeita corridas
- Atualiza status das corridas
- Visualiza histórico pessoal

### 4. **Cliente**
- Solicita corridas
- Acompanha status em tempo real
- Avalia transportadores
- Visualiza histórico de corridas

## 🔐 Sistema de Permissões (RLS)

O sistema usa **Row Level Security** do Supabase:

- **Usuários** só veem dados da própria empresa
- **Admins** têm acesso global
- **Transportadores** só veem próprias corridas
- **Clientes** só veem próprias solicitações

## 📊 Funcionalidades Principais

### Para Administradores
- ✅ Dashboard com estatísticas globais
- ✅ Gerenciamento de empresas
- ✅ Visualização de usuários
- ✅ Relatórios e métricas
- ✅ Configurações do sistema

### Para Gerentes
- ✅ Dashboard da empresa
- ✅ Cadastro de transportadores
- ✅ Gestão de preços
- ✅ Relatórios da empresa
- ✅ Configurações do Telegram

### Para Transportadores
- ✅ Recebimento de notificações
- ✅ Aceitar/rejeitar corridas
- ✅ Atualizar status
- ✅ Visualizar histórico
- ✅ Configurar localização

### Para Clientes
- ✅ Solicitar corridas
- ✅ Escolher tipo de transporte
- ✅ Acompanhar em tempo real
- ✅ Avaliar transportadores
- ✅ Histórico de corridas

## 🗺️ Integração Google Maps

### APIs Utilizadas
- **Maps JavaScript API**: Mapas interativos
- **Geocoding API**: Converter endereços em coordenadas
- **Distance Matrix API**: Calcular distâncias
- **Places API**: Autocomplete de endereços

### Funcionalidades
- ✅ Cálculo automático de distância
- ✅ Estimativa de tempo de viagem
- ✅ Autocomplete de endereços
- ✅ Validação de localizações
- ✅ Otimização de rotas

## 📱 Sistema de Notificações

### Telegram Bot
- ✅ Notificações de novas corridas
- ✅ Atualizações de status
- ✅ Botões inline para ações
- ✅ Configuração por empresa
- ✅ Templates personalizáveis

### Tipos de Notificação
- **Nova Corrida**: Transportadores são notificados
- **Corrida Aceita**: Cliente é notificado
- **Status Atualizado**: Todas as partes são notificadas
- **Corrida Concluída**: Confirmação final

## 💰 Sistema de Preços

### Cálculo Dinâmico
- ✅ Taxa base configurável
- ✅ Preço por quilômetro
- ✅ Taxa noturna (22h-6h)
- ✅ Taxa de feriado
- ✅ Diferenciação por tipo de veículo
- ✅ Diferenciação por tipo de serviço

### Fórmula Base
```
Preço = Taxa Base + (Distância × Preço/km)
+ Taxa Noturna (se aplicável)
+ Taxa Feriado (se aplicável)
```

## 📈 Relatórios e Estatísticas

### Para Administradores
- ✅ Total de empresas e usuários
- ✅ Corridas por período
- ✅ Faturamento global
- ✅ Performance por empresa

### Para Gerentes
- ✅ Corridas da empresa
- ✅ Performance dos transportadores
- ✅ Faturamento da empresa
- ✅ Tempo médio de entrega

### Para Transportadores
- ✅ Corridas realizadas
- ✅ Faturamento pessoal
- ✅ Avaliações recebidas
- ✅ Estatísticas diárias/semanais/mensais

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção

# Qualidade
npm run lint         # Executa ESLint
npm run type-check   # Verifica tipos TypeScript
```

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte o repositório ao Vercel**
2. **Configure as variáveis de ambiente**
3. **Deploy automático** a cada push

### Outras Plataformas

- **Netlify**: Suporte completo ao Next.js
- **Railway**: Deploy simples e rápido
- **DigitalOcean App Platform**: Opção robusta

## 🔒 Segurança

### Implementadas
- ✅ **Row Level Security** (RLS)
- ✅ **Autenticação Supabase**
- ✅ **Validação de dados**
- ✅ **Sanitização de inputs**
- ✅ **Rate limiting** (via Vercel)
- ✅ **HTTPS obrigatório**

### Recomendações
- 🔐 Configure **CORS** adequadamente
- 🔐 Use **domínios específicos** nas APIs
- 🔐 Implemente **backup automático**
- 🔐 Monitore **logs de acesso**
- 🔐 Configure **alertas de segurança**

## 📚 Documentação Adicional

- [Guia de Configuração do Supabase](./docs/supabase-setup.md)
- [Configuração do Google Maps](./docs/google-maps-setup.md)
- [Setup do Telegram Bot](./docs/telegram-setup.md)
- [Guia de Deploy](./docs/deploy-guide.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Email**: suporte@movtudo.com
- **Telegram**: @movtudo_suporte
- **Documentação**: [docs.movtudo.com](https://docs.movtudo.com)

## 🎯 Roadmap

### Versão 1.1
- [ ] App mobile (React Native)
- [ ] Integração com pagamentos
- [ ] Sistema de avaliações
- [ ] Relatórios avançados

### Versão 1.2
- [ ] Rastreamento GPS em tempo real
- [ ] Integração com WhatsApp
- [ ] Sistema de cupons
- [ ] API pública

### Versão 2.0
- [ ] IA para otimização de rotas
- [ ] Marketplace de transportadores
- [ ] Sistema de fidelidade
- [ ] Integração com ERPs

---

**Desenvolvido com ❤️ por [Almir da Silva Salles](https://github.com/almirdss)**
