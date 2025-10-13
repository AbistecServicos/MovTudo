'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Package, 
  Car, 
  TrendingUp, 
  LogOut,
  Settings,
  Bell,
  DollarSign,
  CheckCircle,
  Building2
} from 'lucide-react'

interface EmpresaVinculada {
  id: number
  id_empresa: string
  empresa_nome: string
  funcao: string
  status_vinculacao: string
}

export default function TransportadorPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [empresasVinculadas, setEmpresasVinculadas] = useState<EmpresaVinculada[]>([])
  const [stats, setStats] = useState({
    corridasAguardando: 0,
    corridasEmAndamento: 0,
    corridasEntregues: 0,
    ganhosMes: 0
  })

  useEffect(() => {
    // Verificar se é transportador
    if (!loading && user) {
      if (user.is_admin) {
        router.push('/admin/empresas')
        return
      }

      // Carregar empresas vinculadas
      loadEmpresasVinculadas()
      loadStats()
    }
  }, [user, loading, router])

  const loadEmpresasVinculadas = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('empresa_associada')
        .select('*')
        .eq('uid_usuario', user.uid)
        .eq('funcao', 'transportador')
        .eq('status_vinculacao', 'ativo')

      if (!error && data) {
        setEmpresasVinculadas(data)
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error)
    }
  }

  const loadStats = async () => {
    if (!user) return

    try {
      // Buscar corridas do transportador
      const { data: corridas, error } = await supabase
        .from('corridas')
        .select('status_transporte, frete_pago, data')
        .eq('aceito_por_uid', user.uid)

      if (!error && corridas) {
        const hoje = new Date()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()

        const ganhosMes = corridas
          .filter(c => {
            if (!c.data) return false
            const dataCorrida = new Date(c.data)
            return dataCorrida.getMonth() === mesAtual && 
                   dataCorrida.getFullYear() === anoAtual &&
                   c.status_transporte === 'entregue'
          })
          .reduce((sum, c) => sum + (Number(c.frete_pago) || 0), 0)

        setStats({
          corridasAguardando: corridas.filter(c => c.status_transporte === 'aguardando').length,
          corridasEmAndamento: corridas.filter(c => ['aceito', 'coletando', 'em_rota'].includes(c.status_transporte)).length,
          corridasEntregues: corridas.filter(c => c.status_transporte === 'entregue').length,
          ganhosMes
        })
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-gray-900">MovTudo</h1>
                <p className="text-sm text-gray-500">Painel do Transportador</p>
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
            Gerencie suas corridas e empresas vinculadas
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <Car className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Entregues */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Entregues</p>
                <p className="text-3xl font-bold text-green-600">{stats.corridasEntregues}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Ganhos do Mês */}
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ganhos do Mês</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {stats.ganhosMes.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Empresas Vinculadas */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Empresas Vinculadas ({empresasVinculadas.length})
          </h3>
          
          {empresasVinculadas.length === 0 ? (
            <div className="card p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Você ainda não está vinculado a nenhuma empresa.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Entre em contato com uma empresa para se cadastrar como transportador.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {empresasVinculadas.map((emp) => (
                <div key={emp.id} className="card p-4">
                  <div className="flex items-center mb-2">
                    <Building2 className="h-5 w-5 text-primary-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">{emp.empresa_nome}</h4>
                  </div>
                  <p className="text-sm text-gray-600">ID: {emp.id_empresa}</p>
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {emp.status_vinculacao}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu de Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Corridas Disponíveis */}
          <button
            onClick={() => router.push('/transportador/corridas-disponiveis')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Corridas Disponíveis</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Veja corridas aguardando aceitação de todas as empresas
            </p>
          </button>

          {/* Minhas Corridas */}
          <button
            onClick={() => router.push('/transportador/minhas-corridas')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Minhas Corridas</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Acompanhe suas corridas em andamento e histórico
            </p>
          </button>

          {/* Ganhos */}
          <button
            onClick={() => router.push('/transportador/ganhos')}
            className="card p-6 hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="ml-3 text-lg font-semibold text-gray-900">Ganhos</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Visualize seus ganhos e histórico de pagamentos
            </p>
          </button>
        </div>
      </main>
    </div>
  )
}





