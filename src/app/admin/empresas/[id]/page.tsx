'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Building2, MapPin, Phone, Calendar, Users, Edit, Globe, 
  ExternalLink, User, Car, Briefcase, Shield, CheckCircle, XCircle 
} from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import { Empresa, EmpresaAssociada } from '@/types'
import toast from 'react-hot-toast'

export default function EmpresaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState<EmpresaAssociada[]>([])
  const [stats, setStats] = useState({
    totalGerentes: 0,
    totalTransportadores: 0,
    totalCorridas: 0,
    corridasHoje: 0,
    faturamentoMes: 0
  })

  useEffect(() => {
    const identifier = params.id as string
    if (identifier) {
      loadEmpresa(identifier)
    }
  }, [params.id])

  const loadEmpresa = async (identifier: string) => {
    try {
      console.log('🔍 Buscando empresa:', identifier)
      
      // Tentar buscar por ID numérico primeiro
      let query = supabaseAdmin.from('empresas').select('*')
      
      // Verificar se é número
      if (/^\d+$/.test(identifier)) {
        query = query.eq('id', parseInt(identifier))
      } else {
        // Se não for número, buscar por slug
        query = query.eq('slug', identifier)
      }

      const { data, error } = await query.single()

      if (error) {
        console.error('❌ Erro ao buscar empresa:', error)
        toast.error('Empresa não encontrada')
        router.push('/admin/empresas')
        return
      }

      console.log('✅ Empresa encontrada:', data.empresa_nome)
      setEmpresa(data)
      await loadUsuarios(data.id_empresa)
      await loadStats(data.id_empresa)
    } catch (error: any) {
      console.error('Erro ao carregar empresa:', error)
      toast.error('Erro ao carregar empresa')
      router.push('/admin/empresas')
    } finally {
      setLoading(false)
    }
  }

  const loadUsuarios = async (idEmpresa: string) => {
    try {
      console.log('👥 Buscando usuários da empresa:', idEmpresa)
      
      const { data, error } = await supabaseAdmin
        .from('empresa_associada')
        .select('*')
        .eq('id_empresa', idEmpresa)
        .eq('status_vinculacao', 'ativo')
        .order('funcao', { ascending: true })
        .order('nome_completo', { ascending: true })

      if (error) throw error

      console.log(`✅ ${data?.length || 0} usuário(s) encontrado(s)`)
      setUsuarios(data || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    }
  }

  const loadStats = async (idEmpresa: string) => {
    try {
      console.log('📊 Carregando estatísticas da empresa:', idEmpresa)
      
      // Contar gerentes
      const { count: gerentesCount } = await supabaseAdmin
        .from('empresa_associada')
        .select('*', { count: 'exact', head: true })
        .eq('id_empresa', idEmpresa)
        .eq('funcao', 'gerente')
        .eq('status_vinculacao', 'ativo')

      // Contar transportadores
      const { count: transportadoresCount } = await supabaseAdmin
        .from('empresa_associada')
        .select('*', { count: 'exact', head: true })
        .eq('id_empresa', idEmpresa)
        .eq('funcao', 'transportador')
        .eq('status_vinculacao', 'ativo')

      // Contar corridas
      const { count: totalCorridasCount } = await supabaseAdmin
        .from('corridas')
        .select('*', { count: 'exact', head: true })
        .eq('id_empresa', idEmpresa)

      // Contar corridas de hoje
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const { count: corridasHojeCount } = await supabaseAdmin
        .from('corridas')
        .select('*', { count: 'exact', head: true })
        .eq('id_empresa', idEmpresa)
        .gte('data', hoje.toISOString())

      // Calcular faturamento do mês
      const inicioMes = new Date()
      inicioMes.setDate(1)
      inicioMes.setHours(0, 0, 0, 0)
      
      const { data: corridasMes } = await supabaseAdmin
        .from('corridas')
        .select('preco_calculado')
        .eq('id_empresa', idEmpresa)
        .eq('status_transporte', 'entregue')
        .gte('data', inicioMes.toISOString())

      const faturamento = corridasMes?.reduce((sum, c) => sum + (c.preco_calculado || 0), 0) || 0

      setStats({
        totalGerentes: gerentesCount || 0,
        totalTransportadores: transportadoresCount || 0,
        totalCorridas: totalCorridasCount || 0,
        corridasHoje: corridasHojeCount || 0,
        faturamentoMes: faturamento
      })
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const getFuncaoIcon = (funcao: string) => {
    switch (funcao) {
      case 'gerente':
        return <Briefcase className="h-5 w-5 text-blue-600" />
      case 'transportador':
        return <Car className="h-5 w-5 text-green-600" />
      case 'admin':
        return <Shield className="h-5 w-5 text-purple-600" />
      default:
        return <User className="h-5 w-5 text-gray-600" />
    }
  }

  const getFuncaoBadge = (funcao: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      gerente: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Gerente' },
      transportador: { bg: 'bg-green-100', text: 'text-green-800', label: 'Transportador' },
      admin: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Admin' },
    }
    const badge = badges[funcao] || { bg: 'bg-gray-100', text: 'text-gray-800', label: funcao }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Empresa não encontrada
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          A empresa que você está procurando não existe.
        </p>
        <div className="mt-6">
          <Link href="/admin/empresas" className="btn btn-primary">
            Voltar para Empresas
          </Link>
        </div>
      </div>
    )
  }

  const gerentes = usuarios.filter(u => u.funcao === 'gerente')
  const transportadores = usuarios.filter(u => u.funcao === 'transportador')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/empresas"
            className="mr-4 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {empresa.empresa_nome}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              ID: {empresa.id_empresa} • Criada em {new Date(empresa.data_criacao).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link 
            href={`/admin/empresas/${empresa.id}/editar`} 
            className="btn btn-outline"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
          {empresa.slug && (
            <a
              href={`/${empresa.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ver Site
            </a>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Gerentes
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalGerentes}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Car className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Transportadores
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalTransportadores}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Corridas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.totalCorridas}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Hoje
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stats.corridasHoje}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-sm">R$</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Mês
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  R$ {stats.faturamentoMes.toFixed(2)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Empresa Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações Básicas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Informações da Empresa
              </h3>
            </div>
            <div className="card-body space-y-6">
              {/* Logo e Nome */}
              <div className="flex items-center space-x-4">
                {empresa.empresa_logo ? (
                  <img
                    className="h-20 w-20 rounded-lg object-cover border border-gray-200"
                    src={empresa.empresa_logo}
                    alt={empresa.empresa_nome}
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-primary-100 flex items-center justify-center border border-gray-200">
                    <Building2 className="h-10 w-10 text-primary-600" />
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    {empresa.empresa_nome}
                  </h4>
                  <p className="text-sm text-gray-500">ID: {empresa.id_empresa}</p>
                  {empresa.slug && (
                    <p className="text-sm text-primary-600">
                      <Globe className="inline h-4 w-4 mr-1" />
                      movtudo.com/{empresa.slug}
                    </p>
                  )}
                </div>
              </div>

              {/* Informações de Contato */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Endereço</p>
                    <p className="text-sm text-gray-500">{empresa.empresa_endereco}</p>
                    {empresa.empresa_cidade && empresa.empresa_estado && (
                      <p className="text-sm text-gray-500">
                        {empresa.empresa_cidade}, {empresa.empresa_estado}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Telefone</p>
                    <p className="text-sm text-gray-500">{empresa.empresa_telefone}</p>
                  </div>
                </div>
              </div>

              {/* CNPJ e Perímetro */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">CNPJ</p>
                  <p className="text-sm text-gray-500">{empresa.cnpj}</p>
                </div>
                {empresa.empresa_perimetro_entrega && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Perímetro de Entrega</p>
                    <p className="text-sm text-gray-500">{empresa.empresa_perimetro_entrega}</p>
                  </div>
                )}
              </div>

              {/* Descrição */}
              {empresa.sobre_empresa && (
                <div>
                  <p className="text-sm font-medium text-gray-900">Sobre a Empresa</p>
                  <p className="text-sm text-gray-500 mt-1">{empresa.sobre_empresa}</p>
                </div>
              )}

              {/* Status e Cores */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    empresa.ativa
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {empresa.ativa ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Ativa</>
                    ) : (
                      <><XCircle className="h-3 w-3 mr-1" /> Inativa</>
                    )}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">Cores da Marca</p>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: empresa.cor_primaria }}
                      title={empresa.cor_primaria}
                    ></div>
                    <div 
                      className="w-8 h-8 rounded-full border border-gray-200"
                      style={{ backgroundColor: empresa.cor_secundaria }}
                      title={empresa.cor_secundaria}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usuários Associados */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Usuários da Empresa
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Gerentes: limitados a 1 empresa • Transportadores: podem ter várias empresas
                </p>
              </div>
            </div>
            <div className="card-body">
              {usuarios.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Nenhum usuário associado a esta empresa</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Gerentes */}
                  {gerentes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                        Gerentes ({gerentes.length})
                      </h4>
                      <div className="space-y-2">
                        {gerentes.map((usuario) => (
                          <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {usuario.nome_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{usuario.nome_completo}</p>
                                <p className="text-xs text-gray-500">{usuario.email_usuario}</p>
                              </div>
                            </div>
                            <div>
                              {getFuncaoBadge(usuario.funcao)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transportadores */}
                  {transportadores.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <Car className="h-4 w-4 mr-2 text-green-600" />
                        Transportadores ({transportadores.length})
                      </h4>
                      <div className="space-y-2">
                        {transportadores.map((usuario) => (
                          <div key={usuario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-green-600">
                                    {usuario.nome_completo.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{usuario.nome_completo}</p>
                                <p className="text-xs text-gray-500">{usuario.email_usuario}</p>
                                {usuario.veiculo && (
                                  <p className="text-xs text-gray-500">
                                    Veículo: {usuario.veiculo}
                                    {usuario.carga_maxima && ` • ${usuario.carga_maxima}kg`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getFuncaoBadge(usuario.funcao)}
                              <div className="text-xs text-gray-500">
                                {usuario.ano_entregue} entregas
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Links Úteis */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Links Úteis
              </h3>
            </div>
            <div className="card-body space-y-3">
              <Link
                href={`/admin/usuarios?empresa=${empresa.id_empresa}`}
                className="flex items-center text-sm text-primary-600 hover:text-primary-900"
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </Link>
              <Link
                href={`/admin/corridas?empresa=${empresa.id_empresa}`}
                className="flex items-center text-sm text-primary-600 hover:text-primary-900"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Ver Corridas
              </Link>
              {empresa.slug && (
                <a
                  href={`/${empresa.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-primary-600 hover:text-primary-900"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar Site da Empresa
                </a>
              )}
            </div>
          </div>

          {/* Metadados */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">
                Informações do Sistema
              </h3>
            </div>
            <div className="card-body space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500">Criada em</p>
                <p className="text-sm text-gray-900">{new Date(empresa.data_criacao).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Última Atualização</p>
                <p className="text-sm text-gray-900">{new Date(empresa.data_atualizacao).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



