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
  Filter,
  FileText,
  ArrowLeft,
  X
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

interface TransportadorDisponivel {
  id: string
  nome: string
  telefone: string
  localizacao_atual: string
  destino: string
  horario_disponivel: string
  capacidade_maxima: string
  tipos_carga: string[]
  avaliacao: number
  distancia_km: number
  tempo_estimado: string
}

interface OfertaFrete {
  id: string
  transportador_id: string
  transportador_nome: string
  origem: string
  destino: string
  peso: string
  tipo_carga: string
  valor_proposto: string
  data_coleta: string
  horario_coleta: string
  observacoes: string
  status: 'pendente' | 'aceita' | 'recusada' | 'negociando'
  data_oferta: string
}

export default function TransportadoraPage() {
  const router = useRouter()
  const { user, empresaAssociada } = useAuth()
  const [loading, setLoading] = useState(true)
  const [caminhoneiros, setCaminhoneiros] = useState<Caminhoneiro[]>([])
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoFrete[]>([])
  const [transportadoresDisponiveis, setTransportadoresDisponiveis] = useState<TransportadorDisponivel[]>([])
  const [ofertasEnviadas, setOfertasEnviadas] = useState<OfertaFrete[]>([])
  const [modalOferta, setModalOferta] = useState<{
    aberto: boolean
    transportador: TransportadorDisponivel | null
  }>({
    aberto: false,
    transportador: null
  })
  const [novaOferta, setNovaOferta] = useState({
    origem: '',
    destino: '',
    peso: '',
    tipo_carga: 'bebidas',
    valor_proposto: '',
    data_coleta: '',
    horario_coleta: '',
    observacoes: ''
  })
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

  const abrirModalOferta = (transportador: TransportadorDisponivel) => {
    setModalOferta({ aberto: true, transportador })
    // Preencher dados automáticos baseados no transportador
    setNovaOferta(prev => ({
      ...prev,
      origem: transportador.localizacao_atual,
      destino: transportador.destino,
      data_coleta: new Date().toISOString().split('T')[0],
      horario_coleta: '08:00'
    }))
  }

  const fecharModalOferta = () => {
    setModalOferta({ aberto: false, transportador: null })
    setNovaOferta({
      origem: '',
      destino: '',
      peso: '',
      tipo_carga: 'bebidas',
      valor_proposto: '',
      data_coleta: '',
      horario_coleta: '',
      observacoes: ''
    })
  }

  const enviarOferta = () => {
    if (!modalOferta.transportador) return

    const oferta: OfertaFrete = {
      id: Date.now().toString(),
      transportador_id: modalOferta.transportador.id,
      transportador_nome: modalOferta.transportador.nome,
      origem: novaOferta.origem,
      destino: novaOferta.destino,
      peso: novaOferta.peso,
      tipo_carga: novaOferta.tipo_carga,
      valor_proposto: novaOferta.valor_proposto,
      data_coleta: novaOferta.data_coleta,
      horario_coleta: novaOferta.horario_coleta,
      observacoes: novaOferta.observacoes,
      status: 'pendente',
      data_oferta: new Date().toISOString()
    }

    setOfertasEnviadas(prev => [...prev, oferta])
    toast.success(`Oferta enviada para ${modalOferta.transportador.nome}!`)
    fecharModalOferta()
  }

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Simular dados para demonstração
      const transportadoresDisponiveisData: TransportadorDisponivel[] = [
        {
          id: '1',
          nome: 'José Caminhoneiro',
          telefone: '(21) 99999-0001',
          localizacao_atual: 'Rio de Janeiro - RJ',
          destino: 'São Paulo - SP',
          horario_disponivel: 'Até 18h',
          capacidade_maxima: '15.000kg',
          tipos_carga: ['bebidas', 'alimentos'],
          avaliacao: 4.8,
          distancia_km: 450,
          tempo_estimado: '5h30min'
        },
        {
          id: '2',
          nome: 'Ana Silva',
          telefone: '(21) 99999-0102',
          localizacao_atual: 'Duque de Caxias - RJ',
          destino: 'Belo Horizonte - MG',
          horario_disponivel: 'Manhã inteira',
          capacidade_maxima: '25.000kg',
          tipos_carga: ['bebidas', 'construção'],
          avaliacao: 4.9,
          distancia_km: 120,
          tempo_estimado: '1h30min'
        },
        {
          id: '3',
          nome: 'Roberto Lima',
          telefone: '(21) 99999-0103',
          localizacao_atual: 'Niterói - RJ',
          destino: 'Vitória - ES',
          horario_disponivel: 'Até 16h',
          capacidade_maxima: '10.000kg',
          tipos_carga: ['alimentos'],
          avaliacao: 4.7,
          distancia_km: 320,
          tempo_estimado: '4h'
        }
      ]

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
      setTransportadoresDisponiveis(transportadoresDisponiveisData)
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
              <Link 
                href="/admin"
                className="btn btn-secondary flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Admin
              </Link>
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

      {/* Template Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 mb-3 sm:mb-0">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    📋 Template do Modelo E2 - Transportadora
                  </h3>
                  <div className="mt-2 text-xs sm:text-sm text-blue-700 space-y-2">
                    <p>
                      Este é o <strong>template frontend</strong> do painel/dashboard do <strong>gerente de uma transportadora</strong> 
                      no <strong>Modelo E2 (Volta com Fé)</strong>. Aqui são apresentados alguns recursos que estão atualmente implementados.
                    </p>
                    <p>
                      <strong>À medida que implementamos novos recursos, eles irão aparecendo aqui</strong> no modelo do painel 
                      do gerente de uma empresa tipo transportadora (Modelo E2).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

        {/* Transportadores Disponíveis */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Transportadores Disponíveis
            </h3>
            <p className="text-sm text-gray-500">Caminhoneiros independentes disponíveis para fretes</p>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {transportadoresDisponiveis.map((transportador) => (
                <li key={transportador.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="h-8 w-8 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transportador.nome}</p>
                        <p className="text-sm text-gray-500">{transportador.telefone}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            📍 {transportador.localizacao_atual}
                          </span>
                          <span className="text-xs text-blue-600">
                            → {transportador.destino}
                          </span>
                          <span className="text-xs text-green-600">
                            ⏰ {transportador.horario_disponivel}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {transportador.capacidade_maxima}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transportador.distancia_km}km - {transportador.tempo_estimado}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-yellow-600">⭐ {transportador.avaliacao}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {transportador.tipos_carga.join(', ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => abrirModalOferta(transportador)}
                          className="btn btn-primary text-sm"
                        >
                          Oferecer Frete
                        </button>
                        <button className="btn btn-outline text-sm">
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ofertas Enviadas */}
        {ofertasEnviadas.length > 0 && (
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Ofertas Enviadas
              </h3>
              <p className="text-sm text-gray-500">Suas ofertas para transportadores</p>
            </div>
            <div className="border-t border-gray-200">
              <ul role="list" className="divide-y divide-gray-200">
                {ofertasEnviadas.map((oferta) => (
                  <li key={oferta.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Truck className="h-8 w-8 text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {oferta.transportador_nome}
                          </p>
                          <p className="text-sm text-gray-500">
                            {oferta.origem} → {oferta.destino}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              📦 {oferta.peso} - {oferta.tipo_carga}
                            </span>
                            <span className="text-xs text-green-600">
                              💰 R$ {oferta.valor_proposto}
                            </span>
                            <span className="text-xs text-blue-600">
                              📅 {new Date(oferta.data_coleta).toLocaleDateString()} às {oferta.horario_coleta}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex items-center space-x-4">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          oferta.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                          oferta.status === 'aceita' ? 'bg-green-100 text-green-800' :
                          oferta.status === 'recusada' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {oferta.status === 'pendente' ? 'Aguardando' :
                           oferta.status === 'aceita' ? 'Aceita' :
                           oferta.status === 'recusada' ? 'Recusada' :
                           'Negociando'}
                        </span>
                        <button className="btn btn-outline text-sm">
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Modal de Oferta */}
        {modalOferta.aberto && modalOferta.transportador && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Oferecer Frete para {modalOferta.transportador.nome}
                  </h3>
                  <button
                    onClick={fecharModalOferta}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Origem
                      </label>
                      <input
                        type="text"
                        value={novaOferta.origem}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, origem: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Destino
                      </label>
                      <input
                        type="text"
                        value={novaOferta.destino}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, destino: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Peso
                      </label>
                      <input
                        type="text"
                        value={novaOferta.peso}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, peso: e.target.value }))}
                        placeholder="Ex: 15.000kg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Carga
                      </label>
                      <select
                        value={novaOferta.tipo_carga}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, tipo_carga: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="bebidas">Bebidas</option>
                        <option value="alimentos">Alimentos</option>
                        <option value="construção">Construção</option>
                        <option value="químicos">Químicos</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data de Coleta
                      </label>
                      <input
                        type="date"
                        value={novaOferta.data_coleta}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, data_coleta: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário
                      </label>
                      <input
                        type="time"
                        value={novaOferta.horario_coleta}
                        onChange={(e) => setNovaOferta(prev => ({ ...prev, horario_coleta: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Proposto (R$)
                    </label>
                    <input
                      type="text"
                      value={novaOferta.valor_proposto}
                      onChange={(e) => setNovaOferta(prev => ({ ...prev, valor_proposto: e.target.value }))}
                      placeholder="Ex: 2.500,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={novaOferta.observacoes}
                      onChange={(e) => setNovaOferta(prev => ({ ...prev, observacoes: e.target.value }))}
                      placeholder="Informações adicionais sobre o frete..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={fecharModalOferta}
                    className="btn btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={enviarOferta}
                    className="btn btn-primary"
                  >
                    Enviar Oferta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
