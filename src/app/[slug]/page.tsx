'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Empresa } from '@/types'
import Link from 'next/link'
import { Car, MapPin, Phone, Clock, LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import toast from 'react-hot-toast'

export default function EmpresaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, signOut } = useAuth()
  
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      loadEmpresa()
    }
  }, [slug])

  const loadEmpresa = async () => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('slug', slug)
        .eq('ativa', true)
        .single()

      if (error || !data) {
        toast.error('Empresa não encontrada')
        router.push('/')
        return
      }

      setEmpresa(data)
    } catch (error) {
      console.error('Erro ao carregar empresa:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
    } catch (error) {
      console.error('Erro no logout:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  if (loading || !empresa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(135deg, ${empresa.cor_primaria}15 0%, ${empresa.cor_secundaria}15 100%)`
    }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {empresa.empresa_logo && (
                <img
                  src={empresa.empresa_logo}
                  alt={empresa.empresa_nome}
                  className="h-12 w-12 object-contain"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold" style={{ color: empresa.cor_primaria }}>
                  {empresa.empresa_nome}
                </h1>
                <p className="text-sm text-gray-500">
                  {empresa.empresa_cidade && empresa.empresa_estado 
                    ? `${empresa.empresa_cidade}, ${empresa.empresa_estado}`
                    : 'Transporte e Entregas'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.nome || user.email}</span>
                  </div>
                  <Link 
                    href="/perfil"
                    className="btn btn-outline flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href={`/${slug}/login`}
                    className="btn btn-secondary"
                  >
                    Entrar
                  </Link>
                  <Link 
                    href={`/${slug}/cadastro`}
                    className="btn btn-primary"
                    style={{ backgroundColor: empresa.cor_primaria }}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transporte Rápido e Seguro
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {empresa.sobre_empresa || 'Seu parceiro de confiança para transporte e entregas'}
          </p>
          
                 {user && empresaAssociada && empresaAssociada.funcao === 'transportador' ? (
                   <Link
                     href="/transportador-transportadora"
                     className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow"
                     style={{ backgroundColor: empresa.cor_primaria }}
                   >
                     <Car className="mr-3 h-6 w-6" />
                     Meu Dashboard
                   </Link>
                 ) : (
                   <Link
                     href={`/${slug}/solicitar`}
                     className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow"
                     style={{ backgroundColor: empresa.cor_primaria }}
                   >
                     <Car className="mr-3 h-6 w-6" />
                     Solicitar Corrida Agora
                   </Link>
                 )}
        </div>
      </section>

      {/* Informações */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contato */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Phone className="h-6 w-6 mr-3" style={{ color: empresa.cor_primaria }} />
              <h3 className="text-lg font-semibold">Contato</h3>
            </div>
            <p className="text-gray-600">{empresa.empresa_telefone}</p>
            {empresa.empresa_endereco && (
              <>
                <div className="flex items-center mt-4 mb-2">
                  <MapPin className="h-5 w-5 mr-2" style={{ color: empresa.cor_secundaria }} />
                  <h4 className="font-medium">Endereço</h4>
                </div>
                <p className="text-sm text-gray-600">{empresa.empresa_endereco}</p>
              </>
            )}
          </div>

          {/* Área de Atendimento */}
          {empresa.empresa_perimetro_entrega && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 mr-3" style={{ color: empresa.cor_primaria }} />
                <h3 className="text-lg font-semibold">Área de Atendimento</h3>
              </div>
              <p className="text-gray-600">{empresa.empresa_perimetro_entrega}</p>
            </div>
          )}

          {/* Horário */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 mr-3" style={{ color: empresa.cor_primaria }} />
              <h3 className="text-lg font-semibold">Horário</h3>
            </div>
            <p className="text-gray-600">24 horas por dia</p>
            <p className="text-sm text-gray-500">7 dias por semana</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          {user ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Bem-vindo de volta!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Olá, {user.nome || 'Usuário'}! Pronto para solicitar sua próxima corrida?
              </p>
                       <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                         {user && empresaAssociada && empresaAssociada.funcao === 'transportador' ? (
                           <>
                             <Link
                               href="/transportador-transportadora"
                               className="btn btn-primary btn-lg"
                               style={{ backgroundColor: empresa.cor_primaria }}
                             >
                               Meu Dashboard
                             </Link>
                             <Link
                               href="/perfil"
                               className="btn btn-outline btn-lg"
                             >
                               Meu Perfil
                             </Link>
                           </>
                         ) : (
                           <>
                             <Link
                               href={`/${slug}/solicitar`}
                               className="btn btn-primary btn-lg"
                               style={{ backgroundColor: empresa.cor_primaria }}
                             >
                               Solicitar Corrida
                             </Link>
                             <Link
                               href="/perfil"
                               className="btn btn-outline btn-lg"
                             >
                               Meu Perfil
                             </Link>
                           </>
                         )}
                       </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pronto para começar?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Solicite sua corrida agora mesmo ou crie uma conta para ter acesso a benefícios exclusivos
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href={`/${slug}/solicitar`}
                  className="btn btn-primary btn-lg"
                  style={{ backgroundColor: empresa.cor_primaria }}
                >
                  Solicitar Corrida
                </Link>
                <Link
                  href="/cadastro"
                  className="btn btn-secondary btn-lg"
                >
                  Criar Conta Grátis
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; {new Date().getFullYear()} {empresa.empresa_nome}. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">
              Powered by <span className="font-semibold">MovTudo</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
