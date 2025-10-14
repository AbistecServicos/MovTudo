'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, CheckCircle, Clock, Truck, Package, MapPin, DollarSign, Users, BarChart3, Settings, Copy, ExternalLink } from 'lucide-react'
import { useAuth, useIsAdmin } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface RecursoModelo {
  id: string
  categoria: string
  nome: string
  descricao: string
  status: 'implementado' | 'em_desenvolvimento' | 'planejado'
  prioridade: 'alta' | 'media' | 'baixa'
  estimativa: string
}

export default function ModeloE2Page() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const isAdmin = useIsAdmin()
  const [loading, setLoading] = useState(true)
  const [recursos, setRecursos] = useState<RecursoModelo[]>([])
  const [stats, setStats] = useState({
    total: 0,
    implementados: 0,
    em_desenvolvimento: 0,
    planejados: 0
  })

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
        return
      }
      if (!isAdmin) {
        router.push('/')
        return
      }
      setLoading(false)
      loadRecursos()
    }
  }, [user, isAdmin, authLoading, router])

  const loadRecursos = () => {
    // Dados simulados dos recursos do modelo E2
    const recursosData: RecursoModelo[] = [
      // DASHBOARD DO GERENTE
      {
        id: '1',
        categoria: 'Dashboard do Gerente',
        nome: 'Métricas de Frota',
        descricao: 'Total de caminhoneiros, online/disponíveis, fretes pendentes',
        status: 'implementado',
        prioridade: 'alta',
        estimativa: '2 dias'
      },
      {
        id: '2',
        categoria: 'Dashboard do Gerente',
        nome: 'Gestão de Caminhoneiros',
        descricao: 'Cadastro, avaliação, histórico, status GPS',
        status: 'em_desenvolvimento',
        prioridade: 'alta',
        estimativa: '5 dias'
      },
      {
        id: '3',
        categoria: 'Dashboard do Gerente',
        nome: 'Gestão de Fretes',
        descricao: 'Solicitações, cálculo de preços, rastreamento',
        status: 'planejado',
        prioridade: 'alta',
        estimativa: '7 dias'
      },

      // DASHBOARD DO CAMINHONEIRO
      {
        id: '4',
        categoria: 'Dashboard do Caminhoneiro',
        nome: 'Fretes Disponíveis',
        descricao: 'Lista de fretes pendentes com detalhes completos',
        status: 'implementado',
        prioridade: 'alta',
        estimativa: '3 dias'
      },
      {
        id: '5',
        categoria: 'Dashboard do Caminhoneiro',
        nome: 'Métricas Pessoais',
        descricao: 'Corridas, ganhos, avaliação, status',
        status: 'implementado',
        prioridade: 'alta',
        estimativa: '2 dias'
      },
      {
        id: '6',
        categoria: 'Dashboard do Caminhoneiro',
        nome: 'Ações de Frete',
        descricao: 'Aceitar/recusar, atualizar status, comunicar problemas',
        status: 'em_desenvolvimento',
        prioridade: 'alta',
        estimativa: '4 dias'
      },

      // GESTÃO DE CARGAS
      {
        id: '7',
        categoria: 'Gestão de Cargas',
        nome: 'Tipos de Carga',
        descricao: 'Bebidas, alimentos, construção, químicos',
        status: 'implementado',
        prioridade: 'media',
        estimativa: '1 dia'
      },
      {
        id: '8',
        categoria: 'Gestão de Cargas',
        nome: 'Classificação por Peso',
        descricao: 'Leve, média, pesada com limites específicos',
        status: 'planejado',
        prioridade: 'media',
        estimativa: '2 dias'
      },

      // CÁLCULO DE PREÇOS
      {
        id: '9',
        categoria: 'Cálculo de Preços',
        nome: 'Fórmula de Preço',
        descricao: 'Preço base por km + adicional por peso + tipo de carga',
        status: 'planejado',
        prioridade: 'alta',
        estimativa: '5 dias'
      },
      {
        id: '10',
        categoria: 'Cálculo de Preços',
        nome: 'Fatores de Ajuste',
        descricao: 'Distância, tipo de estrada, urgência, período',
        status: 'planejado',
        prioridade: 'media',
        estimativa: '3 dias'
      },

      // INTEGRAÇÃO COM CLIENTES
      {
        id: '11',
        categoria: 'Integração com Clientes',
        nome: 'Clientes Prioritários',
        descricao: 'Coca-Cola, Pepsi, Ambev com configurações especiais',
        status: 'planejado',
        prioridade: 'alta',
        estimativa: '6 dias'
      },
      {
        id: '12',
        categoria: 'Integração com Clientes',
        nome: 'Contratos Especiais',
        descricao: 'Preços preferenciais, prioridade, relatórios, SLA',
        status: 'planejado',
        prioridade: 'media',
        estimativa: '4 dias'
      },

      // RECURSOS TÉCNICOS
      {
        id: '13',
        categoria: 'Recursos Técnicos',
        nome: 'Rastreamento GPS',
        descricao: 'Localização em tempo real, rota planejada vs real',
        status: 'planejado',
        prioridade: 'alta',
        estimativa: '8 dias'
      },
      {
        id: '14',
        categoria: 'Recursos Técnicos',
        nome: 'Sistema de Alertas',
        descricao: 'Notificações via Telegram, SMS, Email, Push',
        status: 'planejado',
        prioridade: 'alta',
        estimativa: '5 dias'
      },
      {
        id: '15',
        categoria: 'Recursos Técnicos',
        nome: 'Relatórios e Analytics',
        descricao: 'Performance da frota, faturamento, eficiência',
        status: 'planejado',
        prioridade: 'media',
        estimativa: '6 dias'
      }
    ]

    setRecursos(recursosData)

    // Calcular estatísticas
    const total = recursosData.length
    const implementados = recursosData.filter(r => r.status === 'implementado').length
    const em_desenvolvimento = recursosData.filter(r => r.status === 'em_desenvolvimento').length
    const planejados = recursosData.filter(r => r.status === 'planejado').length

    setStats({
      total,
      implementados,
      em_desenvolvimento,
      planejados
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implementado': return 'bg-green-100 text-green-800'
      case 'em_desenvolvimento': return 'bg-yellow-100 text-yellow-800'
      case 'planejado': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implementado': return <CheckCircle className="h-4 w-4" />
      case 'em_desenvolvimento': return <Clock className="h-4 w-4" />
      case 'planejado': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800'
      case 'media': return 'bg-yellow-100 text-yellow-800'
      case 'baixa': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando modelo E2...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="card p-8 max-w-md text-center">
          <FileText className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600 mb-6">
            Esta página é acessível apenas para administradores do sistema.
          </p>
          <Link href="/admin" className="btn btn-primary">
            Voltar ao Admin
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar ao Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/docs/modelos-empresas/E2-Transportadora.md" 
                target="_blank"
                className="btn btn-outline flex items-center"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Documentação Completa
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header da Página */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Truck className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">
              Modelo E2: Transportadora
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Template completo para empresas de transporte de cargas pesadas e fretes industriais. 
            Desenvolvido especificamente para transportadoras que servem grandes indústrias.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Recursos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Implementados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.implementados}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Desenvolvimento</p>
                <p className="text-2xl font-bold text-gray-900">{stats.em_desenvolvimento}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planejados</p>
                <p className="text-2xl font-bold text-gray-900">{stats.planejados}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Progresso do Modelo E2</h2>
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-4 mr-4">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(stats.implementados / stats.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((stats.implementados / stats.total) * 100)}% Concluído
            </span>
          </div>
        </div>

        {/* Recursos por Categoria */}
        <div className="space-y-8">
          {['Dashboard do Gerente', 'Dashboard do Caminhoneiro', 'Gestão de Cargas', 'Cálculo de Preços', 'Integração com Clientes', 'Recursos Técnicos'].map(categoria => {
            const recursosCategoria = recursos.filter(r => r.categoria === categoria)
            const implementados = recursosCategoria.filter(r => r.status === 'implementado').length
            const total = recursosCategoria.length
            
            return (
              <div key={categoria} className="card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{categoria}</h3>
                    <p className="text-sm text-gray-600">
                      {implementados} de {total} recursos implementados
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${total > 0 ? (implementados / total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {total > 0 ? Math.round((implementados / total) * 100) : 0}%
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {recursosCategoria.map(recurso => (
                    <div key={recurso.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{recurso.nome}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(recurso.status)}`}>
                              {getStatusIcon(recurso.status)}
                              <span className="ml-1 capitalize">{recurso.status.replace('_', ' ')}</span>
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioridadeColor(recurso.prioridade)}`}>
                              {recurso.prioridade.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{recurso.descricao}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Estimativa: {recurso.estimativa}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`${recurso.nome}: ${recurso.descricao}`)
                              toast.success('Recurso copiado!')
                            }}
                            className="btn btn-outline btn-sm"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            href="/transportadora" 
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Truck className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Testar Transportadora</h3>
            <p className="text-gray-600 text-sm">Acesse o dashboard da transportadora E2</p>
          </Link>
          
          <Link 
            href="/admin/empresas" 
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Building2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Gerenciar Empresas</h3>
            <p className="text-gray-600 text-sm">Criar ou editar empresas do tipo transportadora</p>
          </Link>
          
          <Link 
            href="/docs/modelos-empresas/E2-Transportadora.md" 
            target="_blank"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <FileText className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Documentação Completa</h3>
            <p className="text-gray-600 text-sm">Guia detalhado do modelo E2</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
