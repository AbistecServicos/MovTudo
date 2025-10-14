'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Building2, 
  Users, 
  Car, 
  TrendingUp, 
  Package, 
  LogOut,
  Settings,
  Bell,
  MapPin,
  Phone,
  BookOpen,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function GerentePage() {
  const { user, empresa, empresaAssociada, loading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalCorridas: 0,
    corridasAguardando: 0,
    corridasEmAndamento: 0,
    corridasEntregues: 0,
    totalTransportadores: 0
  })

  useEffect(() => {
    // Verificar se é gerente
    if (!loading && user) {
      if (user.is_admin) {
        router.push('/admin/empresas')
        return
      }
      
      if (!empresaAssociada || empresaAssociada.funcao !== 'gerente') {
        router.push('/perfil')
        return
      }

      // Carregar estatísticas
      loadStats()
    }
  }, [user, empresaAssociada, loading, router])

  const loadStats = async () => {
    if (!empresaAssociada) return

    try {
      // Buscar corridas da empresa
      const { data: corridas, error: corridasError } = await supabase
        .from('corridas')
        .select('status_transporte')
        .eq('id_empresa', empresaAssociada.id_empresa)

      if (!corridasError && corridas) {
        setStats(prev => ({
          ...prev,
          totalCorridas: corridas.length,
          corridasAguardando: corridas.filter(c => c.status_transporte === 'aguardando').length,
          corridasEmAndamento: corridas.filter(c => ['aceito', 'coletando', 'em_rota'].includes(c.status_transporte)).length,
          corridasEntregues: corridas.filter(c => c.status_transporte === 'entregue').length
        }))
      }

      // Buscar transportadores da empresa
      const { data: transportadores, error: transError } = await supabase
        .from('empresa_associada')
        .select('*')
        .eq('id_empresa', empresaAssociada.id_empresa)
        .eq('funcao', 'transportador')
        .eq('status_vinculacao', 'ativo')

      if (!transError && transportadores) {
        setStats(prev => ({
          ...prev,
          totalTransportadores: transportadores.length
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !empresaAssociada || empresaAssociada.funcao !== 'gerente') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">{empresa?.empresa_nome}</h1>
                <p className="text-sm text-gray-500">Painel do Gerente</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="btn btn-outline flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bem-vindo */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user.nome_completo}!
          </h2>
          <p className="text-gray-600">
            Gerencie sua empresa de transporte de forma eficiente
          </p>
        </div>

        {/* Info da Empresa */}
        {empresa && (
          <div className="card p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informações da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{empresa.empresa_endereco}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{empresa.empresa_telefone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    <span>{empresa.empresa_cidade}, {empresa.empresa_estado}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="h-5 w-5 mr-2 text-gray-400" />
                    <span>Perímetro: {empresa.empresa_perimetro_entrega}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Corridas */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Corridas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCorridas}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Aguardando */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aguardando</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.corridasAguardando}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Em Andamento */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Em Andamento</p>
                <p className="text-3xl font-bold text-blue-600">{stats.corridasEmAndamento}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Transportadores */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transportadores</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalTransportadores}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Menu de Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Corridas */}
          <button
            onClick={() => router.push('/gerente/corridas')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Car className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Corridas</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualize e gerencie todas as corridas da sua empresa
            </p>
          </button>

          {/* Transportadores */}
          <button
            onClick={() => router.push('/gerente/transportadores')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Transportadores</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Gerencie os transportadores vinculados à sua empresa
            </p>
          </button>

          {/* Relatórios */}
          <button
            onClick={() => router.push('/gerente/relatorios')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Relatórios</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualize relatórios e estatísticas da sua empresa
            </p>
          </button>

          {/* Configurações */}
          <button
            onClick={() => router.push('/gerente/configuracoes')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Configurações</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Configure informações e preferências da empresa
            </p>
          </button>

          {/* Notificações */}
          <button
            onClick={() => router.push('/gerente/notificacoes')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Notificações</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Configure notificações e alertas do sistema
            </p>
          </button>

          {/* Meu Perfil */}
          <button
            onClick={() => router.push('/perfil')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Meu Perfil</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualize e edite suas informações pessoais
            </p>
          </button>

          {/* Guia de Testes */}
          <button
            onClick={() => router.push('/gerente/guia-testes')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Guia de Testes</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Manual completo para testar todas as funcionalidades do sistema
            </p>
          </button>
        </div>

        {/* Informação sobre a empresa */}
        {empresaAssociada && (
          <div className="mt-8 card p-6 bg-primary-50 border border-primary-200">
            <div className="flex items-start">
              <Building2 className="h-6 w-6 text-primary-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  Você está gerenciando: {empresa?.empresa_nome}
                </h3>
                <p className="text-primary-700 text-sm">
                  Como gerente, você tem acesso total às funcionalidades de gestão desta empresa.
                  Você pode visualizar corridas, gerenciar transportadores e acompanhar relatórios.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}







