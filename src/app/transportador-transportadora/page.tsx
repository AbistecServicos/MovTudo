'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle,
  AlertCircle,
  Package,
  Navigation,
  Phone,
  Star
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface SolicitacaoFrete {
  id: string
  cliente: string
  origem: string
  destino: string
  peso: string
  tipo_carga: string
  valor: string
  status: 'disponivel' | 'aceita' | 'em_andamento' | 'concluida'
  data_solicitacao: string
  distancia: string
  tempo_estimado: string
}

export default function TransportadorTransportadoraPage() {
  const router = useRouter()
  const { user, empresaAssociada } = useAuth()
  const [loading, setLoading] = useState(true)
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoFrete[]>([])
  const [stats, setStats] = useState({
    corridas_hoje: 0,
    ganhos_hoje: 0,
    avaliacao: 4.7,
    status: 'online'
  })

  useEffect(() => {
    if (!user || !empresaAssociada || empresaAssociada.funcao !== 'transportador') {
      router.push('/')
      return
    }

    loadData()
  }, [user, empresaAssociada])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Simular dados para demonstração
      const solicitacoesData: SolicitacaoFrete[] = [
        {
          id: '1',
          cliente: 'Coca-Cola Brasil',
          origem: 'Rio de Janeiro - RJ',
          destino: 'Belo Horizonte - MG',
          peso: '15.000kg',
          tipo_carga: 'Bebidas',
          valor: 'R$ 2.500,00',
          status: 'disponivel',
          data_solicitacao: '2025-10-14',
          distancia: '450km',
          tempo_estimado: '6h30min'
        },
        {
          id: '2',
          cliente: 'PepsiCo',
          origem: 'São Paulo - SP',
          destino: 'Vitória - ES',
          peso: '8.000kg',
          tipo_carga: 'Bebidas',
          valor: 'R$ 1.800,00',
          status: 'disponivel',
          data_solicitacao: '2025-10-14',
          distancia: '320km',
          tempo_estimado: '4h45min'
        },
        {
          id: '3',
          cliente: 'Ambev',
          origem: 'Rio de Janeiro - RJ',
          destino: 'Campos - RJ',
          peso: '12.000kg',
          tipo_carga: 'Bebidas',
          valor: 'R$ 1.200,00',
          status: 'disponivel',
          data_solicitacao: '2025-10-14',
          distancia: '280km',
          tempo_estimado: '4h15min'
        }
      ]

      setSolicitacoes(solicitacoesData)

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const aceitarFrete = (solicitacaoId: string) => {
    toast.success('Frete aceito com sucesso!')
    // Aqui seria a lógica para aceitar o frete
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
                <p className="text-sm text-gray-500">Transportador</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  stats.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm text-gray-600 capitalize">{stats.status}</span>
              </div>
              <Link href="/perfil" className="btn btn-outline">
                Meu Perfil
              </Link>
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
                <p className="text-sm font-medium text-gray-600">Corridas Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.corridas_hoje}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ganhos Hoje</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats.ganhos_hoje.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avaliação</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avaliacao}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fretes Disponíveis</p>
                <p className="text-2xl font-bold text-gray-900">
                  {solicitacoes.filter(s => s.status === 'disponivel').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fretes Disponíveis */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Fretes Disponíveis</h2>
            <button 
              onClick={loadData}
              className="btn btn-outline btn-sm"
            >
              Atualizar
            </button>
          </div>
          
          <div className="space-y-4">
            {solicitacoes.filter(s => s.status === 'disponivel').map((solicitacao) => (
              <div key={solicitacao.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {solicitacao.cliente}
                    </h3>
                    <p className="text-sm text-gray-600">{solicitacao.tipo_carga}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{solicitacao.valor}</p>
                    <p className="text-sm text-gray-500">{solicitacao.peso}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium">Origem:</p>
                      <p>{solicitacao.origem}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Navigation className="h-4 w-4 mr-2 text-red-500" />
                    <div>
                      <p className="font-medium">Destino:</p>
                      <p>{solicitacao.destino}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2 text-purple-500" />
                    <div>
                      <p className="font-medium">Tempo:</p>
                      <p>{solicitacao.tempo_estimado}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📅 {solicitacao.data_solicitacao}</span>
                    <span>📏 {solicitacao.distancia}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => aceitarFrete(solicitacao.id)}
                      className="btn btn-primary"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aceitar Frete
                    </button>
                    <button className="btn btn-outline">
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {solicitacoes.filter(s => s.status === 'disponivel').length === 0 && (
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum frete disponível
                </h3>
                <p className="text-gray-600">
                  Novos fretes aparecerão aqui quando estiverem disponíveis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
