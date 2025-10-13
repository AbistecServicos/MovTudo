import Link from 'next/link'
import { ArrowLeft, Book, Users, Building2, Car, Shield, Code, FileText } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Link>
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Car className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-bold text-gray-900">MovTudo</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentação MovTudo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guia completo para usar e gerenciar sua plataforma de transporte
          </p>
        </div>

        {/* Sumário */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sumário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="#visao-geral" className="flex items-center text-primary-600 hover:underline">
              <Book className="h-5 w-5 mr-2" />
              1. Visão Geral do Sistema
            </Link>
            <Link href="#arquitetura" className="flex items-center text-primary-600 hover:underline">
              <Code className="h-5 w-5 mr-2" />
              2. Arquitetura da Plataforma
            </Link>
            <Link href="#usuarios" className="flex items-center text-primary-600 hover:underline">
              <Users className="h-5 w-5 mr-2" />
              3. Tipos de Usuários
            </Link>
            <Link href="#funcionalidades" className="flex items-center text-primary-600 hover:underline">
              <Car className="h-5 w-5 mr-2" />
              4. Funcionalidades Principais
            </Link>
            <Link href="#seguranca" className="flex items-center text-primary-600 hover:underline">
              <Shield className="h-5 w-5 mr-2" />
              5. Segurança e Privacidade
            </Link>
            <Link href="#integracao" className="flex items-center text-primary-600 hover:underline">
              <Building2 className="h-5 w-5 mr-2" />
              6. Integração de Empresas
            </Link>
          </div>
        </div>

        {/* 1. Visão Geral */}
        <div id="visao-geral" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Book className="h-8 w-8 text-primary-600 mr-3" />
            1. Visão Geral do Sistema
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-4">
              O <strong>MovTudo</strong> é uma plataforma SaaS (Software as a Service) completa para gestão de empresas de transporte. 
              O sistema permite que múltiplas empresas operem de forma independente, cada uma com seu próprio conjunto de transportadores, clientes e corridas.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Principais Características:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-4">
              <li><strong>Multiempresa:</strong> Cada empresa tem seu próprio espaço (slug) e pode ter domínio próprio</li>
              <li><strong>Gestão Completa:</strong> Gerenciamento de transportadores, clientes e corridas em tempo real</li>
              <li><strong>Cálculo Automático:</strong> Integração com Google Maps para cálculo de rotas e preços</li>
              <li><strong>Notificações:</strong> Sistema de alertas via Telegram para transportadores e clientes</li>
              <li><strong>Tipos de Transporte:</strong> Suporte para passageiros, objetos e cargas</li>
              <li><strong>Segurança:</strong> Autenticação robusta com Supabase e Row Level Security (RLS)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Tecnologias Utilizadas:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Frontend:</strong> Next.js 14 + React + TypeScript</li>
              <li><strong>Backend:</strong> Supabase (PostgreSQL + Auth + Storage)</li>
              <li><strong>Hospedagem:</strong> Netlify (deploy automático)</li>
              <li><strong>Mapas:</strong> Google Maps API</li>
              <li><strong>Notificações:</strong> Telegram Bot API</li>
            </ul>
          </div>
        </div>

        {/* 2. Arquitetura */}
        <div id="arquitetura" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Code className="h-8 w-8 text-primary-600 mr-3" />
            2. Arquitetura da Plataforma
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Estrutura de URLs:</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 font-mono text-sm">
              <p className="mb-2"><strong>/</strong> → Página inicial institucional</p>
              <p className="mb-2"><strong>/admin</strong> → Painel do administrador (Abistec)</p>
              <p className="mb-2"><strong>/[slug]</strong> → Página pública da empresa</p>
              <p className="mb-2"><strong>/[slug]/login</strong> → Login da empresa</p>
              <p className="mb-2"><strong>/[slug]/dashboard</strong> → Painel do gerente</p>
              <p><strong>/[slug]/corridas</strong> → Painel do transportador</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Banco de Dados:</h3>
            <p className="text-gray-600 mb-4">
              O sistema utiliza PostgreSQL via Supabase com as seguintes tabelas principais:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>usuarios:</strong> Dados de todos os usuários do sistema</li>
              <li><strong>empresas:</strong> Informações das empresas cadastradas</li>
              <li><strong>empresa_associada:</strong> Vinculação entre usuários e empresas</li>
              <li><strong>corridas:</strong> Registro de todas as corridas/pedidos</li>
            </ul>
          </div>
        </div>

        {/* 3. Tipos de Usuários */}
        <div id="usuarios" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="h-8 w-8 text-primary-600 mr-3" />
            3. Tipos de Usuários
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-primary-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">👑 Administrador (Abistec)</h3>
              <p className="text-gray-600 mb-2"><strong>Escopo:</strong> Global (todas as empresas)</p>
              <p className="text-gray-600 mb-2"><strong>Acesso:</strong> /admin</p>
              <p className="text-gray-600"><strong>Permissões:</strong></p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Criar, editar e excluir empresas</li>
                <li>Visualizar dashboard de todas as empresas</li>
                <li>Gerenciar usuários de qualquer empresa</li>
                <li>Configurar sistema global</li>
              </ul>
            </div>

            <div className="border-l-4 border-secondary-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🧑‍💼 Gerente</h3>
              <p className="text-gray-600 mb-2"><strong>Escopo:</strong> Empresa específica</p>
              <p className="text-gray-600 mb-2"><strong>Acesso:</strong> /[slug]/dashboard</p>
              <p className="text-gray-600"><strong>Permissões:</strong></p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Cadastrar transportadores da empresa</li>
                <li>Gerenciar corridas da empresa</li>
                <li>Definir preços e configurações</li>
                <li>Visualizar relatórios da empresa</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🚗 Transportador</h3>
              <p className="text-gray-600 mb-2"><strong>Escopo:</strong> Empresa específica</p>
              <p className="text-gray-600 mb-2"><strong>Acesso:</strong> /[slug]/corridas</p>
              <p className="text-gray-600"><strong>Permissões:</strong></p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Ver corridas disponíveis</li>
                <li>Aceitar/recusar corridas</li>
                <li>Atualizar status das corridas</li>
                <li>Ver histórico pessoal</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-600 pl-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">👤 Cliente</h3>
              <p className="text-gray-600 mb-2"><strong>Escopo:</strong> Empresa específica</p>
              <p className="text-gray-600 mb-2"><strong>Acesso:</strong> /[slug]</p>
              <p className="text-gray-600"><strong>Permissões:</strong></p>
              <ul className="list-disc list-inside text-gray-600 ml-4">
                <li>Solicitar corridas</li>
                <li>Acompanhar status</li>
                <li>Avaliar transportadores</li>
                <li>Ver histórico de corridas</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Funcionalidades */}
        <div id="funcionalidades" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Car className="h-8 w-8 text-primary-600 mr-3" />
            4. Funcionalidades Principais
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestão de Corridas:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Solicitação de corrida com origem e destino</li>
              <li>Cálculo automático de distância via Google Maps</li>
              <li>Cálculo de preço baseado em km + tipo de veículo</li>
              <li>Status em tempo real (aguardando → aceito → em rota → entregue)</li>
              <li>Histórico completo de corridas</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tipos de Transporte:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li><strong>Passageiro:</strong> Transporte de pessoas (taxi, moto-taxi, Uber-like)</li>
              <li><strong>Objeto:</strong> Entrega de pacotes e encomendas</li>
              <li><strong>Carga:</strong> Transporte de cargas pesadas (caminhões, carretas)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalização por Empresa:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Logo personalizado</li>
              <li>Cores da marca (primária e secundária)</li>
              <li>Slug único na URL</li>
              <li>Domínio próprio (opcional)</li>
              <li>Política de privacidade customizada</li>
            </ul>
          </div>
        </div>

        {/* 5. Segurança */}
        <div id="seguranca" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="h-8 w-8 text-primary-600 mr-3" />
            5. Segurança e Privacidade
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Autenticação:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Autenticação via Supabase Auth</li>
              <li>Senhas criptografadas (bcrypt)</li>
              <li>Sessões seguras com tokens JWT</li>
              <li>Logout automático após período de inatividade</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Row Level Security (RLS):</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
              <li>Usuários só veem dados da própria empresa</li>
              <li>Transportadores só veem suas próprias corridas</li>
              <li>Clientes só veem suas próprias solicitações</li>
              <li>Administrador tem acesso global</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">LGPD e Privacidade:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Dados criptografados em trânsito (HTTPS)</li>
              <li>Dados criptografados em repouso (Supabase)</li>
              <li>Logs de auditoria para todas as ações</li>
              <li>Opção de exclusão de conta e dados</li>
            </ul>
          </div>
        </div>

        {/* 6. Integração */}
        <div id="integracao" className="card p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="h-8 w-8 text-primary-600 mr-3" />
            6. Integração de Empresas
          </h2>
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Processo de Onboarding:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
              <li>Empresa entra em contato com a Abistec</li>
              <li>Abistec cria a empresa no painel admin</li>
              <li>Define slug único (ex: /moto-taxi-express)</li>
              <li>Configura logo e cores</li>
              <li>Cria conta do gerente principal</li>
              <li>Gerente cadastra transportadores</li>
              <li>Sistema entra em operação</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Domínio Próprio (Opcional):</h3>
            <p className="text-gray-600 mb-4">
              A empresa pode optar por usar um domínio próprio que aponta para seu slug no MovTudo:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6 font-mono text-sm">
              <p className="mb-2">movtudo.netlify.app/moto-taxi → URL padrão</p>
              <p>mototaxiexpress.com.br → Domínio próprio (mesmo conteúdo)</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Planos e Preços:</h3>
            <p className="text-gray-600 mb-2">
              Entre em contato para receber uma proposta personalizada de acordo com:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Número de transportadores</li>
              <li>Volume de corridas/mês</li>
              <li>Necessidade de domínio próprio</li>
              <li>Funcionalidades adicionais</li>
            </ul>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="card p-8 bg-primary-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Links Úteis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ajuda" className="btn btn-secondary text-center">
              <FileText className="mr-2 h-5 w-5 inline" />
              Central de Ajuda
            </Link>
            <Link href="/contato" className="btn btn-secondary text-center">
              <Users className="mr-2 h-5 w-5 inline" />
              Fale Conosco
            </Link>
            <a 
              href="https://movtudo.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary text-center"
            >
              <Building2 className="mr-2 h-5 w-5 inline" />
              Acessar Sistema
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

