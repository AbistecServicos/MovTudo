'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Empresa } from '@/types'
import { Car, Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CadastroEmpresaPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const { signUp, user } = useAuth()
  
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (slug && !empresa) {
      loadEmpresa()
    }
  }, [slug])

  // Redirecionar se já está logado
  useEffect(() => {
    if (user && !loading) {
      router.push(`/${slug}`)
    }
  }, [user, loading])

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
      toast.error('Erro ao carregar empresa')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validações
    if (!formData.nome_completo || !formData.email || !formData.telefone || !formData.password) {
      toast.error('Preencha todos os campos')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setSubmitting(true)

    try {
      const nomeUsuario = formData.email.split('@')[0]
      
      await signUp(formData.email, formData.password, {
        nome_usuario: nomeUsuario,
        nome_completo: formData.nome_completo,
        telefone: formData.telefone,
        is_admin: false
      })

      toast.success('Conta criada com sucesso!')
      toast.info('Verifique seu email para confirmar o cadastro')
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        router.push(`/${slug}/login`)
      }, 2000)
      
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      // Erros já são tratados no signUp
    } finally {
      setSubmitting(false)
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
    <div className="min-h-screen flex flex-col" style={{
      background: `linear-gradient(135deg, ${empresa.cor_primaria}15 0%, ${empresa.cor_secundaria}15 100%)`
    }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${slug}`} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Voltar</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              {empresa.empresa_logo && (
                <img
                  src={empresa.empresa_logo}
                  alt={empresa.empresa_nome}
                  className="h-10 w-10 object-contain"
                />
              )}
              <span className="text-lg font-semibold" style={{ color: empresa.cor_primaria }}>
                {empresa.empresa_nome}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cadastro Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Car className="mx-auto h-12 w-12" style={{ color: empresa.cor_primaria }} />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Criar Conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Cadastre-se na {empresa.empresa_nome}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nome Completo */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="nome"
                    type="text"
                    required
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                    className="input pl-10"
                    placeholder="João Silva"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input pl-10"
                    placeholder="seu@email.com"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="telefone"
                    type="tel"
                    required
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    className="input pl-10"
                    placeholder="(21) 99999-9999"
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input pl-10 pr-10"
                    placeholder="••••••••"
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmar Senha */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input pl-10"
                    placeholder="••••••••"
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn btn-primary btn-lg"
                style={{ backgroundColor: empresa.cor_primaria }}
              >
                {submitting ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link 
                  href={`/${slug}/login`} 
                  className="font-medium hover:underline"
                  style={{ color: empresa.cor_primaria }}
                >
                  Faça login
                </Link>
              </p>
              
              <p className="mt-4 text-sm text-gray-600">
                É transportador ou gerente?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-gray-700 hover:underline"
                >
                  Acesse o portal profissional
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {empresa.empresa_nome}
        </div>
      </footer>
    </div>
  )
}

