'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Usuario {
  id: number
  uid: string
  email: string
  nome_usuario: string
  nome_completo: string
  telefone: string
  foto: string | null
  data_cadastro: string
  is_admin: boolean
}

interface EmpresaAssociada {
  id: number
  uid_usuario: string
  nome_completo: string
  funcao: string
  id_empresa: string
  status_vinculacao: string
  empresa_nome: string
  ultimo_status_vinculacao: string
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [empresasAssociadas, setEmpresasAssociadas] = useState<EmpresaAssociada[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    loadUsuarios()
  }, [])

  const loadUsuarios = async () => {
    try {
      setLoading(true)

      // Buscar usuários
      const { data: usuariosData, error: usuariosError } = await supabase
        .from('usuarios')
        .select('*')
        .order('data_cadastro', { ascending: false })

      if (usuariosError) throw usuariosError

      // Buscar associações com empresas
      const { data: associacoesData, error: associacoesError } = await supabase
        .from('empresa_associada')
        .select('*')

      if (associacoesError) throw associacoesError

      setUsuarios(usuariosData || [])
      setEmpresasAssociadas(associacoesData || [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUsuarioEmpresa = (uid: string) => {
    return empresasAssociadas.find(a => a.uid_usuario === uid)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'inativo':
        return 'bg-red-100 text-red-800'
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (isAdmin: boolean, funcao?: string) => {
    if (isAdmin) {
      return <Shield className="h-4 w-4 text-purple-600" />
    }
    if (funcao === 'gerente') {
      return <Building2 className="h-4 w-4 text-blue-600" />
    }
    if (funcao === 'transportador') {
      return <User className="h-4 w-4 text-green-600" />
    }
    return <User className="h-4 w-4 text-gray-600" />
  }

  const getRoleText = (isAdmin: boolean, funcao?: string) => {
    if (isAdmin) return 'Administrador'
    if (funcao === 'gerente') return 'Gerente'
    if (funcao === 'transportador') return 'Transportador'
    return 'Cliente'
  }

  const filteredUsuarios = usuarios.filter(usuario => {
    const associacao = getUsuarioEmpresa(usuario.uid)
    const matchesSearch = 
      usuario.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === 'all' || 
      (filterRole === 'admin' && usuario.is_admin) ||
      (filterRole === 'gerente' && associacao?.funcao === 'gerente') ||
      (filterRole === 'transportador' && associacao?.funcao === 'transportador') ||
      (filterRole === 'cliente' && !usuario.is_admin && !associacao)

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'ativo' && associacao?.status_vinculacao === 'ativo') ||
      (filterStatus === 'inativo' && associacao?.status_vinculacao === 'inativo') ||
      (filterStatus === 'sem_vinculo' && !associacao)

    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: usuarios.length,
    admins: usuarios.filter(u => u.is_admin).length,
    gerentes: usuarios.filter(u => getUsuarioEmpresa(u.uid)?.funcao === 'gerente').length,
    transportadores: usuarios.filter(u => getUsuarioEmpresa(u.uid)?.funcao === 'transportador').length,
    clientes: usuarios.filter(u => !u.is_admin && !getUsuarioEmpresa(u.uid)).length,
    ativos: usuarios.filter(u => getUsuarioEmpresa(u.uid)?.status_vinculacao === 'ativo').length
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
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="btn btn-primary flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-lg font-semibold text-gray-900">{stats.admins}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Gerentes</p>
                <p className="text-lg font-semibold text-gray-900">{stats.gerentes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Transportadores</p>
                <p className="text-lg font-semibold text-gray-900">{stats.transportadores}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Clientes</p>
                <p className="text-lg font-semibold text-gray-900">{stats.clientes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Ativos</p>
                <p className="text-lg font-semibold text-gray-900">{stats.ativos}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Buscar usuários..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input"
            >
              <option value="all">Todos os tipos</option>
              <option value="admin">Administradores</option>
              <option value="gerente">Gerentes</option>
              <option value="transportador">Transportadores</option>
              <option value="cliente">Clientes</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">Todos os status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="sem_vinculo">Sem vínculo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="card">
        <div className="card-body p-0">
          {filteredUsuarios.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum usuário encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro usuário.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cadastro
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsuarios.map((usuario) => {
                    const associacao = getUsuarioEmpresa(usuario.uid)
                    return (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {usuario.foto ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={usuario.foto}
                                  alt={usuario.nome_completo}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {usuario.nome_completo}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {usuario.email}
                              </div>
                              {usuario.telefone && (
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {usuario.telefone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRoleIcon(usuario.is_admin, associacao?.funcao)}
                            <span className="text-sm text-gray-900">
                              {getRoleText(usuario.is_admin, associacao?.funcao)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {associacao ? associacao.empresa_nome : '-'}
                          </div>
                          {associacao && (
                            <div className="text-sm text-gray-500">
                              ID: {associacao.id_empresa}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {associacao ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(associacao.status_vinculacao)}`}>
                              {associacao.status_vinculacao}
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Sem vínculo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(usuario.data_cadastro).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
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
    </div>
  )
}




