'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Phone, Calendar, Building2, AlertCircle, LogOut } from 'lucide-react'
import PhotoUpload from '@/components/PhotoUpload'
import TelefoneEditor from '@/components/TelefoneEditor'

export default function PerfilPage() {
  const { user, empresa, empresaAssociada, loading, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  useEffect(() => {
    // Se for admin, redireciona para área administrativa
    if (user?.is_admin) {
      router.push('/admin/empresas')
      return
    }
  }, [user, router])

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
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header com botão de logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meu Perfil</h1>
            <p className="text-gray-600">Informações da sua conta</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </button>
        </div>

        {/* Card de Perfil */}
        <div className="card p-8 mb-6">
          <div className="flex items-center mb-6">
            <PhotoUpload 
              currentPhoto={user.foto}
              userId={user.uid}
            />
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.nome_completo}</h2>
              <p className="text-gray-500">@{user.nome_usuario}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Telefone - Editável */}
            <TelefoneEditor 
              currentTelefone={user.telefone}
              userId={user.uid}
            />

            {/* Data de Cadastro */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Membro desde</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.data_cadastro).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status de Associação */}
        {!empresaAssociada ? (
          <div className="card p-6 border-l-4 border-yellow-500">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aguardando Associação
                </h3>
                <p className="text-gray-600 mb-4">
                  Você ainda não está associado a nenhuma empresa de transporte. 
                  Para começar a trabalhar como transportador, entre em contato com 
                  uma empresa parceira.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    Como me associar?
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Entre em contato com uma empresa de transporte</li>
                    <li>• Forneça seu email: <strong>{user.email}</strong></li>
                    <li>• Aguarde a aprovação do gerente da empresa</li>
                    <li>• Após aprovado, você terá acesso ao sistema de corridas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-6 border-l-4 border-green-500">
            <div className="flex items-start">
              <Building2 className="w-6 h-6 text-green-500 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Empresa Associada
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Empresa:</strong> {empresa?.empresa_nome}
                  </p>
                  <p className="text-gray-700">
                    <strong>Função:</strong> {empresaAssociada.funcao === 'gerente' ? 'Gerente' : 'Transportador'}
                  </p>
                  {empresaAssociada.veiculo && (
                    <p className="text-gray-700">
                      <strong>Veículo:</strong> {empresaAssociada.veiculo}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      if (empresaAssociada.funcao === 'gerente') {
                        router.push('/gerente')
                      } else if (empresaAssociada.funcao === 'transportador') {
                        // Se for transportador de transportadora, vai para página específica
                        if (empresa && empresa.id_empresa === 'E2') {
                          router.push('/transportador-transportadora')
                        } else {
                          router.push('/transportador')
                        }
                      }
                    }}
                    className="btn btn-primary"
                  >
                    Acessar Dashboard
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

