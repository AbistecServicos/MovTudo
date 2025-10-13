'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Building2, MapPin, Phone, Users, Edit, Trash2, Eye } from 'lucide-react'
import { supabaseAdmin } from '@/lib/supabase'
import { Empresa } from '@/types'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    loadEmpresas()
  }, [])

  const loadEmpresas = async () => {
    try {
      console.log('🔍 Buscando empresas...')
      
      // Usa supabaseAdmin para ignorar RLS e permitir que admin veja todas as empresas
      const { data, error } = await supabaseAdmin
        .from('empresas')
        .select('*')
        .order('data_criacao', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar empresas:', error)
        throw error
      }

      console.log(`✅ ${data?.length || 0} empresa(s) encontrada(s)`)
      setEmpresas(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar empresas:', error)
      toast.error('Erro ao carregar empresas')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEmpresa = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a empresa "${nome}"?`)) {
      return
    }

    try {
      const { error } = await supabaseAdmin
        .from('empresas')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success('Empresa excluída com sucesso!')
      loadEmpresas()
    } catch (error: any) {
      console.error('Erro ao excluir empresa:', error)
      toast.error('Erro ao excluir empresa')
    }
  }

  const toggleEmpresaStatus = async (id: number, ativa: boolean, nome: string) => {
    try {
      const { error } = await supabaseAdmin
        .from('empresas')
        .update({ ativa: !ativa })
        .eq('id', id)

      if (error) {
        throw error
      }

      toast.success(`Empresa ${!ativa ? 'ativada' : 'desativada'} com sucesso!`)
      loadEmpresas()
    } catch (error: any) {
      console.error('Erro ao alterar status da empresa:', error)
      toast.error('Erro ao alterar status da empresa')
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
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Empresas de Transporte
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie todas as empresas cadastradas no sistema
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/admin/empresas/nova" className="btn btn-primary">
            <Plus className="mr-2 h-5 w-5" />
            Nova Empresa
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Empresas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {empresas.length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Empresas Ativas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {empresas.filter(e => e.ativa).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Empresas Inativas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {empresas.filter(e => !e.ativa).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Com URLs Personalizadas
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {empresas.filter(e => e.slug).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Empresas List */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Lista de Empresas
          </h3>
        </div>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Empresa</th>
                  <th className="table-header-cell">Localização</th>
                  <th className="table-header-cell">Contato</th>
                  <th className="table-header-cell">Status</th>
                  <th className="table-header-cell">Criada em</th>
                  <th className="table-header-cell">Ações</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {empresas.map((empresa) => (
                  <tr key={empresa.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center">
                        {empresa.empresa_logo ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={empresa.empresa_logo}
                            alt={empresa.empresa_nome}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary-600" />
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {empresa.empresa_nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {empresa.id_empresa}
                          </div>
                          {empresa.slug && (
                            <div className="text-xs text-primary-600">
                              movtudo.com/{empresa.slug}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1" />
                        {empresa.empresa_cidade && empresa.empresa_estado
                          ? `${empresa.empresa_cidade}, ${empresa.empresa_estado}`
                          : 'Não informado'
                        }
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-1" />
                        {empresa.empresa_telefone}
                      </div>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => toggleEmpresaStatus(empresa.id, empresa.ativa, empresa.empresa_nome)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          empresa.ativa
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {empresa.ativa ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-500">
                        {new Date(empresa.data_criacao).toLocaleDateString('pt-BR')}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/empresas/${empresa.id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/empresas/${empresa.id}/editar`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteEmpresa(empresa.id, empresa.empresa_nome)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {empresas.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma empresa cadastrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando sua primeira empresa de transporte.
            </p>
            <div className="mt-6">
              <Link href="/admin/empresas/nova" className="btn btn-primary">
                <Plus className="mr-2 h-5 w-5" />
                Nova Empresa
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
