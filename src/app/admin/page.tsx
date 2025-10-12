'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Users, 
  Car, 
  TrendingUp, 
  Clock, 
  MapPin,
  DollarSign,
  Activity
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  totalEmpresas: number
  empresasAtivas: number
  totalUsuarios: number
  totalCorridas: number
  corridasHoje: number
  faturamentoMes: number
  corridasPendentes: number
  transportadoresAtivos: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmpresas: 0,
    empresasAtivas: 0,
    totalUsuarios: 0,
    totalCorridas: 0,
    corridasHoje: 0,
    faturamentoMes: 0,
    corridasPendentes: 0,
    transportadoresAtivos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      // Buscar estatísticas das empresas
      const { data: empresasData } = await supabase
        .from('empresas')
        .select('id, ativa')

      // Buscar estatísticas dos usuários
      const { data: usuariosData } = await supabase
        .from('usuarios')
        .select('id')

      // Buscar estatísticas das corridas
      const { data: corridasData } = await supabase
        .from('corridas')
        .select('id, status_transporte, data, preco_calculado')

      // Buscar transportadores ativos
      const { data: transportadoresData } = await supabase
        .from('empresa_associada')
        .select('id')
        .eq('funcao', 'transportador')
        .eq('status_vinculacao', 'ativo')

      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const hojeString = hoje.toISOString()

      const totalEmpresas = empresasData?.length || 0
      const empresasAtivas = empresasData?.filter(e => e.ativa).length || 0
      const totalUsuarios = usuariosData?.length || 0
      const totalCorridas = corridasData?.length || 0
      const corridasHoje = corridasData?.filter(c => 
        c.data && new Date(c.data) >= hoje
      ).length || 0
      const corridasPendentes = corridasData?.filter(c => 
        c.status_transporte === 'aguardando'
      ).length || 0
      const transportadoresAtivos = transportadoresData?.length || 0

      // Calcular faturamento do mês
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)
      
      const faturamentoMes = corridasData
        ?.filter(c => 
          c.data && 
          new Date(c.data) >= inicioMes && 
          c.status_transporte === 'entregue' &&
          c.preco_calculado
        )
        .reduce((total, c) => total + (c.preco_calculado || 0), 0) || 0

      setStats({
        totalEmpresas,
        empresasAtivas,
        totalUsuarios,
        totalCorridas,
        corridasHoje,
        faturamentoMes,
        corridasPendentes,
        transportadoresAtivos
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total de Empresas',
      value: stats.totalEmpresas,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      link: '/admin/empresas'
    },
    {
      name: 'Empresas Ativas',
      value: stats.empresasAtivas,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/empresas'
    },
    {
      name: 'Total de Usuários',
      value: stats.totalUsuarios,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      link: '/admin/usuarios'
    },
    {
      name: 'Transportadores Ativos',
      value: stats.transportadoresAtivos,
      icon: Car,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      link: '/admin/usuarios'
    },
    {
      name: 'Total de Corridas',
      value: stats.totalCorridas,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      link: '/admin/corridas'
    },
    {
      name: 'Corridas Hoje',
      value: stats.corridasHoje,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      link: '/admin/corridas'
    },
    {
      name: 'Corridas Pendentes',
      value: stats.corridasPendentes,
      icon: MapPin,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      link: '/admin/corridas'
    },
    {
      name: 'Faturamento do Mês',
      value: `R$ ${stats.faturamentoMes.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      link: '/admin/relatorios'
    }
  ]

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do sistema MovTudo
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.name}
              href={stat.link}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresas */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Gerenciar Empresas
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Administre todas as empresas de transporte cadastradas no sistema.
            </p>
            <div className="flex space-x-3">
              <Link href="/admin/empresas" className="btn btn-primary">
                Ver Todas
              </Link>
              <Link href="/admin/empresas/nova" className="btn btn-secondary">
                Nova Empresa
              </Link>
            </div>
          </div>
        </div>

        {/* Usuários */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Gerenciar Usuários
            </h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 mb-4">
              Visualize e gerencie todos os usuários do sistema.
            </p>
            <div className="flex space-x-3">
              <Link href="/admin/usuarios" className="btn btn-primary">
                Ver Todos
              </Link>
              <Link href="/admin/usuarios/novo" className="btn btn-secondary">
                Novo Usuário
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresas Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Empresas Recentes
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Aqui seria implementada uma lista de empresas recentes */}
              <div className="text-center py-8 text-gray-500">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Nenhuma empresa cadastrada recentemente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Corridas Recentes */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">
              Corridas Recentes
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {/* Aqui seria implementada uma lista de corridas recentes */}
              <div className="text-center py-8 text-gray-500">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Nenhuma corrida registrada recentemente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Status do Sistema
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Banco de Dados
                </p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Google Maps API
                </p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Telegram Bot
                </p>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
