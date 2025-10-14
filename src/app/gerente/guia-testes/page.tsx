'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { 
  ArrowLeft, 
  BookOpen, 
  ExternalLink, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Car,
  MapPin,
  Phone,
  Mail,
  Building2
} from 'lucide-react'

export default function GuiaTestesPage() {
  const { user, empresaAssociada, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.is_admin) {
        router.push('/admin/empresas')
        return
      }
      
      if (!empresaAssociada || empresaAssociada.funcao !== 'gerente') {
        router.push('/perfil')
        return
      }
    }
  }, [user, empresaAssociada, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !empresaAssociada || empresaAssociada.funcao !== 'gerente') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/gerente" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Painel
            </Link>
            <Link href="/gerente" className="flex items-center hover:opacity-80 transition-opacity">
              <Building2 className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-bold text-gray-900">Painel do Gerente</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-primary-600 mr-3" />
            Guia de Testes - MovTudo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manual completo para testar todas as funcionalidades do sistema MovTudo. 
            Siga este guia passo a passo para validar o funcionamento da plataforma.
          </p>
        </div>

        {/* Status dos Sites */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Globe className="h-8 w-8 text-primary-600 mr-3" />
            Status dos Sites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-200 rounded-lg p-6 bg-green-50">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">Site Vercel (Ativo)</h3>
              </div>
              <p className="text-green-700 mb-4">
                Site principal em funcionamento com todas as funcionalidades.
              </p>
              <a 
                href="https://mov-tudo.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-success flex items-center w-fit"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Site Vercel
              </a>
            </div>

            <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-900">Site Principal (Em breve)</h3>
              </div>
              <p className="text-yellow-700 mb-4">
                Domínio principal movtudo.com.br será registrado em breve.
              </p>
              <div className="text-sm text-yellow-600">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Aguardando registro do domínio
              </div>
            </div>
          </div>
        </div>

        {/* Links Úteis */}
        <div className="card p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ExternalLink className="h-8 w-8 text-primary-600 mr-3" />
            Links Úteis para Testes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="https://mov-tudo.vercel.app/admin" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Painel Admin</p>
                <p className="text-sm text-gray-600">Gestão completa do sistema</p>
              </div>
            </a>

            <a 
              href="https://mov-tudo.vercel.app/login" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Car className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Login</p>
                <p className="text-sm text-gray-600">Acesso ao sistema</p>
              </div>
            </a>

            <a 
              href="https://mov-tudo.vercel.app/cadastro" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Cadastro</p>
                <p className="text-sm text-gray-600">Registrar novos usuários</p>
              </div>
            </a>

            <a 
              href="https://mov-tudo.vercel.app/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Documentação</p>
                <p className="text-sm text-gray-600">Manual técnico completo</p>
              </div>
            </a>

            <a 
              href="https://mov-tudo.vercel.app/contato" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Contato</p>
                <p className="text-sm text-gray-600">Suporte e comunicação</p>
              </div>
            </a>

            <a 
              href="https://mov-tudo.vercel.app/ajuda" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertCircle className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Central de Ajuda</p>
                <p className="text-sm text-gray-600">FAQ e suporte</p>
              </div>
            </a>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="card p-8 bg-primary-50 border border-primary-200">
          <h2 className="text-2xl font-bold text-primary-900 mb-6 flex items-center">
            <Phone className="h-8 w-8 text-primary-600 mr-3" />
            Informações de Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Suporte Técnico</h3>
              <div className="space-y-2">
                <p className="text-primary-700">
                  <Mail className="h-4 w-4 inline mr-2" />
                  comercial@abistec.com.br
                </p>
                <p className="text-primary-700">
                  <Phone className="h-4 w-4 inline mr-2" />
                  WhatsApp disponível no site
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 mb-3">Desenvolvimento</h3>
              <div className="space-y-2">
                <p className="text-primary-700">
                  <Building2 className="h-4 w-4 inline mr-2" />
                  Abistec Serviços Tecnológicos
                </p>
                <p className="text-primary-700">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Sistema MovTudo v1.0
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções de Teste */}
        <div className="card p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            Instruções de Teste
          </h2>
          <div className="prose max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Como Testar o Sistema:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Acesse o <strong>Painel Admin</strong> para criar empresas e usuários</li>
                <li>Use o <strong>Login</strong> para testar diferentes tipos de usuário</li>
                <li>Navegue pelas <strong>páginas da empresa</strong> usando slugs</li>
                <li>Teste o <strong>fluxo completo</strong> de corridas</li>
                <li>Verifique as <strong>notificações</strong> e integrações</li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Dados de Teste Disponíveis:</h3>
              <ul className="list-disc list-inside space-y-2 text-green-800">
                <li><strong>Usuários Admin:</strong> Augusto e outros administradores</li>
                <li><strong>Empresas:</strong> MotoTaxi Express, Delivery Rápido, etc.</li>
                <li><strong>Transportadores:</strong> Usuários com funções específicas</li>
                <li><strong>Corridas:</strong> Dados de exemplo para testes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
