'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building2, 
  Car,
  Download,
  Calendar,
  Filter,
  PieChart,
  Activity,
  Clock,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface RelatorioStats {
  totalEmpresas: number
  empresasAtivas: number
  totalUsuarios: number
  totalCorridas: number
  corridasHoje: number
  corridasMes: number
  faturamentoTotal: number
  faturamentoMes: number
  faturamentoHoje: number
  corridasConcluidas: number
  corridasCanceladas: number
  transportadoresAtivos: number
}

interface RelatorioCorridas {
  id: number
  empresa_nome: string
  tipo: string
  status_transporte: string
  preco_calculado: number
  data: string
  distancia_km: number
}

interface RelatorioEmpresa {
  id_empresa: string
  empresa_nome: string
  total_corridas: number
  corridas_concluidas: number
  corridas_canceladas: number
  faturamento_total: number
  transportadores: number
}

export default function RelatoriosPage() {
  const [stats, setStats] = useState<RelatorioStats>({
    totalEmpresas: 0,
    empresasAtivas: 0,
    totalUsuarios: 0,
    totalCorridas: 0,
    corridasHoje: 0,
    corridasMes: 0,
    faturamentoTotal: 0,
    faturamentoMes: 0,
    faturamentoHoje: 0,
    corridasConcluidas: 0,
    corridasCanceladas: 0,
    transportadoresAtivos: 0
  })

  const [corridas, setCorridas] = useState<RelatorioCorridas[]>([])
  const [empresas, setEmpresas] = useState<RelatorioEmpresa[]>([])
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState('mes')
  const [filtroEmpresa, setFiltroEmpresa] = useState('all')

  useEffect(() => {
    loadRelatorios()
  }, [periodo, filtroEmpresa])

  const loadRelatorios = async () => {
    try {
      setLoading(true)

      // Calcular datas baseadas no período
      const hoje = new Date()
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
      const inicioSemana = new Date(hoje)
      inicioSemana.setDate(hoje.getDate() - 7)
      const inicioAno = new Date(hoje.getFullYear(), 0, 1)

      let dataInicio: Date
      switch (periodo) {
        case 'hoje':
          dataInicio = new Date(hoje)
          dataInicio.setHours(0, 0, 0, 0)
          break
        case 'semana':
          dataInicio = inicioSemana
          break
        case 'mes':
          dataInicio = inicioMes
          break
        case 'ano':
          dataInicio = inicioAno
          break
        default:
          dataInicio = inicioMes
      }

      // Buscar estatísticas gerais
      const { data: empresasData } = await supabase
        .from('empresas')
        .select('id, ativa')

      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('id')

      const { data: transportadoresData } = await supabase
        .from('empresa_associada')
        .select('id')
        .eq('funcao', 'transportador')
        .eq('status_vinculacao', 'ativo')

      // Buscar corridas com filtros
      let corridasQuery = supabase
        .from('corridas')
        .select('*')
        .gte('data', dataInicio.toISOString())
        .order('data', { ascending: false })

      if (filtroEmpresa !== 'all') {
        corridasQuery = corridasQuery.eq('id_empresa', filtroEmpresa)
      }

      const { data: corridasData } = await corridasQuery

      // Buscar dados das empresas
      const { data: empresasDetalhes } = await supabase
        .from('empresas')
        .select('id_empresa, empresa_nome')

      // Calcular estatísticas
      const totalEmpresas = empresasData?.length || 0
      const empresasAtivas = empresasData?.filter(e => e.ativa).length || 0
      const totalUsuarios = usuariosData?.length || 0
      const totalCorridas = corridasData?.length || 0
      const transportadoresAtivos = transportadoresData?.length || 0

      // Corridas hoje
      const hojeInicio = new Date()
      hojeInicio.setHours(0, 0, 0, 0)
      const corridasHoje = corridasData?.filter(c => 
        c.data && new Date(c.data) >= hojeInicio
      ).length || 0

      // Corridas do mês
      const corridasMes = corridasData?.filter(c => 
        c.data && new Date(c.data) >= inicioMes
      ).length || 0

      // Status das corridas
      const corridasConcluidas = corridasData?.filter(c => 
        c.status_transporte === 'entregue'
      ).length || 0

      const corridasCanceladas = corridasData?.filter(c => 
        c.status_transporte === 'cancelado'
      ).length || 0

      // Faturamento
      const faturamentoTotal = corridasData?.reduce((sum, c) => 
        sum + (parseFloat(c.preco_calculado) || 0), 0) || 0

      const faturamentoMes = corridasData?.filter(c => 
        c.data && new Date(c.data) >= inicioMes
      ).reduce((sum, c) => sum + (parseFloat(c.preco_calculado) || 0), 0) || 0

      const faturamentoHoje = corridasData?.filter(c => 
        c.data && new Date(c.data) >= hojeInicio
      ).reduce((sum, c) => sum + (parseFloat(c.preco_calculado) || 0), 0) || 0

      setStats({
        totalEmpresas,
        empresasAtivas,
        totalUsuarios,
        totalCorridas,
        corridasHoje,
        corridasMes,
        faturamentoTotal,
        faturamentoMes,
        faturamentoHoje,
        corridasConcluidas,
        corridasCanceladas,
        transportadoresAtivos
      })

      setCorridas(corridasData || [])

      // Calcular dados por empresa
      const empresasStats = empresasDetalhes?.map(empresa => {
        const corridasEmpresa = corridasData?.filter(c => c.id_empresa === empresa.id_empresa) || []
        const totalCorridas = corridasEmpresa.length
        const corridasConcluidas = corridasEmpresa.filter(c => c.status_transporte === 'entregue').length
        const corridasCanceladas = corridasEmpresa.filter(c => c.status_transporte === 'cancelado').length
        const faturamento = corridasEmpresa.reduce((sum, c) => sum + (parseFloat(c.preco_calculado) || 0), 0)
        
        return {
          id_empresa: empresa.id_empresa,
          empresa_nome: empresa.empresa_nome,
          total_corridas: totalCorridas,
          corridas_concluidas: corridasConcluidas,
          corridas_canceladas: corridasCanceladas,
          faturamento_total: faturamento,
          transportadores: 0 // Seria necessário buscar separadamente
        }
      }) || []

      setEmpresas(empresasStats)

    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportarRelatorio = () => {
    // Implementar exportação de relatório
    console.log('Exportando relatório...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregue':
        return 'text-green-600 bg-green-100'
      case 'cancelado':
        return 'text-red-600 bg-red-100'
      case 'aguardando':
        return 'text-yellow-600 bg-yellow-100'
      case 'em_andamento':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="mt-2 text-gray-600">
            Análise de performance e métricas do sistema
          </p>
        </div>
        <button
          onClick={exportarRelatorio}
          className="btn btn-primary flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exportar
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="input"
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Este mês</option>
                <option value="ano">Este ano</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <select
                value={filtroEmpresa}
                onChange={(e) => setFiltroEmpresa(e.target.value)}
                className="input"
              >
                <option value="all">Todas as empresas</option>
                {empresas.map(empresa => (
                  <option key={empresa.id_empresa} value={empresa.id_empresa}>
                    {empresa.empresa_nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Total de Corridas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCorridas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Faturamento</p>
                <p className="text-2xl font-semibold text-gray-900">
                  R$ {stats.faturamentoTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Concluídas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.corridasConcluidas}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-500">Canceladas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.corridasCanceladas}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance por Empresa */}
      <div className="card">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance por Empresa</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          {empresas.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma empresa encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há dados de empresas para o período selecionado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Corridas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taxa Sucesso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Faturamento
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {empresas.map((empresa) => {
                    const taxaSucesso = empresa.total_corridas > 0 
                      ? ((empresa.corridas_concluidas / empresa.total_corridas) * 100).toFixed(1)
                      : '0.0'
                    
                    return (
                      <tr key={empresa.id_empresa} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {empresa.empresa_nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {empresa.id_empresa}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {empresa.total_corridas}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${taxaSucesso}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{taxaSucesso}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          R$ {empresa.faturamento_total.toFixed(2)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Últimas Corridas */}
      <div className="card">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Últimas Corridas</h3>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          {corridas.length === 0 ? (
            <div className="text-center py-8">
              <Car className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma corrida encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Não há corridas para o período selecionado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {corridas.slice(0, 10).map((corrida) => (
                    <tr key={corrida.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {corrida.empresa_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {corrida.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(corrida.status_transporte)}`}>
                          {corrida.status_transporte}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        R$ {parseFloat(String(corrida.preco_calculado)).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {corrida.data ? new Date(corrida.data).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
