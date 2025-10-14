'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Truck, 
  Users, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Filter
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Caminhoneiro {
  id: string
  nome: string
  telefone: string
  veiculo: string
  capacidade: string
  status: 'online' | 'offline' | 'ocupado'
  localizacao: string
  avaliacao: number
}

interface SolicitacaoFrete {
  id: string
  cliente: string
  origem: string
  destino: string
  peso: string
  tipo_carga: string
  valor: string
  status: 'pendente' | 'aceita' | 'em_andamento' | 'concluida'
  data_solicitacao: string
}

export default function TransportadoraPage() {
  const router = useRouter()
  const { user, empresaAssociada } = useAuth()
  const [loading, setLoading] = useState(true)
  const [caminhoneiros, setCaminhoneiros] = useState<Caminhoneiro[]>([])
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoFrete[]>([])
  const [stats, setStats] = useState({
    total_caminhoneiros: 0,
    caminhoneiros_online: 0,
    solicitacoes_pendentes: 0,
    faturamento_mes: 0
  })

  useEffect(() => {
    // Permitir acesso para administradores (visualização) e gerentes (gestão)
    if (!user) {
      router.push('/login')
      return
    }
    
    // Se não for admin e não for gerente, redireciona
    if (!user.is_admin && (!empresaAssociada || empresaAssociada.funcao !== 'gerente')) {
      router.push('/')
      return
    }

    loadData()
  }, [user, empresaAssociada])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Simular dados para demonstração
      const caminhoneirosData: Caminhoneiro[] = [
        {
          id: '1',
          nome: 'João Silva',
          telefone: '(21) 99999-0001',
          veiculo: 'Caminhão 3/4',
          capacidade: '3.500kg',
          status: 'online',
          localizacao: 'Rio de Janeiro - RJ',
          avaliacao: 4.8
        },
        {
          id: '2',
          nome: 'Maria Santos',
          telefone: '(21) 99999-0002',
          veiculo: 'Carreta',
          capacidade: '25.000kg',
          status: 'ocupado',
          localizacao: 'São Paulo - SP',
          avaliacao: 4.9
        },
        {
          id: '3',
          nome: 'Pedro Costa',
          telefone: '(21) 99999-0003',
          veiculo: 'Toco',
          capacidade: '7.000kg',
          status: 'offline',
          localizacao: 'Belo Horizonte - MG',
          avaliacao: 4.7
        }
      ]

      const solicitacoesData: SolicitacaoFrete[] = [
        {
          id: '1',
          cliente: 'Coca-Cola Brasil',
          origem: 'Rio de Janeiro - RJ',
          destino: 'Belo Horizonte - MG',
          peso: '15.000kg',
          tipo_carga: 'Bebidas',
          valor: 'R$ 2.500,00',
          status: 'pendente',
          data_solicitacao: '2025-10-14'
        },
        {
          id: '2',
          cliente: 'PepsiCo',
          origem: 'São Paulo - SP',
          destino: 'Vitória - ES',
          peso: '8.000kg',
          tipo_carga: 'Bebidas',
          valor: 'R$ 1.800,00',
          status: 'aceita',
          data_solicitacao: '2025-10-13'
        }
      ]

      setCaminhoneiros(caminhoneirosData)
      setSolicitacoes(solicitacoesData)
      setStats({
        total_caminhoneiros: caminhoneirosData.length,
        caminhoneiros_online: caminhoneirosData.filter(c => c.status === 'online').length,
        solicitacoes_pendentes: solicitacoesData.filter(s => s.status === 'pendente').length,
        faturamento_mes: 45000
      })

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {empresaAssociada?.empresa_nome}
                </h1>
                <p className="text-sm text-gray-500">Transportadora</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </button>
              <button className="btn btn-outline">
                <Users className="h-4 w-4 mr-2" />
                Cadastrar Caminhoneiro
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Caminhoneiros</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_caminhoneiros}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-gray-900">{stats.caminhoneiros_online}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Solicitações Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.solicitacoes_pendentes}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Faturamento Mês</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats.faturamento_mes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Caminhoneiros */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de Caminhoneiros */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Caminhoneiros</h2>
              <button className="btn btn-outline btn-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </button>
            </div>
            
            <div className="space-y-4">
              {caminhoneiros.map((caminhoneiro) => (
                <div key={caminhoneiro.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{caminhoneiro.nome}</h3>
                      <p className="text-sm text-gray-600">{caminhoneiro.telefone}</p>
                      <p className="text-sm text-gray-600">
                        {caminhoneiro.veiculo} - {caminhoneiro.capacidade}
                      </p>
                      <p className="text-sm text-gray-600">{caminhoneiro.localizacao}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        caminhoneiro.status === 'online' 
                          ? 'bg-green-100 text-green-800'
                          : caminhoneiro.status === 'ocupado'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {caminhoneiro.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        ⭐ {caminhoneiro.avaliacao}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solicitações de Frete */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Solicitações de Frete</h2>
              <button className="btn btn-outline btn-sm">
                <Eye className="h-4 w-4 mr-2" />
                Ver Todas
              </button>
            </div>
            
            <div className="space-y-4">
              {solicitacoes.map((solicitacao) => (
                <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{solicitacao.cliente}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      solicitacao.status === 'pendente' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : solicitacao.status === 'aceita'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {solicitacao.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Origem:</strong> {solicitacao.origem}</p>
                    <p><strong>Destino:</strong> {solicitacao.destino}</p>
                    <p><strong>Carga:</strong> {solicitacao.peso} - {solicitacao.tipo_carga}</p>
                    <p><strong>Valor:</strong> {solicitacao.valor}</p>
                    <p><strong>Data:</strong> {solicitacao.data_solicitacao}</p>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button className="btn btn-primary btn-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Aceitar
                    </button>
                    <button className="btn btn-outline btn-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
